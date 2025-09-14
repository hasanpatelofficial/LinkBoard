import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { AnimatePresence } from 'framer-motion';
import styles from './App.module.css';
import Modal from './Modal';
import Card from './Card';
import { FaTrash, FaPlus } from 'react-icons/fa';
import EditableTitle from './EditableTitle';

function App() {
  const [boards, setBoards] = useState([]);
  const [cards, setCards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newCardContent, setNewCardContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const boardsCollection = collection(db, 'boards');
      const boardSnapshot = await getDocs(boardsCollection);
      const boardList = boardSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBoards(boardList);

      const cardsCollection = collection(db, 'cards');
      const cardSnapshot = await getDocs(cardsCollection);
      const cardList = cardSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCards(cardList);

      if (boardList.length > 0) {
        setSelectedBoardId(boardList[0].id);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleAddBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;
    const docRef = await addDoc(collection(db, 'boards'), { title: newBoardTitle });
    const newBoard = { id: docRef.id, title: newBoardTitle };
    setBoards([...boards, newBoard]);
    setSelectedBoardId(newBoard.id);
    setNewBoardTitle('');
    setIsModalOpen(false);
  };

  const handleAddCard = async (type) => {
    if (!newCardContent.trim()) return;
    const newCardData = { 
      boardId: selectedBoardId, 
      content: newCardContent, 
      completed: false,
      type: type
    };
    const docRef = await addDoc(collection(db, 'cards'), newCardData);
    setCards([...cards, { id: docRef.id, ...newCardData }]);
    setNewCardContent('');
  };

  const handleDeleteBoard = async (boardIdToDelete) => {
    if (window.confirm('Are you sure you want to delete this board and all its cards?')) {
      // Delete the board
      await deleteDoc(doc(db, 'boards', boardIdToDelete));

      // Find and delete all associated cards in a batch
      const q = query(collection(db, "cards"), where("boardId", "==", boardIdToDelete));
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
          batch.delete(doc.ref);
      });
      await batch.commit();

      // Update local state
      const updatedBoards = boards.filter(b => b.id !== boardIdToDelete);
      setBoards(updatedBoards);
      setCards(cards.filter(c => c.boardId !== boardIdToDelete));

      if (selectedBoardId === boardIdToDelete) {
        setSelectedBoardId(updatedBoards.length > 0 ? updatedBoards[0].id : null);
      }
    }
  };

  const handleDeleteCard = async (cardIdToDelete) => {
    await deleteDoc(doc(db, 'cards', cardIdToDelete));
    setCards(cards.filter(c => c.id !== cardIdToDelete));
  };

  const handleUpdateCard = async (cardIdToUpdate, newContent) => {
    const cardRef = doc(db, 'cards', cardIdToUpdate);
    await updateDoc(cardRef, { content: newContent });
    setCards(cards.map(card => card.id === cardIdToUpdate ? { ...card, content: newContent } : card));
  };

  const handleUpdateBoard = async (boardIdToUpdate, newTitle) => {
    const boardRef = doc(db, 'boards', boardIdToUpdate);
    await updateDoc(boardRef, { title: newTitle });
    setBoards(boards.map(board => board.id === boardIdToUpdate ? { ...board, title: newTitle } : board));
  };
  
  const handleToggleComplete = async (cardId, newStatus) => {
    const cardRef = doc(db, 'cards', cardId);
    await updateDoc(cardRef, { completed: newStatus });
    setCards(cards.map(card => card.id === cardId ? { ...card, completed: newStatus } : card));
  };

  const selectedBoard = boards.find(b => b.id === selectedBoardId);
  const filteredCards = cards.filter(c => c.boardId === selectedBoardId);

  if (isLoading) {
    return <h1 style={{color: 'white', textAlign: 'center', marginTop: '40px'}}>Loading LinkBoard...</h1>;
  }
  
  return (
    <>
      <AnimatePresence>
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <form onSubmit={handleAddBoard}>
              <h2 style={{marginTop: 0}}>Create New Board</h2>
              <input type="text" className={styles.cardInput} value={newBoardTitle} onChange={(e) => setNewBoardTitle(e.target.value)} placeholder="Board name..." autoFocus/>
              <button type="submit" className={styles.addBoardButton} style={{marginTop: '20px'}}>Create Board</button>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      <div className={styles.appContainer}>
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarHeader}>My LinkBoard</h2>
          <button className={styles.addBoardButton} onClick={() => setIsModalOpen(true)}>+ Add New Board</button>
          <ul className={styles.boardList}>
            {boards.map(board => (
              <li key={board.id} className={`${styles.boardItem} ${selectedBoardId === board.id ? styles.active : ''}`} onClick={() => setSelectedBoardId(board.id)}>
                <EditableTitle
                  initialTitle={board.title}
                  onUpdate={(newTitle) => handleUpdateBoard(board.id, newTitle)}
                />
                <FaTrash className={styles.deleteIcon} onClick={(e) => { e.stopPropagation(); handleDeleteBoard(board.id); }} />
              </li>
            ))}
          </ul>
        </aside>

        <main className={styles.mainArea}>
           {selectedBoard ? (
            <>
              <h1 className={styles.mainTitle}>
                <EditableTitle
                  initialTitle={selectedBoard.title}
                  onUpdate={(newTitle) => handleUpdateBoard(selectedBoard.id, newTitle)}
                />
              </h1>
              <div className={styles.cardForm}>
                <input type="text" className={styles.cardInput} value={newCardContent} onChange={(e) => setNewCardContent(e.target.value)} placeholder="Type here..."/>
                <button type="button" className={`${styles.cardSubmitButton} ${styles.noteButton}`} onClick={() => handleAddCard('note')}>Add Note/Link</button>
                <button type="button" className={`${styles.cardSubmitButton} ${styles.taskButton}`} onClick={() => handleAddCard('task')}>Add Task</button>
              </div>

              <div>
                <AnimatePresence>
                  {filteredCards.map(card => 
                    <Card 
                      key={card.id} 
                      card={card} 
                      onDeleteCard={handleDeleteCard} 
                      onUpdateCard={handleUpdateCard} 
                      onToggleComplete={handleToggleComplete}
                    />
                  )}
                </AnimatePresence>
              </div>
            </>
           ) : (
            <h1>Welcome! Create a board to get started.</h1>
           )}
        </main>
      </div>
    </>
  );
}

export default App;