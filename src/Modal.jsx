import { motion } from 'framer-motion';
import styles from './Modal.module.css';

function Modal({ children, onClose }) {
  return (
    <motion.div
      className={styles.backdrop}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()} // Taaki modal par click karne se woh band na ho
        initial={{ y: "-100vh", opacity: 0 }}
        animate={{ y: "0", opacity: 1 }}
        exit={{ y: "100vh", opacity: 0 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default Modal;