import mongoose from 'mongoose';

const characterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  class: { type: String, required: true },
  race: { type: String, required: true },
  subrace: { type: String },
  level: { type: Number, required: true },

  // Link to the user who owns this character
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Core stats
  stats: {
    strength: Number,
    dexterity: Number,
    constitution: Number,
    intelligence: Number,
    wisdom: Number,
    charisma: Number,
    health: Number,
  },

  // Chosen proficiencies
  proficiencies: [String],

  // Combat-related
  
  hitPoints: {
    current: Number,
  },

  // Manually entered items and spells
  equipment: [String],
  spells: [String],

  // Optional notes section
  notes: String,
}, { timestamps: true });

const Character = mongoose.model('Character', characterSchema);
export default Character;
