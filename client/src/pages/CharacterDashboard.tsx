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

    // Set text color to black (or any light color)
    pdf.setTextColor(0, 0, 0); // RGB for black color

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("character.pdf");
  };

  if (!Auth.loggedIn()) {
    return (
      <p style={unauthenticatedStyle}>
        You need to be logged in to view this page.
      </p>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>My Characters</h1>
        <Link to="/characterinfo" style={createCharacterButtonStyle}>
          + Create Character
        </Link>
      </div>

      <div style={characterListStyle}>
        {loading ? (
          <p style={loadingTextStyle}>Loading characters...</p>
        ) : characters.length > 0 ? (
          characters.map((char) => (
            <div key={char._id} id={`char-${char._id}`} style={characterCardStyle}>
              <h2 style={characterNameStyle}>{char.name}</h2>
              <p style={characterInfoStyle}><strong>Class:</strong> {char.class}</p>
              <p style={characterInfoStyle}><strong>Race:</strong> {char.race}{char.subrace ? ` (${char.subrace})` : ''}</p>
              <p style={characterInfoStyle}><strong>Level:</strong> {char.level}</p>
              <p style={characterInfoStyle}><strong>Proficiencies:</strong> {char.proficiencies?.join(', ') || 'None'}</p>
              <p style={characterInfoStyle}><strong>Equipment:</strong> {Array.isArray(char.equipment) && char.equipment.length > 0 ? char.equipment.join(', ') : 'None'}</p>
              <p style={characterInfoStyle}><strong>Spells:</strong> {Array.isArray(char.spells) && char.spells.length > 0 ? char.spells.join(', ') : 'None'}</p>

              {char.stats && (
                <div style={statsSectionStyle}>
                  <h3 style={statsTitleStyle}>Stats</h3>
                  <ul style={statsListStyle}>
                    <li style={statItemStyle}>Strength: {char.stats.strength}</li>
                    <li style={statItemStyle}>Dexterity: {char.stats.dexterity}</li>
                    <li style={statItemStyle}>Constitution: {char.stats.constitution}</li>
                    <li style={statItemStyle}>Intelligence: {char.stats.intelligence}</li>
                    <li style={statItemStyle}>Wisdom: {char.stats.wisdom}</li>
                    <li style={statItemStyle}>Charisma: {char.stats.charisma}</li>
                    <li style={statItemStyle}>Health: {char.stats.health}</li>
                  </ul>
                </div>
              )}

              <div style={buttonContainerStyle}>
                <button
                  onClick={() => handleDelete(char._id)}
                  style={deleteButtonStyle}
                >
                  Delete
                </button>

                <button
                  onClick={() => navigate('/character-edit', { state: { char, mode: 'edit' } })}
                  style={editButtonStyle}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDownloadPDF(char._id)}
                  style={downloadButtonStyle}
                >
                  Download PDF
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={noCharactersTextStyle}>You haven’t created any characters yet.</p>
        )}
      </div>
    </div>
  );
};

// Inline Styles
const containerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '2rem',
  backgroundColor: '#2d2a28', // Dark background color
  color: '#f5f1e1', // Light text color to contrast with dark theme
  borderRadius: '8px',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
};

const titleStyle: React.CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: '700',
  color: '#d4af37', // Gold color for title
};

const createCharacterButtonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  backgroundColor: '#c1440e', 
  color: '#fff',
  borderRadius: '0.375rem',
  textDecoration: 'none',
  fontSize: '1.125rem',
  fontWeight: 'bold',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'background-color 0.3s',
};

const characterListStyle: React.CSSProperties = {
  marginTop: '2rem',
};

const characterCardStyle: React.CSSProperties = {
  border: '1px solid #5c4a3d',
  padding: '1.5rem',
  borderRadius: '0.375rem',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
  marginBottom: '1.5rem',
  backgroundColor: '#3f3221', // Darker brown to match medieval theme
};

const characterNameStyle: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: '700',
  color: '#d4af37', // Gold color for character name
};

const characterInfoStyle: React.CSSProperties = {
  fontSize: '1.125rem',
  margin: '0.5rem 0',
};

const statsSectionStyle: React.CSSProperties = {
  marginTop: '1.5rem',
};

const statsTitleStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: '600',
  color: '#d4af37', // Gold color for stats title
};

const statsListStyle: React.CSSProperties = {
  marginLeft: '1rem',
  listStyleType: 'disc',
  color: '#f5f1e1',
};

const statItemStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: '#f5f1e1', 
};

const buttonContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  marginTop: '1.5rem',
};

const deleteButtonStyle: React.CSSProperties = {
  backgroundColor: '#EF4444',
  color: '#fff',
  padding: '0.5rem 1rem',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)',
};

const editButtonStyle: React.CSSProperties = {
  backgroundColor: '#F59E0B',
  color: '#fff',
  padding: '0.5rem 1rem',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)',
};

const downloadButtonStyle: React.CSSProperties = {
  backgroundColor: '#6366F1',
  color: '#fff',
  padding: '0.5rem 1rem',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)',
};

const unauthenticatedStyle: React.CSSProperties = {
  textAlign: 'center',
  marginTop: '2rem',
  fontSize: '1.25rem',
  color: '#d4af37', 
};

const loadingTextStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#f5f1e1', 
};

const noCharactersTextStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#f5f1e1',
  fontSize: '1.125rem',
};

export default CharacterDashboard;
