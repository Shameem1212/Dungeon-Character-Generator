import { FormEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_CHARACTER } from '../utils/mutations';

const CharacterStatsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const charInfo = location.state || {};

  const [stats, setStats] = useState({
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    health: 10,
  });

  //const [createCharacter] = useMutation(CREATE_CHARACTER);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStats({
      ...stats,
      [name]: parseInt(value),
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    navigate('/character-proficiencies', {
      state: {
        ...charInfo,
        stats,
      },
    });
  };
  

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-center">Assign Character Stats</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.entries(stats).map(([stat, value]) => (
          <div key={stat}>
            <label className="block text-lg font-semibold mb-1 capitalize">
              {stat === 'health' ? 'Health (HP)' : stat}
            </label>
            <input
              type="number"
              name={stat}
              value={value}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min={1}
              max={stat === 'health' ? 999 : 20}
              required
            />
          </div>
        ))}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Next: Proficiencies
          </button>
        </div>
      </form>
    </div>
  );
};

export default CharacterStatsPage;
