import styles from './Login.module.css';
import { FaGoogle } from 'react-icons/fa';

// onLogin prop ek function hoga jo App.jsx se aayega
function Login({ onLogin }) {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1>Welcome to LinkBoard</h1>
        <p>Your personal space to organize everything.</p>
        <button className={styles.loginButton} onClick={onLogin}>
          <FaGoogle style={{ marginRight: '10px' }} />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;