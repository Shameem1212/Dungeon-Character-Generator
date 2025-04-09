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
    <div style={containerStyle}>
      <h1 style={headerStyle}>Edit Character</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input name="name" value={formData.name} onChange={handleChange} style={inputStyle} placeholder="Name" />
        <input name="class" value={formData.class} onChange={handleChange} style={inputStyle} placeholder="Class" />
        <input name="race" value={formData.race} onChange={handleChange} style={inputStyle} placeholder="Race" />
        <input name="subrace" value={formData.subrace} onChange={handleChange} style={inputStyle} placeholder="Subrace" />
        <input name="level" value={formData.level} onChange={handleChange} type="number" style={inputStyle} placeholder="Level" />
        <textarea name="notes" value={formData.notes} onChange={handleChange} style={textareaStyle} placeholder="Notes" />
        <button type="submit" style={submitButtonStyle}>Save Changes</button>
      </form>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '2rem',
  backgroundColor: '#2c2f38',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
};

const headerStyle: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: '600',
  marginBottom: '1.5rem',
  textAlign: 'center',
  color: '#e1c16e',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const inputStyle: React.CSSProperties = {
  padding: '0.75rem',
  fontSize: '1rem',
  borderRadius: '5px',
  border: '1px solid #555',
  outline: 'none',
  transition: 'border 0.3s ease',
  color: '#fff',
  backgroundColor: '#3d454d',
};

const textareaStyle: React.CSSProperties = {
  padding: '0.75rem',
  fontSize: '1rem',
  borderRadius: '5px',
  border: '1px solid #555',
  outline: 'none',
  transition: 'border 0.3s ease',
  color: '#fff',
  backgroundColor: '#3d454d',
  height: '150px',
};

const submitButtonStyle: React.CSSProperties = {
  padding: '0.75rem 1.5rem',
  fontSize: '1.125rem',
  backgroundColor: '#c1440e',
  color: '#fff',
  borderRadius: '5px',
  cursor: 'pointer',
  border: 'none',
  transition: 'background-color 0.3s ease',
};

export default CharacterEditPage;
