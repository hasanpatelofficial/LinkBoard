// 'onBoardClick' function parent se aayega
function Board({ title, onBoardClick }) {
  return (
    // Is div par click karne se onBoardClick function chalega
    <div 
      onClick={onBoardClick}
      style={{
        backgroundColor: '#282c34',
        padding: '20px',
        borderRadius: '8px',
        width: '250px',
        height: '150px',
        color: 'white',
        cursor: 'pointer' // Taaki mouse le jaane par pointer dikhe
      }}
    >
      <h2>{title}</h2>
    </div>
  );
}

export default Board;