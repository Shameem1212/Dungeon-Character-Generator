import { FormEvent, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_RACES, GET_CLASSES } from '../utils/queries';

const CreateCharacterPage = () => {
  const [formState, setFormState] = useState({
    name: '',
    class: '',
    race: '',
    level: 1,
  });

  const { loading: loadingRaces, data: raceData } = useQuery(GET_RACES);
  const { loading: loadingClasses, data: classData } = useQuery(GET_CLASSES);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Creating character:', formState);
    // TODO: hook up ADD_CHARACTER mutation here

    //butts
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Create a New Character</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name input */}
        <input
          className="w-full p-2 border rounded"
          type="text"
          name="name"
          placeholder="Character Name"
          value={formState.name}
          onChange={handleChange}
          required
        />

        {/* Class dropdown */}
        <div>
          <label htmlFor="class" className="block font-semibold mb-1">Class</label>
          <select
            name="class"
            id="class"
            onChange={handleChange}
            value={formState.class}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">-- Choose a class --</option>
            {loadingClasses ? (
              <option disabled>Loading classes...</option>
            ) : (
              classData?.getClasses?.map((c: { name: string; index: string }) => (
                <option key={c.index} value={c.name}>
                  {c.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Race dropdown */}
        <div>
          <label htmlFor="race" className="block font-semibold mb-1">Race</label>
          <select
            name="race"
            id="race"
            onChange={handleChange}
            value={formState.race}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">-- Choose a race --</option>
            {loadingRaces ? (
              <option disabled>Loading races...</option>
            ) : (
              raceData?.getRaces?.map((race: { name: string; index: string }) => (
                <option key={race.index} value={race.name}>
                  {race.name}
                </option>
              ))
            )}
          </select>
        </div>
         
        {/* Level input */}
        <input
          className="w-full p-2 border rounded"
          type="number"
          name="level"
          placeholder="Level"
          value={formState.level}
          onChange={handleChange}
          min={1}
          max={20}
          required
        />

        {/* Submit button */}
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          type="submit"
        >
          Create Character
        </button>
      </form>
    </div>
  );
};

export default CreateCharacterPage;
