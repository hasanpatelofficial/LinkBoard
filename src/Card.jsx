import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Card.module.css';
import { FaTrash } from 'react-icons/fa';

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;  
  }
}

function LinkPreview({ url }) {
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPreview = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/get-preview?url=${encodeURIComponent(url)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.title) {
            setPreview(data);
          } else {
            setPreview({ title: url, description: 'No preview available.' });
          }
        }
      } catch (error) {
        console.error('Failed to fetch preview', error);
        setPreview(null);
      }
      setIsLoading(false);
    };

    fetchPreview();
  }, [url]);

  if (isLoading) {
    return <p className={styles.loadingText}>Loading preview...</p>;
  }

  if (!preview) {
     return <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>;
  }
  
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={styles.linkPreview}>
      {preview.image && <img src={preview.image} alt={preview.title} className={styles.linkImage} />}
      <div className={styles.linkInfo}>
        <h4>{preview.title}</h4>
        <p>{preview.description}</p>
      </div>
    </a>
  );
}

function Card({ card, onDeleteCard, onUpdateCard, onToggleComplete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentContent, setCurrentContent] = useState(card.content);
  
  const isUrl = isValidUrl(card.content);

  const handleUpdate = () => { if (currentContent.trim() === card.content || !currentContent.trim()) { setIsEditing(false); setCurrentContent(card.content); return; } onUpdateCard(card.id, currentContent); setIsEditing(false); };
  const handleKeyDown = (e) => { if (e.key === 'Enter') { handleUpdate(); } };
  const cardClassName = `${styles.card} ${card.completed ? styles.completed : ''}`;

  return (
    <motion.div 
      className={cardClassName}
      layout initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }} whileHover={{ scale: 1.02 }}
    >
      {card.type === 'task' && ( <input type="checkbox" checked={card.completed || false} onChange={() => onToggleComplete(card.id, !card.completed)} className={styles.checkbox} /> )}
      
      <div onDoubleClick={() => !isUrl && setIsEditing(true)} style={{width: '100%'}}>
        {isEditing ? ( 
          <input 
            type="text" value={currentContent} onChange={(e) => setCurrentContent(e.target.value)} 
            onBlur={handleUpdate} onKeyDown={handleKeyDown} 
            className={styles.editInput} autoFocus 
          />
        ) : (
          isUrl ? <LinkPreview url={card.content} /> : <p>{card.content}</p>
        )}
      </div>
      
      <FaTrash 
        className={styles.deleteIcon} 
        onClick={() => onDeleteCard(card.id)} 
      />
    </motion.div>
  );
}

export default Card;