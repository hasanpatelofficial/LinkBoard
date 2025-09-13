function Card({ content }) {
  return (
    <div style={{
      backgroundColor: '#282c34',
      padding: '15px',
      borderRadius: '8px',
      color: 'white',
      marginBottom: '10px'
    }}>
      <p>{content}</p>
    </div>
  );
}

export default Card;