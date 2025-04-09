import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { UPDATE_CHARACTER } from '../utils/mutations';
import { useState } from 'react';

const CharacterEditPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const character = location.state.char;

  const [formData, setFormData] = useState({
    name: character.name,
    class: character.class,
    race: character.race,
    subrace: character.subrace || '',
    level: character.level,
    stats: character.stats || {},
    proficiencies: character.proficiencies || [],
    equipment: character.equipment || [],
    spells: character.spells || [],
    notes: character.notes || ''
  });

  const [updateCharacter] = useMutation(UPDATE_CHARACTER);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCharacter({
        variables: {
          id: character._id,
          input: {
            ...formData,
            level: parseInt(formData.level),
            proficiencies: formData.proficiencies,
            equipment: formData.equipment,
            spells: formData.spells,
            stats: formData.stats,
          },
        },
      });
      navigate('/characters', { state: { refresh: true } });
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Edit Character</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Name" />
        <input name="class" value={formData.class} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Class" />
        <input name="race" value={formData.race} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Race" />
        <input name="subrace" value={formData.subrace} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Subrace" />
        <input name="level" value={formData.level} onChange={handleChange} type="number" className="w-full border p-2 rounded" placeholder="Level" />
        <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Notes" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save Changes</button>
      </form>
    </div>
  );
};
export default CharacterEditPage;
