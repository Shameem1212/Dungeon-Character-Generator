import { Thought, User } from "../models/index.js";
import Character from "../models/Character.js";
import { signToken, AuthenticationError } from "../utils/auth.js";

interface AddUserArgs {
  input: {
    username: string;
    email: string;
    password: string;
  };
}

interface LoginUserArgs {
  email: string;
  password: string;
}

interface UserArgs {
  username: string;
}

interface ThoughtArgs {
  thoughtId: string;
}

interface AddThoughtArgs {
  input: {
    thoughtText: string;
    thoughtAuthor: string;
  };
}

interface AddCommentArgs {
  thoughtId: string;
  commentText: string;
}

interface RemoveCommentArgs {
  thoughtId: string;
  commentId: string;
}

interface CreateCharacterArgs {
  input: any;
}

const resolvers = {
  Query: {
    users: async () => User.find().populate("thoughts"),
    user: async (_parent: any, { username }: UserArgs) => User.findOne({ username }).populate("thoughts"),
    thoughts: async () => Thought.find().sort({ createdAt: -1 }),
    thought: async (_parent: any, { thoughtId }: ThoughtArgs) => Thought.findOne({ _id: thoughtId }),
    me: async (_parent: any, _args: any, context: any) => {
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
      } catch (error) {
        console.error("Error fetching races:", error);
        return [];
      }
    },
    getSubraces: async (_: any, { raceIndex }: { raceIndex: string }) => {
      try {
        const response = await fetch("https://www.dnd5eapi.co/api/subraces");
        const data = await response.json();
        const subraceResults = data.results;
        const matchingSubraces = [];

        for (const subrace of subraceResults) {
          const subraceResponse = await fetch(`https://www.dnd5eapi.co${subrace.url}`);
          const subraceDetails = await subraceResponse.json();
          const belongsToRace = subraceDetails.races?.some((race: { index: string }) => race.index === raceIndex);
          if (belongsToRace) {
            matchingSubraces.push({
              index: subraceDetails.index,
              name: subraceDetails.name,
              url: subraceDetails.url,
            });
          }
        }
        return matchingSubraces;
      } catch (error) {
        console.error("Error fetching or filtering subraces:", error);
        return [];
      }
    },
    getClasses: async () => {
      try {
        const response = await fetch("https://www.dnd5eapi.co/api/classes");
        const data = await response.json();
        return data.results;
      } catch (error) {
        console.error("Error fetching classes:", error);
        return [];
      }
    },
    getProficiencies: async (_: any, { classIndex, raceIndex }: { classIndex: string; raceIndex: string }) => {
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
            optionalProfs = choice.from.map((entry: any) => {
              if (entry.option?.item) return entry.option.item;
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
      } catch (error) {
        console.error("Error fetching proficiencies:", error);
        return {
          static: [],
          optional: [],
          chooseAmount: 0,
        };
      }
    },
    getCharacters: async (_parent: any, _args: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError("Not logged in.");
      }
      return Character.find({ owner: context.user._id });
    },
  },

  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs) => {
      const user = await User.create({ ...input });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      const user = await User.findOne({ email });
      if (!user) throw new AuthenticationError("Could not authenticate user.");
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) throw new AuthenticationError("Could not authenticate user.");
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    addThought: async (_parent: any, { input }: AddThoughtArgs, context: any) => {
      if (context.user) {
        const thought = await Thought.create({ ...input });
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { thoughts: thought._id } }
        );
        return thought;
      }
      throw AuthenticationError;
    },
    addComment: async (_parent: any, { thoughtId, commentText }: AddCommentArgs, context: any) => {
      if (context.user) {
        return Thought.findOneAndUpdate(
          { _id: thoughtId },
          {
            $addToSet: {
              comments: { commentText, commentAuthor: context.user.username },
            },
          },
          { new: true, runValidators: true }
        );
      }
      throw AuthenticationError;
    },
    removeThought: async (_parent: any, { thoughtId }: ThoughtArgs, context: any) => {
      if (context.user) {
        const thought = await Thought.findOneAndDelete({
          _id: thoughtId,
          thoughtAuthor: context.user.username,
        });
        if (!thought) throw AuthenticationError;
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { thoughts: thought._id } }
        );
        return thought;
      }
      throw AuthenticationError;
    },
    deleteCharacter: async (_parent: any, { id }: { id: string }, context: any) => {
      if (!context.user) throw new AuthenticationError("You must be logged in.");
      const result = await Character.deleteOne({ _id: id, owner: context.user._id });
      return result.deletedCount > 0;
    },
    createCharacter: async (_parent: any, { input }: CreateCharacterArgs, context: any) => {
      if (!context.user) throw new AuthenticationError("You must be logged in.");
      const newCharacter = await Character.create({ ...input, owner: context.user._id });
      return newCharacter;
    },
    updateCharacter: async (_: any, { id, input }: { id: string; input: any }, context: any) => {
      if (!context.user) throw new AuthenticationError("You must be logged in.");
      const updatedCharacter = await Character.findOneAndUpdate(
        { _id: id, owner: context.user._id },
        input,
        { new: true }
      );
      if (!updatedCharacter) throw new Error("Character not found or not authorized.");
      return updatedCharacter;
    },
    removeComment: async (_parent: any, { thoughtId, commentId }: RemoveCommentArgs, context: any) => {
      if (context.user) {
        return Thought.findOneAndUpdate(
          { _id: thoughtId },
          {
            $pull: {
              comments: {
                _id: commentId,
                commentAuthor: context.user.username,
              },
            },
          },
          { new: true }
        );
      }
      throw AuthenticationError;
    },
  },
};

export default resolvers;