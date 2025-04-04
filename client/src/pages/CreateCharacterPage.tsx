import { FormEvent, useState } from 'react';

const CreateCharacterPage = () => {
  const [formState, setFormState] = useState({
    name: '',
    class: '',
    race: '',
    level: 1,
  });

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
    // TODO: hook up mutation
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Create a New Character</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="text"
          name="name"
          placeholder="Character Name"
          value={formState.name}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 border rounded"
          type="text"
          name="class"
          placeholder="Class"
          value={formState.class}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 border rounded"
          type="text"
          name="race"
          placeholder="Race"
          value={formState.race}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 border rounded"
          type="number"
          name="level"
          placeholder="Level"
          value={formState.level}
          onChange={handleChange}
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" type="submit">
          Create Character
        </button>
      </form>
    </div>
  );
};

export default CreateCharacterPage;
