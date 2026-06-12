import { useEffect, useState } from 'react';
import { getTopics } from '../api/topics.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import TopicCard from '../components/TopicCard.jsx';

function HistoryPage() {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadTopics() {
      try {
        setIsLoading(true);
        const data = await getTopics();
        if (isMounted) {
          setTopics(data);
          setErrorMessage('');
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage('No se pudo cargar el historial. Revisa que el backend esté en marcha.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTopics();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="page-section">
      <div className="section-heading">
        <p className="eyebrow">Temas guardados</p>
        <h1>Historial</h1>
      </div>

      {isLoading && <LoadingSpinner label="Cargando temas" />}
      {errorMessage && <p className="status-message error">{errorMessage}</p>}

      {!isLoading && !errorMessage && topics.length === 0 && (
        <div className="empty-state">
          <h2>No hay temas guardados todavía.</h2>
          <p>Crea el primero desde la pantalla principal.</p>
        </div>
      )}

      {!isLoading && !errorMessage && topics.length > 0 && (
        <div className="topic-grid">
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </section>
  );
}

export default HistoryPage;
