const Character = require("../models/Character.js");

const resolvers = {
  Query: {
    // Get all characters 
    getCharacters: async () => {
      try {
        return await Character.find();
      } catch (error) {
        throw new Error("Failed to fetch characters");
      }
    },

    // Get a character by ID
    getCharacter: async (_, { id }) => {
      try {
        return await Character.findById(id);
      } catch (error) {
        throw new Error("Character not found");
      }
    },
  },

  Mutation: {
    // Create a new character
    createCharacter: async (
      _,
      { name, class: charClass, race, level, stats, spells }
    ) => {
      try {
        const newCharacter = new Character({
          name,
          class: charClass,
          race,
          level,
          stats: stats || {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10,
          },
          spells: spells || [],
        });

        return await newCharacter.save();
      } catch (error) {
        throw new Error("Failed to create character");
      }
    },

    // Update a character's level or stats
    updateCharacter: async (_, { id, stats }) => {
      try {
        const updatedCharacter = await Character.findByIdAndUpdate(
          id,
          { stats, level },
          { new: true } // Return updated document
        );
        return updatedCharacter;
      } catch (error) {
        throw new Error("Failed to update character");
      }
    },

    // Delete a character
    deleteCharacter: async (_, { id }) => {
      try {
        await Character.findByIdAndDelete(id);
        return "Character deleted successfully";
      } catch (error) {
        throw new Error("Failed to delete character");
      }
    },
  },
};

module.exports = resolvers;
