import { Link } from 'react-router-dom';
import { formatDate } from '../utils/date.js';

function TopicCard({ topic }) {
  return (
    <Link className="topic-card" to={`/topics/${topic.id}`}>
      <div>
        <h2>{topic.title}</h2>
        <p>{formatDate(topic.createdAt)}</p>
      </div>
      <span aria-hidden="true">Ver detalle</span>
    </Link>
  );
}

export default TopicCard;
