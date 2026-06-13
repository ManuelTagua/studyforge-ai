import { Link } from 'react-router-dom';
import { formatDate } from '../utils/date.js';

function getTextPreview(text) {
  const cleanText = (text || '').replace(/\s+/g, ' ').trim();

  if (cleanText.length <= 150) {
    return cleanText;
  }

  return `${cleanText.slice(0, 150).trim()}...`;
}

function TopicCard({ topic }) {
  return (
    <Link className="topic-card" to={`/topics/${topic.id}`}>
      <div>
        <h2>{topic.title}</h2>
        <p className="topic-card-date">{formatDate(topic.createdAt)}</p>
        <p className="topic-card-preview">{getTextPreview(topic.originalText)}</p>
      </div>
      <span aria-hidden="true">Abrir apunte</span>
    </Link>
  );
}

export default TopicCard;
