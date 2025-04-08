import { useLocation, useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";

const CharacterEquipmentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const charData = location.state;

  const [equipmentItems, setEquipmentItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");

  const handleAddItem = () => {
    if (newItem.trim() && !equipmentItems.includes(newItem.trim())) {
      setEquipmentItems([...equipmentItems, newItem.trim()]);
      setNewItem("");
    }
  };

  const handleRemoveItem = (item: string) => {
    setEquipmentItems(equipmentItems.filter(e => e !== item));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate("/character-spells", {
      state: {
        ...charData,
        equipment: equipmentItems,
      },
    });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-center">Add Equipment</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          placeholder="Enter equipment item"
          className="flex-grow p-2 border rounded"
        />
        <button
          type="button"
          onClick={handleAddItem}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <ul className="mb-6 list-disc ml-6">
        {equipmentItems.map(item => (
          <li key={item} className="flex justify-between items-center">
            {item}
            <button
              type="button"
              onClick={() => handleRemoveItem(item)}
              className="text-red-600 hover:underline text-sm"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="text-center">
        <button
          type="submit"
          disabled={equipmentItems.length === 0}
          className={`px-6 py-3 rounded text-white ${
            equipmentItems.length > 0
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Next: Spells
        </button>
      </form>
    </div>
  );
};

export default CharacterEquipmentPage;
