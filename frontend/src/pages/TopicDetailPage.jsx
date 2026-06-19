import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  generateExplanation,
  generateFlashcards,
  generateQuiz,
  generateSummary,
  getTopicById,
  getTopicContents
} from '../api/topics.js';
import FlashcardsResult from '../components/FlashcardsResult.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import MarkdownContent from '../components/MarkdownContent.jsx';
import QuizResult from '../components/QuizResult.jsx';
import { useUsageLimits } from '../hooks/useUsageLimits.js';
import { formatDate } from '../utils/date.js';
import {
  formatRemainingTime,
  getUsageLimitStatus,
  USAGE_ACTIONS
} from '../utils/usageLimits.js';

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

const GENERATION_USAGE_ACTIONS = Object.freeze({
  summary: USAGE_ACTIONS.SUMMARY,
  quiz: USAGE_ACTIONS.QUIZ,
  flashcards: USAGE_ACTIONS.FLASHCARDS,
  explanation: USAGE_ACTIONS.SIMPLIFIED_EXPLANATION
});

const AI_USAGE_ACTIONS = Object.values(GENERATION_USAGE_ACTIONS);

const generationLimitLabels = Object.freeze({
  summary: 'la generación de resumen',
  quiz: 'la generación de quiz',
  flashcards: 'la generación de flashcards',
  explanation: 'la explicación simplificada'
});

const generationProgressMessages = Object.freeze({
  summary: 'Generando resumen...',
  quiz: 'Generando quiz...',
  flashcards: 'Generando flashcards...',
  explanation: 'Generando explicación...'
});

function getGenerationLimitMessage(optionId, limit) {
  return `Ya has usado ${generationLimitLabels[optionId]} en las últimas 24 horas. Podrás volver a usarla en ${formatRemainingTime(limit.remainingMs)}.`;
}

const resultTabs = [
  { id: 'summary', label: 'Resumen', type: 'SUMMARY' },
  { id: 'quiz', label: 'Quiz', type: 'QUIZ' },
  { id: 'flashcards', label: 'Flashcards', type: 'FLASHCARDS' },
  { id: 'explanation', label: 'Explicación', type: 'SIMPLIFIED_EXPLANATION' }
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

function GeneratedResult({ activeTab, content }) {
  if (activeTab === 'quiz') {
    return <QuizResult content={content} />;
  }

  if (activeTab === 'flashcards') {
    return <FlashcardsResult content={content} fallback={<MarkdownContent content={content} />} />;
  }

  return <MarkdownContent content={content} />;
}

function TopicDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [topic, setTopic] = useState(null);
  const [generatedContents, setGeneratedContents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || '');
  const [activeTab, setActiveTab] = useState('summary');
  const {
    limits: generationLimits,
    markUsage,
    refreshLimits
  } = useUsageLimits(AI_USAGE_ACTIONS);

  useEffect(() => {
    let isMounted = true;

    async function loadTopic() {
      try {
        setIsLoading(true);
        const [topicData, contentsData] = await Promise.all([
          getTopicById(id),
          getTopicContents(id)
        ]);

        if (isMounted) {
          setTopic(topicData);
          setGeneratedContents(contentsData);
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

  const activeGeneratedContent = useMemo(() => {
    const activeType = resultTabs.find((tab) => tab.id === activeTab)?.type;
    return generatedContents.find((content) => content.type === activeType);
  }, [activeTab, generatedContents]);

  const availableGenerationUses = AI_USAGE_ACTIONS.filter(
    (action) => generationLimits[action].isAvailable
  ).length;

  async function handleGenerationClick(option) {
    setNoticeMessage('');
    setSuccessMessage('');
    setErrorMessage('');

    const usageAction = GENERATION_USAGE_ACTIONS[option.id];
    const currentUsage = getUsageLimitStatus(usageAction);
    if (!currentUsage.isAvailable) {
      refreshLimits();
      setNoticeMessage(getGenerationLimitMessage(option.id, currentUsage));
      return;
    }

    try {
      const isQuiz = option.id === 'quiz';
      const isFlashcards = option.id === 'flashcards';
      const isExplanation = option.id === 'explanation';
      const targetTab = isQuiz ? 'quiz' : isFlashcards ? 'flashcards' : isExplanation ? 'explanation' : 'summary';

      if (isQuiz) {
        setIsGeneratingQuiz(true);
      } else if (isFlashcards) {
        setIsGeneratingFlashcards(true);
      } else if (isExplanation) {
        setIsGeneratingExplanation(true);
      } else {
        setIsGeneratingSummary(true);
      }

      const generatedContent = isQuiz
        ? await generateQuiz(id)
        : isFlashcards
        ? await generateFlashcards(id)
        : isExplanation
        ? await generateExplanation(id)
        : await generateSummary(id);
      markUsage(usageAction);
      setGeneratedContents((currentContents) => [
        generatedContent,
        ...currentContents.filter((content) => content.id !== generatedContent.id)
      ]);
      setActiveTab(targetTab);
      setSuccessMessage(
        isQuiz
          ? 'Quiz generado correctamente.'
          : isFlashcards
          ? 'Flashcards generadas correctamente.'
          : isExplanation
          ? 'Explicación generada correctamente.'
          : 'Resumen generado correctamente.'
      );
    } catch (error) {
      setErrorMessage(
        option.id === 'quiz'
          ? 'No se pudo generar el quiz. Inténtalo de nuevo en unos segundos.'
          : option.id === 'flashcards'
          ? 'No se pudieron generar las flashcards. Inténtalo de nuevo en unos segundos.'
          : option.id === 'explanation'
          ? 'No se pudo generar la explicación. Inténtalo de nuevo en unos segundos.'
          : 'No se pudo generar el resumen. Inténtalo de nuevo en unos segundos.'
      );
    } finally {
      setIsGeneratingSummary(false);
      setIsGeneratingQuiz(false);
      setIsGeneratingFlashcards(false);
      setIsGeneratingExplanation(false);
    }
  }

  return (
    <section className="page-section">
      <Link className="back-link" to="/history">
        Volver a Mis apuntes
      </Link>

      {isLoading && <LoadingSpinner label="Cargando tema" />}
      {successMessage && <p className="status-message success">{successMessage}</p>}
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
              <h2>Herramientas de estudio</h2>
              <p>
                El resumen, el quiz, las flashcards y la explicación fácil ya pueden generarse con IA.
              </p>
            </aside>
          </div>

          <section className="ai-generation-section">
            <div className="section-title-row">
              <div>
                <p className="eyebrow">Generación IA</p>
                <h2>Generar contenido con IA</h2>
              </div>
              <p className={`status-message ${noticeMessage ? 'error' : 'info'} compact`}>
                {noticeMessage || `Usos de IA disponibles: ${availableGenerationUses} de 4.`}
              </p>
            </div>

            <div className="generation-card-grid">
              {generationOptions.map((option) => {
                const usageLimit = generationLimits[GENERATION_USAGE_ACTIONS[option.id]];
                const isLimitReached = !usageLimit.isAvailable;
                const isGenerating =
                  (option.id === 'summary' && isGeneratingSummary) ||
                  (option.id === 'quiz' && isGeneratingQuiz) ||
                  (option.id === 'flashcards' && isGeneratingFlashcards) ||
                  (option.id === 'explanation' && isGeneratingExplanation);

                return (
                  <button
                    className={`generation-card${isLimitReached ? ' usage-limit-reached' : ''}`}
                    type="button"
                    key={option.id}
                    onClick={() => handleGenerationClick(option)}
                    disabled={isGenerating || isLimitReached}
                  >
                    <span className="generation-icon">
                      <AiIcon type={option.icon} />
                    </span>
                    <span className="generation-title">{option.title}</span>
                    <span className="generation-description">
                      {isGenerating
                        ? generationProgressMessages[option.id]
                        : isLimitReached
                        ? getGenerationLimitMessage(option.id, usageLimit)
                        : option.description}
                    </span>
                  </button>
                );
              })}
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

            <div className={activeGeneratedContent ? 'result-panel has-content' : 'result-panel'} role="tabpanel">
              {activeGeneratedContent ? (
                <GeneratedResult activeTab={activeTab} content={activeGeneratedContent.content} />
              ) : (
                <p>No hay contenido generado todavía.</p>
              )}
            </div>
          </section>
        </article>
      )}
    </section>
  );
}

export default TopicDetailPage;
