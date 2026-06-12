import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTopic, importPdf } from '../api/topics.js';

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
      setErrorMessage('No hemos podido guardar el tema ahora mismo. Inténtalo de nuevo en unos instantes.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePdfImport() {
    setSuccessMessage('');
    setErrorMessage('');

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
      setSelectedPdf(null);
      setPdfTitle('');
      navigate(`/topics/${createdTopic.id}`, {
        state: { successMessage: 'PDF importado correctamente.' }
      });
    } catch (error) {
      const message = error.message || '';
      if (message.includes('texto extraíble')) {
        setErrorMessage('El PDF no contiene texto extraíble.');
      } else if (message.includes('no es válido') || message.includes('Selecciona')) {
        setErrorMessage('El archivo seleccionado no es válido.');
      } else {
        setErrorMessage('No se pudo importar el PDF.');
      }
    } finally {
      setIsImportingPdf(false);
    }
  }

  return (
    <section className="page-grid home-layout">
      <div className="hero-copy">
        <p className="eyebrow">Local study workspace</p>
        <h1>StudyForge AI</h1>
        <p className="subtitle">
          Guarda tus apuntes por temas y prepara la base para generar resúmenes,
          quizzes, flashcards y explicaciones con IA más adelante.
        </p>
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
            />

            <label className="pdf-dropzone" htmlFor="topic-pdf">
              <span className="pdf-icon" aria-hidden="true">PDF</span>
              <span className="pdf-title">Selecciona un archivo PDF</span>
              <span className="pdf-help">Extraeremos el texto y crearemos un tema automáticamente.</span>
              <input
                id="topic-pdf"
                type="file"
                accept="application/pdf,.pdf"
                onChange={(event) => setSelectedPdf(event.target.files?.[0] || null)}
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
          <button className="primary-button" type="submit" disabled={isImportingPdf}>
            {isImportingPdf ? 'Importando...' : 'Importar PDF'}
          </button>
        )}
      </form>
    </section>
  );
}

export default HomePage;
