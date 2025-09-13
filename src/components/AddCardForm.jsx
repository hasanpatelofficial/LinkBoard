import { useState } from 'react';

function AddCardForm({ onAddCard }) {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAddCard(content);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '20px 0' }}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Naya link ya note add karo..."
        style={{ width: '300px', padding: '10px', fontSize: '1rem', marginRight: '10px' }}
      />
      <button type="submit" style={{ padding: '10px', fontSize: '1rem' }}>
        Add Card
      </button>
    </form>
  );
}

export default AddCardForm;