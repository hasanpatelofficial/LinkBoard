import { useState } from 'react'; // React se useState import karo

// Form component
function AddBoardForm({ onAddBoard }) {
  // Input box ki value ko store karne ke liye state
  const [title, setTitle] = useState('');

  // Jab form submit hoga to yeh function chalega
  const handleSubmit = (event) => {
    event.preventDefault(); // Page ko refresh hone se roko
    if (!title.trim()) return; // Agar input khaali hai to kuch mat karo

    onAddBoard(title); // Parent component (App.jsx) ka function call karo
    setTitle(''); // Input box ko khaali kar do
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '40px' }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Naye board ka naam..."
        style={{ padding: '10px', fontSize: '1rem', marginRight: '10px' }}
      />
      <button type="submit" style={{ padding: '10px', fontSize: '1rem' }}>
        Add Board
      </button>
    </form>
  );
}

export default AddBoardForm;