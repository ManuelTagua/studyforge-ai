import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTopicById } from '../api/topics.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { formatDate } from '../utils/date.js';

function TopicDetailPage() {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadTopic() {
      try {
        setIsLoading(true);
        const data = await getTopicById(id);
        if (isMounted) {
          setTopic(data);
          setErrorMessage('');
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage('No se pudo cargar el tema solicitado.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTopic();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <section className="page-section">
      <Link className="back-link" to="/history">
        Volver al historial
      </Link>

      {isLoading && <LoadingSpinner label="Cargando tema" />}
      {errorMessage && <p className="status-message error">{errorMessage}</p>}

      {!isLoading && topic && (
        <article className="topic-detail">
          <div className="detail-header">
            <p className="eyebrow">Tema de estudio</p>
            <h1>{topic.title}</h1>
            <p>{formatDate(topic.createdAt)}</p>
          </div>

          <div className="notes-panel">
            <h2>Texto original</h2>
            <p>{topic.originalText}</p>
          </div>
        </article>
      )}
    </section>
  );
}

export default TopicDetailPage;
