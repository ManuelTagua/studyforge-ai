import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getTopicById } from '../api/topics.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { formatDate } from '../utils/date.js';

const generationOptions = [
  {
    id: 'summary',
    title: 'Resumen',
    description: 'Condensa las ideas principales del tema.',
    icon: 'summary'
  },
  {
    id: 'quiz',
    title: 'Quiz',
    description: 'Prepara preguntas para comprobar lo aprendido.',
    icon: 'quiz'
  },
  {
    id: 'flashcards',
    title: 'Flashcards',
    description: 'Convierte conceptos clave en tarjetas de repaso.',
    icon: 'cards'
  },
  {
    id: 'explanation',
    title: 'Explicación fácil',
    description: 'Reformula el contenido con palabras sencillas.',
    icon: 'explain'
  }
];

const resultTabs = [
  { id: 'summary', label: 'Resumen' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'flashcards', label: 'Flashcards' },
  { id: 'explanation', label: 'Explicación' }
];

function AiIcon({ type }) {
  const commonProps = {
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': 'true'
  };

  if (type === 'quiz') {
    return (
      <svg {...commonProps}>
        <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path
          d="M9.5 9.4A2.6 2.6 0 1 1 12 12v1.1"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.5 5.8A3.3 3.3 0 0 1 7.8 2.5h8.4a3.3 3.3 0 0 1 3.3 3.3v12.4a3.3 3.3 0 0 1-3.3 3.3H7.8a3.3 3.3 0 0 1-3.3-3.3V5.8Z"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (type === 'cards') {
    return (
      <svg {...commonProps}>
        <path d="M7 7.5h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M5 4h12.5A2.5 2.5 0 0 1 20 6.5V17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M4 6.8h12.2a2.8 2.8 0 0 1 2.8 2.8v7.6a2.8 2.8 0 0 1-2.8 2.8H6.8A2.8 2.8 0 0 1 4 17.2V6.8Z"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (type === 'explain') {
    return (
      <svg {...commonProps}>
        <path
          d="M12 3.2a6.2 6.2 0 0 0-3.4 11.4V18h6.8v-3.4A6.2 6.2 0 0 0 12 3.2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M9.4 21h5.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M10 11.8h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path
        d="M5 4.8A2.8 2.8 0 0 1 7.8 2h8.4A2.8 2.8 0 0 1 19 4.8v14.4a2.8 2.8 0 0 1-2.8 2.8H7.8A2.8 2.8 0 0 1 5 19.2V4.8Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M8.5 8h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8.5 12h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8.5 16h4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TopicDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [topic, setTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [activeTab, setActiveTab] = useState('summary');

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
          setErrorMessage('No hemos podido abrir este tema ahora mismo. Vuelve a intentarlo en unos instantes.');
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

  const topicStats = useMemo(() => {
    if (!topic?.originalText) {
      return { words: 0, characters: 0, paragraphs: 0 };
    }

    const trimmedText = topic.originalText.trim();
    return {
      words: trimmedText.split(/\s+/).filter(Boolean).length,
      characters: trimmedText.length,
      paragraphs: trimmedText.split(/\n+/).filter((paragraph) => paragraph.trim()).length
    };
  }, [topic]);

  function handleGenerationClick(optionTitle) {
    setNoticeMessage(`${optionTitle}: Próximamente disponible`);
  }

  return (
    <section className="page-section">
      <Link className="back-link" to="/history">
        Volver al historial
      </Link>

      {isLoading && <LoadingSpinner label="Cargando tema" />}
      {location.state?.successMessage && (
        <p className="status-message success">{location.state.successMessage}</p>
      )}
      {errorMessage && <p className="status-message error">{errorMessage}</p>}

      {!isLoading && topic && (
        <article className="topic-detail">
          <div className="detail-hero">
            <div className="detail-header">
              <p className="eyebrow">Tema de estudio</p>
              <h1>{topic.title}</h1>
              <p>Creado el {formatDate(topic.createdAt)}</p>
            </div>

            <div className="detail-stats" aria-label="Resumen del tema">
              <div>
                <strong>{topicStats.words}</strong>
                <span>palabras</span>
              </div>
              <div>
                <strong>{topicStats.paragraphs}</strong>
                <span>bloques</span>
              </div>
              <div>
                <strong>{topicStats.characters}</strong>
                <span>caracteres</span>
              </div>
            </div>
          </div>

          <div className="detail-content-grid">
            <section className="notes-panel">
              <div className="panel-heading">
                <p className="eyebrow">Fuente</p>
                <h2>Texto original</h2>
              </div>
              <p>{topic.originalText}</p>
            </section>

            <aside className="topic-side-panel" aria-label="Estado de IA">
              <p className="eyebrow">Preparado para IA</p>
              <h2>Contenido pendiente de generar</h2>
              <p>
                Esta vista ya está lista para recibir resúmenes, quizzes, flashcards y
                explicaciones cuando activemos la integración con IA.
              </p>
            </aside>
          </div>

          <section className="ai-generation-section">
            <div className="section-title-row">
              <div>
                <p className="eyebrow">Futura generación</p>
                <h2>Generar contenido con IA</h2>
              </div>
              {noticeMessage && <p className="status-message info compact">{noticeMessage}</p>}
            </div>

            <div className="generation-card-grid">
              {generationOptions.map((option) => (
                <button
                  className="generation-card"
                  type="button"
                  key={option.id}
                  onClick={() => handleGenerationClick(option.title)}
                >
                  <span className="generation-icon">
                    <AiIcon type={option.icon} />
                  </span>
                  <span className="generation-title">{option.title}</span>
                  <span className="generation-description">{option.description}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="results-section">
            <div className="result-tabs" role="tablist" aria-label="Resultados generados">
              {resultTabs.map((tab) => (
                <button
                  className={activeTab === tab.id ? 'active' : undefined}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="result-panel" role="tabpanel">
              <p>No hay contenido generado todavía.</p>
            </div>
          </section>
        </article>
      )}
    </section>
  );
}

export default TopicDetailPage;
