import { useQuery, useMutation } from '@apollo/client';
import { GET_CHARACTERS } from '../utils/queries';
import { DELETE_CHARACTER } from '../utils/mutations';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Character } from '../interfaces/Character';
import { useEffect } from 'react';
import Auth from '../utils/auth';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const CharacterDashboard = () => {
  console.log("CharacterDashboard loaded");

  const location = useLocation();
  const navigate = useNavigate();
  const { loading, data, refetch } = useQuery(GET_CHARACTERS);
  const [deleteCharacter] = useMutation(DELETE_CHARACTER);

  const characters: Character[] = data?.getCharacters || [];

  useEffect(() => {
    if (location.state?.refresh) {
      refetch();
      navigate(location.pathname, { replace: true });
    }
  }, [location, refetch, navigate]);

  const handleDelete = async (id: string) => {
    try {
      await deleteCharacter({ variables: { id } });
      refetch();
    } catch (err) {
      console.error("Failed to delete character:", err);
    }
  };

  const handleDownloadPDF = async (charId: string) => {
    const element = document.getElementById(`char-${charId}`);
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("character.pdf");
  };

  if (!Auth.loggedIn()) {
    return (
      <p className="text-center mt-10 text-lg">
        You need to be logged in to view this page.
      </p>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">My Characters</h1>
        <Link to="/characterinfo" className="btn btn-primary">
          + Create Character
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p>Loading characters...</p>
        ) : characters.length > 0 ? (
          characters.map((char) => (
            <div key={char._id} id={`char-${char._id}`} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-1">{char.name}</h2>
              <p><strong>Class:</strong> {char.class}</p>
              <p><strong>Race:</strong> {char.race}{char.subrace ? ` (${char.subrace})` : ''}</p>
              <p><strong>Level:</strong> {char.level}</p>
              <p><strong>Proficiencies:</strong> {char.proficiencies?.join(', ') || 'None'}</p>
              <p><strong>Equipment:</strong> {Array.isArray(char.equipment) && char.equipment.length > 0 ? char.equipment.join(', ') : 'None'}</p>
              <p><strong>Spells:</strong> {Array.isArray(char.spells) && char.spells.length > 0 ? char.spells.join(', ') : 'None'}</p>

              {char.stats && (
                <div className="mt-2">
                  <h3 className="font-semibold">Stats</h3>
                  <ul className="list-disc ml-5">
                    <li>Strength: {char.stats.strength}</li>
                    <li>Dexterity: {char.stats.dexterity}</li>
                    <li>Constitution: {char.stats.constitution}</li>
                    <li>Intelligence: {char.stats.intelligence}</li>
                    <li>Wisdom: {char.stats.wisdom}</li>
                    <li>Charisma: {char.stats.charisma}</li>
                    <li>Health: {char.stats.health}</li>
                  </ul>
                </div>
              )}

              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => handleDelete(char._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>

                <button
                  onClick={() => navigate('/character-edit', { state: { char, mode: 'edit' } })}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDownloadPDF(char._id)}
                  className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                >
                  Download PDF
                </button>
              </div>
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
