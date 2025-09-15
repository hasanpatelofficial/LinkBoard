import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where, writeBatch, orderBy } from 'firebase/firestore';
import { db, auth, provider } from './firebase';
import { signInWithPopup, signInWithRedirect, onAuthStateChanged, getRedirectResult, signOut } from "firebase/auth";
import { AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import styles from './App.module.css';
import Modal from './Modal';
import Card from './Card';
import { FaTrash, FaPlus, FaMoon, FaSun, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import EditableTitle from './EditableTitle';
import Login from './Login';

function App() {
  const [user, setUser] = useState(null);
  const [boards, setBoards] = useState([]);
  const [cards, setCards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newCardContent, setNewCardContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // All functions remain the same
  useEffect(() => { getRedirectResult(auth).catch((error) => console.error("Redirect Error:", error.code, error.message)); const unsubscribe = onAuthStateChanged(auth, (currentUser) => { setUser(currentUser); if (currentUser) { fetchData(currentUser.uid); } else { setBoards([]); setCards([]); setIsLoading(false); } }); return () => unsubscribe(); }, []);
  useEffect(() => { document.body.setAttribute('data-theme', theme); localStorage.setItem('theme', theme); }, [theme]);
  const toggleTheme = () => { setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark'); };
  const fetchData = async (userId) => { setIsLoading(true); const boardsQuery = query(collection(db, 'boards'), where("userId", "==", userId)); const boardSnapshot = await getDocs(boardsQuery); const boardList = boardSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); setBoards(boardList); const cardsQuery = query(collection(db, 'cards'), where("userId", "==", userId), orderBy('order')); const cardSnapshot = await getDocs(cardsQuery); const cardList = cardSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); setCards(cardList); if (boardList.length > 0) { if (!boardList.find(b => b.id === selectedBoardId)) { setSelectedBoardId(boardList[0].id); } } else { setSelectedBoardId(null); } setIsLoading(false); };
  const signInWithGoogle = () => { const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); if (isMobile) { signInWithRedirect(auth, provider).catch(error => console.error("Redirect Start Error:", error.code, error.message)); } else { signInWithPopup(auth, provider).catch((error) => console.error(error)); } };
  const handleLogout = () => { signOut(auth); };
  const handleAddBoard = async (e) => { e.preventDefault(); if (!newBoardTitle.trim() || !user) return; const docRef = await addDoc(collection(db, 'boards'), { title: newBoardTitle, userId: user.uid }); const newBoard = { id: docRef.id, title: newBoardTitle, userId: user.uid }; setBoards([...boards, newBoard]); setSelectedBoardId(newBoard.id); setNewBoardTitle(''); setIsModalOpen(false); setIsSidebarOpen(false); };
  const handleAddCard = async (type) => { if (!newCardContent.trim() || !user) return; const currentBoardCards = cards.filter(c => c.boardId === selectedBoardId); const newOrder = currentBoardCards.length; const newCardData = { boardId: selectedBoardId, content: newCardContent, completed: false, type: type, order: newOrder, userId: user.uid }; const docRef = await addDoc(collection(db, 'cards'), newCardData); setCards([...cards, { id: docRef.id, ...newCardData }]); setNewCardContent(''); };
  const handleDeleteBoard = async (boardIdToDelete) => { if (!user || !window.confirm('Are you sure you want to delete this board?')) return; await deleteDoc(doc(db, 'boards', boardIdToDelete)); const q = query(collection(db, "cards"), where("boardId", "==", boardIdToDelete)); const querySnapshot = await getDocs(q); const batch = writeBatch(db); querySnapshot.forEach((doc) => { batch.delete(doc.ref); }); await batch.commit(); const updatedBoards = boards.filter(b => b.id !== boardIdToDelete); setBoards(updatedBoards); setCards(cards.filter(c => c.boardId !== boardIdToDelete)); if (selectedBoardId === boardIdToDelete) { setSelectedBoardId(updatedBoards.length > 0 ? updatedBoards[0].id : null); } };
  const handleDeleteCard = async (cardIdToDelete) => { if (!user) return; await deleteDoc(doc(db, 'cards', cardIdToDelete)); setCards(cards.filter(c => c.id !== cardIdToDelete)); };
  const handleUpdateCard = async (cardIdToUpdate, newContent) => { if (!user) return; const cardRef = doc(db, 'cards', cardIdToUpdate); await updateDoc(cardRef, { content: newContent }); setCards(cards.map(card => card.id === cardIdToUpdate ? { ...card, content: newContent } : card)); };
  const handleUpdateBoard = async (boardIdToUpdate, newTitle) => { if (!user) return; const boardRef = doc(db, 'boards', boardIdToUpdate); await updateDoc(boardRef, { title: newTitle }); setBoards(boards.map(board => board.id === boardIdToUpdate ? { ...board, title: newTitle } : board)); };
  const handleToggleComplete = async (cardId, newStatus) => { if (!user) return; const cardRef = doc(db, 'cards', cardId); await updateDoc(cardRef, { completed: newStatus }); setCards(cards.map(card => card.id === cardId ? { ...card, completed: newStatus } : card)); };
  const onDragEnd = (result) => { const { destination, source } = result; if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return; const boardCards = cards.filter(c => c.boardId === selectedBoardId).sort((a, b) => a.order - b.order); const [reorderedItem] = boardCards.splice(source.index, 1); boardCards.splice(destination.index, 0, reorderedItem); const otherCards = cards.filter(c => c.boardId !== selectedBoardId); const batch = writeBatch(db); boardCards.forEach((card, index) => { const cardRef = doc(db, 'cards', card.id); batch.update(cardRef, { order: index }); }); batch.commit(); const updatedCardsInState = boardCards.map((card, index) => ({...card, order: index})); setCards([...otherCards, ...updatedCardsInState]); };

  const selectedBoard = boards.find(b => b.id === selectedBoardId);
  const filteredCards = cards.filter(c => c.boardId === selectedBoardId).sort((a, b) => a.order - b.order);
  const filteredBoards = boards.filter(board => board.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (isLoading) {
      return <div className={styles.loadingScreen}><h1>Loading...</h1></div>;
  }
  if (!user) {
      return <Login onLogin={signInWithGoogle} />;
  }

  return (
      <>
          <AnimatePresence>
              {isModalOpen && (
                  <Modal onClose={() => setIsModalOpen(false)}>
                      <form onSubmit={handleAddBoard}>
                          <h2 style={{ marginTop: 0 }}>Create New Board</h2>
                          <input type="text" className={styles.cardInput} value={newBoardTitle} onChange={(e) => setNewBoardTitle(e.target.value)} placeholder="Board name..." autoFocus />
                          <button type="submit" className={styles.addBoardButton} style={{ marginTop: '20px' }}>Create Board</button>
                      </form>
                  </Modal>
              )}
          </AnimatePresence>
          <div className={styles.appContainer}>
              <button className={styles.menuButton} onClick={() => setIsSidebarOpen(true)}>
                  <FaBars />
              </button>
              <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
                  <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h2 className={styles.sidebarHeader}>My LinkBoard</h2>
                          <button className={styles.closeButton} onClick={() => setIsSidebarOpen(false)}>
                              <FaTimes />
                          </button>
                      </div>
                      <div className={styles.searchContainer}>
                          <input
                              type="text"
                              placeholder="Search boards..."
                              className={styles.searchInput}
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                          />
                      </div>
                      <button className={styles.addBoardButton} onClick={() => setIsModalOpen(true)}>+ Add New Board</button>
                      <ul className={styles.boardList}>
                          {filteredBoards.map(board => (
                              <li
                                  key={board.id}
                                  className={`${styles.boardItem} ${selectedBoardId === board.id ? styles.active : ''}`}
                                  onClick={() => { setSearchTerm(''); setSelectedBoardId(board.id); setIsSidebarOpen(false); }}
                              >
                                  <EditableTitle initialTitle={board.title} onUpdate={(newTitle) => handleUpdateBoard(board.id, newTitle)} />
                                  <FaTrash className={styles.deleteIcon} onClick={(e) => { e.stopPropagation(); handleDeleteBoard(board.id); }} />
                              </li>
                          ))}
                      </ul>
                  </div>
                  <div className={styles.sidebarFooter}>
                      <button className={styles.themeToggle} onClick={toggleTheme}>
                          {theme === 'dark' ? <FaSun /> : <FaMoon />}
                          <span style={{ marginLeft: '8px' }}>{theme === 'dark' ? 'Light' : 'Dark'}</span>
                      </button>
                      <button className={`${styles.themeToggle} ${styles.logoutButton}`} onClick={handleLogout}>
                          <FaSignOutAlt />
                          <span style={{ marginLeft: '8px' }}>Logout</span>
                      </button>
                  </div>
              </aside>

              <main className={styles.mainArea}>
                  {selectedBoard ? (
                      <DragDropContext onDragEnd={onDragEnd}>
                          <div>
                              <h1 className={styles.mainTitle}>
                                  <EditableTitle initialTitle={selectedBoard.title} onUpdate={(newTitle) => handleUpdateBoard(selectedBoard.id, newTitle)} />
                              </h1>
                              <div className={styles.cardForm}>
                                  <input type="text" className={styles.cardInput} value={newCardContent} onChange={(e) => setNewCardContent(e.target.value)} placeholder="Type here..." />
                                  <button type="button" className={`${styles.cardSubmitButton} ${styles.noteButton}`} onClick={() => handleAddCard('note')}>Add Note/Link</button>
                                  <button type="button" className={`${styles.cardSubmitButton} ${styles.taskButton}`} onClick={() => handleAddCard('task')}>Add Task</button>
                              </div>
                              <Droppable droppableId={selectedBoard.id} direction="vertical">
                                  {(provided) => (
                                      <div ref={provided.innerRef} {...provided.droppableProps}>
                                          {filteredCards.map((card, index) => (
                                              <Draggable key={card.id} draggableId={card.id} index={index}>
                                                  {(provided) => (
                                                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                          <Card
                                                              card={card}
                                                              onDeleteCard={handleDeleteCard}
                                                              onUpdateCard={handleUpdateCard}
                                                              onToggleComplete={handleToggleComplete}
                                                          />
                                                      </div>
                                                  )}
                                              </Draggable>
                                          ))}
                                          {provided.placeholder}
                                      </div>
                                  )}
                              </Droppable>
                          </div>
                      </DragDropContext>
                  ) : (
                      <div className={styles.emptyState}>
                          <h1>Welcome, {user.displayName}!</h1>
                          <p>Create your first board to get started.</p>
                      </div>
                  )}
              </main>
          </div>
      </>
  );
}

export default App;