export interface Character {
  _id: string;
  name: string;
  class: string;
  race: string;
  subrace?: string;
  level: number;

  stats?: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    health: number;
  };

  proficiencies?: string[];
  equipment?: string[];
  spells?: string[];

  notes?: string;
}
