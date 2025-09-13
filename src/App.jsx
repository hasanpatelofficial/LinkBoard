import { useState } from 'react';
import Board from './components/Board';
import AddBoardForm from './components/AddBoardForm';
import BoardDetail from './components/BoardDetail';

// --- DATA ---
const initialBoards = [
  { id: 1, title: 'Web Series to Watch' },
  { id: 2, title: 'College Project' },
  { id: 3, title: 'Ghar ke Kaam' },
];

const initialCards = [
  { id: 101, boardId: 1, content: 'Panchayat Season 3' },
  { id: 102, boardId: 1, content: 'Mirzapur Season 3' },
  { id: 103, boardId: 2, content: 'Submit project report by Friday' },
];

function App() {
  // --- STATES ---
  const [boards, setBoards] = useState(initialBoards);
  const [cards, setCards] = useState(initialCards); // NAYI STATE CARDS KE LIYE
  const [selectedBoard, setSelectedBoard] = useState(null);

  // --- FUNCTIONS ---
  const handleAddBoard = (newTitle) => {
    const newBoard = { id: Date.now(), title: newTitle };
    setBoards([...boards, newBoard]);
  };
  
  // NAYA FUNCTION: Card add karne ke liye
  const handleAddCard = (newContent) => {
    if (!selectedBoard) return; // Agar koi board select nahi hai to kuch mat karo
    const newCard = {
      id: Date.now(),
      boardId: selectedBoard.id, // Card ko selected board se jodo
      content: newContent,
    };
    setCards([...cards, newCard]);
  };

  const handleBoardClick = (board) => {
    setSelectedBoard(board);
  };

  const handleBackClick = () => {
    setSelectedBoard(null);
  };
  
  // --- RENDER ---
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
      
      {selectedBoard ? (
        <BoardDetail
          board={selectedBoard}
          // Sirf wahi cards bhejo jo is board ke hain
          cards={cards.filter(card => card.boardId === selectedBoard.id)}
          onBackClick={handleBackClick}
          onAddCard={handleAddCard} // Add card wala function pass karo
        />
      ) : (
        <>
          <header style={{ marginBottom: '40px' }}>
            <h1 style={{ color: 'white', fontSize: '2.5rem' }}>My LinkBoard</h1>
          </header>
          
          <AddBoardForm onAddBoard={handleAddBoard} />
          
          <main style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {boards.map(board => (
              <Board
                key={board.id}
                title={board.title}
                onBoardClick={() => handleBoardClick(board)}
              />
            ))}
          </main>
        </>
      )}
      
    </div>
  );
}

export default App;