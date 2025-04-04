import { useQuery, useMutation } from '@apollo/client';
import { GET_CHARACTERS } from '../utils/queries';
import { DELETE_CHARACTER } from '../utils/mutations';
import { Link } from 'react-router-dom';
import { Character } from '../interfaces/Character';
import Auth from '../utils/auth';

const CharacterDashboard = () => {
  console.log("CharacterDashboard loaded");
  const { loading, data, refetch } = useQuery(GET_CHARACTERS);
  const [deleteCharacter] = useMutation(DELETE_CHARACTER);

  const characters: Character[] = data?.getCharacters || [];

  const handleDelete = async (id: string) => {
    try {
      await deleteCharacter({
        variables: { id },
      });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (!Auth.loggedIn()) {
    return <p className="text-center mt-10 text-lg">You need to be logged in to view this page.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header with title and always-visible Create button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">My Characters</h1>
        <Link
      to="/create-character"
      className="btn btn-primary"
    >
      + Create Character
    </Link>

      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p>Loading characters...</p>
        ) : characters.length > 0 ? (
          characters.map((char) => (
            <div key={char._id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{char.name}</h2>
              <p>Class: {char.class}</p>
              <p>Race: {char.race}</p>
              <p>Level: {char.level}</p>
              <button
                onClick={() => handleDelete(char._id)}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>You haven’t created any characters yet.</p>
        )}
      </div>
    </div>
  );
};

export default CharacterDashboard;
