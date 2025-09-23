import './Alert.css';

export default function Alert({ type = 'error', message, onClose }) {
  if (!message) return null;

  return (
    <div className={`alert alert-${type}`}>
      <span>{message}</span>
      <button onClick={onClose} className="alert-close">&times;</button>
    </div>
  );
}
