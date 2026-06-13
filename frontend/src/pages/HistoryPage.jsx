import { useEffect, useMemo, useState } from 'react';
import { getTopics } from '../api/topics.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import TopicCard from '../components/TopicCard.jsx';

function HistoryPage() {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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
          setErrorMessage('No se pudo completar la acción. Inténtalo de nuevo en unos segundos.');
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

  const filteredTopics = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return topics;
    }

    return topics.filter((topic) => {
      const title = topic.title?.toLowerCase() || '';
      const originalText = topic.originalText?.toLowerCase() || '';
      return title.includes(normalizedSearch) || originalText.includes(normalizedSearch);
    });
  }, [searchTerm, topics]);

  return (
    <section className="page-section">
      <div className="section-heading">
        <p className="eyebrow">Apuntes guardados</p>
        <h1>Mis apuntes</h1>
      </div>

      {isLoading && <LoadingSpinner label="Cargando apuntes" />}
      {errorMessage && <p className="status-message error">{errorMessage}</p>}

      {!isLoading && !errorMessage && topics.length === 0 && (
        <div className="empty-state">
          <h2>No hay apuntes guardados todavía.</h2>
          <p>Crea el primero desde la pantalla principal.</p>
        </div>
      )}

      {!isLoading && !errorMessage && topics.length > 0 && (
        <>
          <div className="notes-search">
            <label htmlFor="notes-search">Buscar en mis apuntes</label>
            <input
              id="notes-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Busca por título o texto original"
            />
          </div>

          {filteredTopics.length === 0 ? (
            <div className="empty-state">
              <h2>No encontramos apuntes con esa búsqueda.</h2>
              <p>Prueba con otra palabra del título o del texto original.</p>
            </div>
          ) : (
            <div className="topic-grid">
              {filteredTopics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default HistoryPage;
