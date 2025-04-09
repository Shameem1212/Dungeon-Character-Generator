import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { CREATE_CHARACTER } from "../utils/mutations";

const CharacterSpellsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const charData = location.state;

  const [spells, setSpells] = useState<string[]>([""]);
  const [createCharacter] = useMutation(CREATE_CHARACTER);

  const handleChange = (index: number, value: string) => {
    const updated = [...spells];
    updated[index] = value;
    setSpells(updated);
  };

  const handleAdd = () => {
    setSpells([...spells, ""]);
  };

  const handleRemove = (index: number) => {
    const updated = [...spells];
    updated.splice(index, 1);
    setSpells(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const input = {
      name: charData.name,
      class: charData.class,
      race: charData.race,
      subrace: charData.subrace,
      level: parseInt(charData.level), // ensure it's a number
      stats: charData.stats,
      proficiencies: charData.proficiencies || [],
      equipment: charData.equipment || [],
      spells,
      notes: charData.notes || '',
    };
  
    console.log(" Character Input Being Submitted:");
    console.log("Name:", input.name);
    console.log("Class:", input.class);
    console.log("Race:", input.race);
    console.log("Subrace:", input.subrace);
    console.log("Level:", input.level);
    console.log("Stats:", input.stats);
    console.log("Proficiencies:", input.proficiencies);
    console.log("Equipment:", input.equipment);
    console.log("Spells:", input.spells);
    console.log("Notes:", input.notes);
  
    try {
      const { data } = await createCharacter({
        variables: { input },
      });
  
      console.log(" Character created response:", data);
      console.log(" Character created with spells:", data.createCharacter);
      navigate("/characters", { state: { refresh: true } });

    } catch (err) {
      console.error(" Error saving character spells:", err);
    }
  };
  

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Add Spells</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {spells.map((spell, idx) => (
          <div key={idx} className="flex space-x-2">
            <input
              type="text"
              value={spell}
              onChange={(e) => handleChange(idx, e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Enter spell name"
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        ))}
        <div className="text-center space-x-4">
          <button
            type="button"
            onClick={handleAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Add Spell
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Finish Character
          </button>
        </div>
      </form>
    </div>
  );
};

export default CharacterSpellsPage;
