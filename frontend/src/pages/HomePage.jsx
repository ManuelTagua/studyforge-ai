import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTopic, importPdf } from '../api/topics.js';
import { useUsageLimits } from '../hooks/useUsageLimits.js';
import {
  formatRemainingTime,
  getUsageLimitStatus,
  USAGE_ACTIONS
} from '../utils/usageLimits.js';

const PDF_USAGE_ACTIONS = [USAGE_ACTIONS.PDF_IMPORT];

function getPdfLimitMessage(limit) {
  return `Ya has importado un PDF en las últimas 24 horas. Podrás volver a importar otro en ${formatRemainingTime(limit.remainingMs)}.`;
}

function HomePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [pdfTitle, setPdfTitle] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [inputMode, setInputMode] = useState('manual');
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isImportingPdf, setIsImportingPdf] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { limits, markUsage, refreshLimits } = useUsageLimits(PDF_USAGE_ACTIONS);
  const pdfUsage = limits[USAGE_ACTIONS.PDF_IMPORT];

  async function handleSubmit(event) {
    event.preventDefault();

    if (inputMode === 'pdf') {
      await handlePdfImport();
      return;
    }

    setSuccessMessage('');
    setErrorMessage('');

    if (!title.trim() || !originalText.trim()) {
      setErrorMessage('Completa el título y pega tus apuntes para guardar el tema.');
      return;
    }

    try {
      setIsSaving(true);
      await createTopic({
        title: title.trim(),
        originalText: originalText.trim()
      });
      setTitle('');
      setOriginalText('');
      setSuccessMessage('Tema guardado correctamente.');
    } catch (error) {
      setErrorMessage('No se pudo completar la acción. Inténtalo de nuevo en unos segundos.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePdfImport() {
    setSuccessMessage('');
    setErrorMessage('');

    const currentPdfUsage = getUsageLimitStatus(USAGE_ACTIONS.PDF_IMPORT);
    if (!currentPdfUsage.isAvailable) {
      refreshLimits();
      setErrorMessage(getPdfLimitMessage(currentPdfUsage));
      return;
    }

    if (!selectedPdf) {
      setErrorMessage('Selecciona un archivo PDF para importarlo.');
      return;
    }

    if (selectedPdf.type !== 'application/pdf' && !selectedPdf.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('El archivo seleccionado no es válido.');
      return;
    }

    try {
      setIsImportingPdf(true);
      const createdTopic = await importPdf(selectedPdf, pdfTitle);
      markUsage(USAGE_ACTIONS.PDF_IMPORT);
      setSelectedPdf(null);
      setPdfTitle('');
      navigate(`/topics/${createdTopic.id}`, {
        state: { successMessage: 'PDF importado correctamente.' }
      });
    } catch (error) {
      const message = error.message || '';
      if (message.includes('texto extraíble')) {
        setErrorMessage('No hemos podido extraer texto de este PDF. Puede que sea un PDF escaneado o basado en imágenes.');
      } else if (message.includes('no es válido') || message.includes('Selecciona')) {
        setErrorMessage('El archivo seleccionado no es válido.');
      } else {
        setErrorMessage('No se pudo completar la acción. Inténtalo de nuevo en unos segundos.');
      }
    } finally {
      setIsImportingPdf(false);
    }
  }

  return (
    <section className="page-grid home-layout">
      <div className="hero-copy">
        <p className="eyebrow">Local study workspace</p>
        <h1 className="hero-title">StudyForge AI</h1>
        <p className="subtitle">
          Guarda tus apuntes por temas y genera resúmenes, quizzes, flashcards y explicaciones
          fáciles con IA para estudiar mejor.
        </p>
        <div className="portfolio-feature-list" aria-label="Qué hace StudyForge AI">
          <span>Importa PDFs o pega apuntes</span>
          <span>Genera resúmenes con IA</span>
          <span>Crea quizzes para practicar</span>
          <span>Convierte contenido en flashcards</span>
          <span>Guarda tus apuntes localmente</span>
        </div>
      </div>

      <form className="topic-form" onSubmit={handleSubmit}>
        <div className="input-mode-tabs" aria-label="Origen de los apuntes">
          <button
            className={inputMode === 'manual' ? 'active' : undefined}
            type="button"
            onClick={() => setInputMode('manual')}
          >
            Pegar apuntes manualmente
          </button>
          <button
            className={inputMode === 'pdf' ? 'active' : undefined}
            type="button"
            onClick={() => setInputMode('pdf')}
          >
            Seleccionar PDF
          </button>
        </div>

        {inputMode === 'manual' && (
          <>
            <label htmlFor="topic-title">Título del tema</label>
            <input
              id="topic-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ej. Fotosíntesis"
              maxLength={180}
            />

            <label htmlFor="topic-notes">Apuntes</label>
            <textarea
              id="topic-notes"
              value={originalText}
              onChange={(event) => setOriginalText(event.target.value)}
              placeholder="Pega aquí tus apuntes..."
              rows="14"
            />
          </>
        )}

        {inputMode === 'pdf' && (
          <div className="pdf-upload-panel">
            <label htmlFor="pdf-title">Título opcional</label>
            <input
              id="pdf-title"
              type="text"
              value={pdfTitle}
              onChange={(event) => setPdfTitle(event.target.value)}
              placeholder="Se usará el nombre del archivo si lo dejas vacío"
              maxLength={180}
              disabled={!pdfUsage.isAvailable}
            />

            <label
              className={`pdf-dropzone${pdfUsage.isAvailable ? '' : ' usage-limit-reached'}`}
              htmlFor="topic-pdf"
            >
              <span className="pdf-icon" aria-hidden="true">PDF</span>
              <span className="pdf-title">Selecciona un archivo PDF</span>
              <span className="pdf-help">Extraeremos el texto y crearemos un tema automáticamente.</span>
              <input
                id="topic-pdf"
                type="file"
                accept="application/pdf,.pdf"
                onChange={(event) => setSelectedPdf(event.target.files?.[0] || null)}
                disabled={!pdfUsage.isAvailable}
              />
            </label>

            {selectedPdf && (
              <p className="selected-file">
                Archivo seleccionado: <strong>{selectedPdf.name}</strong>
              </p>
            )}

            <p className="status-message info">
              Los PDFs escaneados o basados en imagen pueden no contener texto extraíble.
            </p>
            {pdfUsage.isAvailable ? (
              <p className="status-message info">Importaciones PDF disponibles: 1 de 1.</p>
            ) : (
              <p className="status-message error">{getPdfLimitMessage(pdfUsage)}</p>
            )}
          </div>
        )}

        {successMessage && <p className="status-message success">{successMessage}</p>}
        {errorMessage && <p className="status-message error">{errorMessage}</p>}

        {inputMode === 'manual' && (
          <button className="primary-button" type="submit" disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar tema'}
          </button>
        )}

        {inputMode === 'pdf' && (
          <button
            className="primary-button"
            type="submit"
            disabled={isImportingPdf || !pdfUsage.isAvailable}
          >
            {isImportingPdf ? 'Importando...' : 'Importar PDF'}
          </button>
        )}
      </form>
    </section>
  );
}

export default HomePage;
