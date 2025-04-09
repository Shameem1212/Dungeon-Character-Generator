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
    stats: {
      strength: character.stats.strength || 0,
      dexterity: character.stats.dexterity || 0,
      constitution: character.stats.constitution || 0,
      intelligence: character.stats.intelligence || 0,
      wisdom: character.stats.wisdom || 0,
      charisma: character.stats.charisma || 0,
      health: character.stats.health || 0,
    },
    proficiencies: character.proficiencies || [],
    equipment: character.equipment || [],
    spells: character.spells || [],
    notes: character.notes || '',
  });

  const [updateCharacter] = useMutation(UPDATE_CHARACTER);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name in formData.stats) {
      setFormData({
        ...formData,
        stats: {
          ...formData.stats,
          [name]: parseInt(value)
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
          },
        },
      });
      navigate('/characters', { state: { refresh: true } });
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Edit Character</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        
        <label style={labelStyle}>Character Name:</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={inputStyle}
          placeholder="Name"
        />
        
        <label style={labelStyle}>Class:</label>
        <input
          name="class"
          value={formData.class}
          onChange={handleChange}
          style={inputStyle}
          placeholder="Class"
        />
        
        <label style={labelStyle}>Race:</label>
        <input
          name="race"
          value={formData.race}
          onChange={handleChange}
          style={inputStyle}
          placeholder="Race"
        />
        
        <label style={labelStyle}>Subrace:</label>
        <input
          name="subrace"
          value={formData.subrace}
          onChange={handleChange}
          style={inputStyle}
          placeholder="Subrace"
        />
        
        <label style={labelStyle}>Level:</label>
        <input
          name="level"
          value={formData.level}
          onChange={handleChange}
          type="number"
          style={inputStyle}
          placeholder="Level"
        />

        <div style={statsGridStyle}>
          {Object.entries(formData.stats).map(([key, value]) => (
            <div key={key}>
              <label style={labelStyle}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
              <input
                name={key}
                value={value}
                type="number"
                onChange={handleChange}
                style={inputStyle}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              />
            </div>
          ))}
        </div>

        <label style={labelStyle}>Notes:</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          style={textareaStyle}
          placeholder="Notes"
        />
        
        <button type="submit" style={submitButtonStyle}>Save Changes</button>
      </form>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '1rem',
  backgroundColor: '#2c2f38',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
};

const headerStyle: React.CSSProperties = {
  fontSize: '1.75rem',
  fontWeight: '600',
  marginBottom: '1.25rem',
  textAlign: 'center',
  color: '#e1c16e',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

const inputStyle: React.CSSProperties = {
  padding: '0.5rem',
  fontSize: '0.95rem',
  borderRadius: '5px',
  border: '1px solid #555',
  outline: 'none',
  transition: 'border 0.3s ease',
  color: '#fff',
  backgroundColor: '#3d454d',
};

const statsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '0.75rem',
};

const textareaStyle: React.CSSProperties = {
  padding: '0.5rem',
  fontSize: '0.95rem',
  borderRadius: '5px',
  border: '1px solid #555',
  outline: 'none',
  transition: 'border 0.3s ease',
  color: '#fff',
  backgroundColor: '#3d454d',
  height: '120px',
};

const submitButtonStyle: React.CSSProperties = {
  padding: '0.5rem 1.25rem',
  fontSize: '1.1rem',
  backgroundColor: '#c1440e',
  color: '#fff',
  borderRadius: '5px',
  cursor: 'pointer',
  border: 'none',
  transition: 'background-color 0.3s ease',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.95rem',
  fontWeight: '500',
  color: '#e1c16e',
  marginBottom: '0.4rem',
};

export default CharacterEditPage;
