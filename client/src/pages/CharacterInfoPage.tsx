import { FormEvent, useEffect, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_RACES, GET_CLASSES, GET_SUBRACES } from '../utils/queries';

const CharacterInfoPage = () => {
  const [formState, setFormState] = useState({
    name: '',
    class: '',
    race: '',
    subrace: '',
    level: 1,
  });

  const navigate = useNavigate();

  const { loading: loadingRaces, data: raceData } = useQuery(GET_RACES);
  const { loading: loadingClasses, data: classData } = useQuery(GET_CLASSES);
  const [getSubraces, { data: subraceData, loading: loadingSubraces }] = useLazyQuery(GET_SUBRACES);

  useEffect(() => {
    const selectedRace = raceData?.getRaces?.find((r: { name: string }) => r.name === formState.race);
    if (selectedRace?.index) {
      getSubraces({ variables: { raceIndex: selectedRace.index } });
    }
  }, [formState.race, raceData, getSubraces]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  
    // Log what we're passing to the next page
    console.log("Character Info Being Submitted:", formState);
  
    // Pass the complete form state to the next page
    navigate('/character-stats', {
      state: {
        name: formState.name,
        class: formState.class,
        race: formState.race,
        subrace: formState.subrace,
        level: parseInt(formState.level.toString()), // make sure it's a number
      },
    });
  };
  

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-center">Create a New Character</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-semibold mb-1">Character Name</label>
          <input
            className="w-full p-3 border rounded"
            type="text"
            name="name"
            placeholder="Enter a name"
            value={formState.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-lg font-semibold mb-1">Class</label>
          <select
            name="class"
            value={formState.class}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          >
            <option value="">-- Choose a class --</option>
            {loadingClasses ? (
              <option disabled>Loading classes...</option>
            ) : (
              classData?.getClasses?.map((c: { name: string; index: string }) => (
                <option key={c.index} value={c.name}>{c.name}</option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="block text-lg font-semibold mb-1">Race</label>
          <select
            name="race"
            value={formState.race}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          >
            <option value="">-- Choose a race --</option>
            {loadingRaces ? (
              <option disabled>Loading races...</option>
            ) : (
              raceData?.getRaces?.map((r: { name: string; index: string }) => (
                <option key={r.index} value={r.name}>{r.name}</option>
              ))
            )}
          </select>
        </div>

        {subraceData?.getSubraces?.length > 0 && (
          <div>
            <label className="block text-lg font-semibold mb-1">Subrace</label>
            <select
              name="subrace"
              value={formState.subrace}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              required
            >
              <option value="">-- Choose a subrace --</option>
              {loadingSubraces ? (
                <option disabled>Loading subraces...</option>
              ) : (
                subraceData.getSubraces.map((s: { name: string; index: string }) => (
                  <option key={s.index} value={s.name}>{s.name}</option>
                ))
              )}
            </select>
          </div>
        )}

        <div>
          <label className="block text-lg font-semibold mb-1">Level</label>
          <input
            className="w-full p-3 border rounded"
            type="number"
            name="level"
            value={formState.level}
            onChange={handleChange}
            min={1}
            max={20}
            required
          />
        </div>

        <div className="text-center">
          <button
            className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700"
            type="submit"
          >
            Next: Stats
          </button>
        </div>
      </form>
    </div>
  );
};

export default CharacterInfoPage;
