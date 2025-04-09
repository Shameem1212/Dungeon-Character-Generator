import { Thought, User } from "../models/index.js";
import Character from "../models/Character.js";
import { signToken, AuthenticationError } from "../utils/auth.js";
const resolvers = {
    Query: {
        users: async () => User.find().populate("thoughts"),
        user: async (_parent, { username }) => User.findOne({ username }).populate("thoughts"),
        thoughts: async () => Thought.find().sort({ createdAt: -1 }),
        thought: async (_parent, { thoughtId }) => Thought.findOne({ _id: thoughtId }),
        me: async (_parent, _args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate("thoughts");
            }
            throw new AuthenticationError("Could not authenticate user.");
        },
        getRaces: async () => {
            try {
                const response = await fetch("https://www.dnd5eapi.co/api/races");
                const data = await response.json();
                return data.results;
            }
            catch (error) {
                console.error("Error fetching races:", error);
                return [];
            }
        },
        getSubraces: async (_, { raceIndex }) => {
            try {
                const response = await fetch("https://www.dnd5eapi.co/api/subraces");
                const data = await response.json();
                const subraceResults = data.results;
                const matchingSubraces = [];
                for (const subrace of subraceResults) {
                    const subraceResponse = await fetch(`https://www.dnd5eapi.co${subrace.url}`);
                    const subraceDetails = await subraceResponse.json();
                    const belongsToRace = subraceDetails.races?.some((race) => race.index === raceIndex);
                    if (belongsToRace) {
                        matchingSubraces.push({
                            index: subraceDetails.index,
                            name: subraceDetails.name,
                            url: subraceDetails.url,
                        });
                    }
                }
                return matchingSubraces;
            }
            catch (error) {
                console.error("Error fetching or filtering subraces:", error);
                return [];
            }
        },
        getClasses: async () => {
            try {
                const response = await fetch("https://www.dnd5eapi.co/api/classes");
                const data = await response.json();
                return data.results;
            }
            catch (error) {
                console.error("Error fetching classes:", error);
                return [];
            }
        },
        getProficiencies: async (_, { classIndex, raceIndex }) => {
            try {
                const staticProfs = [];
                let optionalProfs = [];
                let chooseAmount = 0;
                if (classIndex) {
                    const classRes = await fetch(`https://www.dnd5eapi.co/api/classes/${classIndex}`);
                    const classData = await classRes.json();
                    if (Array.isArray(classData.proficiencies)) {
                        staticProfs.push(...classData.proficiencies);
                    }
                    const choice = classData.proficiency_choices?.[0];
                    if (choice && Array.isArray(choice.from)) {
                        chooseAmount = choice.choose || 0;
                        optionalProfs = choice.from.map((entry) => {
                            if (entry.option?.item)
                                return entry.option.item;
                            return entry;
                        });
                    }
                }
                if (raceIndex) {
                    const raceRes = await fetch(`https://www.dnd5eapi.co/api/races/${raceIndex}`);
                    const raceData = await raceRes.json();
                    if (Array.isArray(raceData.starting_proficiencies)) {
                        staticProfs.push(...raceData.starting_proficiencies);
                    }
                }
                return {
                    static: staticProfs,
                    optional: optionalProfs,
                    chooseAmount,
                };
            }
            catch (error) {
                console.error("Error fetching proficiencies:", error);
                return {
                    static: [],
                    optional: [],
                    chooseAmount: 0,
                };
            }
        },
        getCharacters: async (_parent, _args, context) => {
            if (!context.user) {
                throw new AuthenticationError("Not logged in.");
            }
            return Character.find({ owner: context.user._id });
        },
    },
    Mutation: {
        addUser: async (_parent, { input }) => {
            const user = await User.create({ ...input });
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        login: async (_parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user)
                throw new AuthenticationError("Could not authenticate user.");
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw)
                throw new AuthenticationError("Could not authenticate user.");
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        addThought: async (_parent, { input }, context) => {
            if (context.user) {
                const thought = await Thought.create({ ...input });
                await User.findOneAndUpdate({ _id: context.user._id }, { $addToSet: { thoughts: thought._id } });
                return thought;
            }
            throw AuthenticationError;
        },
        addComment: async (_parent, { thoughtId, commentText }, context) => {
            if (context.user) {
                return Thought.findOneAndUpdate({ _id: thoughtId }, {
                    $addToSet: {
                        comments: { commentText, commentAuthor: context.user.username },
                    },
                }, { new: true, runValidators: true });
            }
            throw AuthenticationError;
        },
        removeThought: async (_parent, { thoughtId }, context) => {
            if (context.user) {
                const thought = await Thought.findOneAndDelete({
                    _id: thoughtId,
                    thoughtAuthor: context.user.username,
                });
                if (!thought)
                    throw AuthenticationError;
                await User.findOneAndUpdate({ _id: context.user._id }, { $pull: { thoughts: thought._id } });
                return thought;
            }
            throw AuthenticationError;
        },
        deleteCharacter: async (_parent, { id }, context) => {
            if (!context.user)
                throw new AuthenticationError("You must be logged in.");
            const result = await Character.deleteOne({ _id: id, owner: context.user._id });
            return result.deletedCount > 0;
        },
        createCharacter: async (_parent, { input }, context) => {
            if (!context.user)
                throw new AuthenticationError("You must be logged in.");
            const newCharacter = await Character.create({ ...input, owner: context.user._id });
            return newCharacter;
        },
        updateCharacter: async (_, { id, input }, context) => {
            if (!context.user)
                throw new AuthenticationError("You must be logged in.");
            const updatedCharacter = await Character.findOneAndUpdate({ _id: id, owner: context.user._id }, input, { new: true });
            if (!updatedCharacter)
                throw new Error("Character not found or not authorized.");
            return updatedCharacter;
        },
        removeComment: async (_parent, { thoughtId, commentId }, context) => {
            if (context.user) {
                return Thought.findOneAndUpdate({ _id: thoughtId }, {
                    $pull: {
                        comments: {
                            _id: commentId,
                            commentAuthor: context.user.username,
                        },
                    },
                }, { new: true });
            }
            throw AuthenticationError;
        },
    },
};
export default resolvers;
