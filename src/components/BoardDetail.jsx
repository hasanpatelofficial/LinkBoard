import Card from './Card';
import AddCardForm from './AddCardForm';

// Yeh component ek board ki detail dikhayega
function BoardDetail({ board, cards, onBackClick, onAddCard }) {
  return (
    <div>
      <button 
        onClick={onBackClick} 
        style={{ marginBottom: '20px', padding: '10px', fontSize: '1rem' }}
      >
        &larr; Back to Dashboard
      </button>

      <h1 style={{ color: 'white' }}>{board.title}</h1>

      {/* Naya card add karne ka form */}
      <AddCardForm onAddCard={onAddCard} />

      {/* Saare cards ki list */}
      <div>
        {cards.length > 0 ? (
          cards.map(card => <Card key={card.id} content={card.content} />)
        ) : (
          <p style={{ color: 'grey' }}>Abhi koi card nahi hai. Ek naya add karo!</p>
        )}
      </div>
    </div>
  );
}

export default BoardDetail;