import { useState } from 'react';
import styles from './EditableTitle.module.css';

function EditableTitle({ initialTitle, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);

  const handleUpdate = () => {
    // Agar title badla nahi hai, to kuch mat karo
    if (title.trim() === initialTitle || !title.trim()) {
      setIsEditing(false);
      setTitle(initialTitle);
      return;
    }
    onUpdate(title); // Parent ka update function call karo
    setIsEditing(false);
  };

  // Enter ya Escape dabane par handle karne ke liye
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleUpdate();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTitle(initialTitle);
    }
  };

  // Agar editing mode mein hai, to input box dikhao
  if (isEditing) {
    return (
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleUpdate} // Bahar click karne par save
        onKeyDown={handleKeyDown}
        className={styles.editInput}
        autoFocus
        onClick={(e) => e.stopPropagation()} // Taaki list item par click na ho
      />
    );
  }

  // Normal mode mein, text dikhao
  return (
    <span onDoubleClick={() => setIsEditing(true)} className={styles.editableContainer}>
      {initialTitle}
    </span>
  );
}

export default EditableTitle;