import { useState } from 'react';
import { createTopic } from '../api/topics.js';

function HomePage() {
  const [title, setTitle] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [inputMode, setInputMode] = useState('manual');
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
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
      setSelectedPdf(null);
      setInputMode('manual');
      setSuccessMessage('Tema guardado correctamente.');
    } catch (error) {
      setErrorMessage('No hemos podido guardar el tema ahora mismo. Inténtalo de nuevo en unos instantes.');
    } finally {
      setIsSaving(false);
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
        <label htmlFor="topic-title">Título del tema</label>
        <input
          id="topic-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ej. Fotosíntesis"
          maxLength={180}
        />

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
            <label className="pdf-dropzone" htmlFor="topic-pdf">
              <span className="pdf-icon" aria-hidden="true">PDF</span>
              <span className="pdf-title">Selecciona un archivo PDF</span>
              <span className="pdf-help">De momento solo mostraremos el nombre del archivo.</span>
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
              La importación de PDF estará disponible próximamente. Para guardar un tema ahora,
              pega tus apuntes manualmente.
            </p>
          </div>
        )}

        {successMessage && <p className="status-message success">{successMessage}</p>}
        {errorMessage && <p className="status-message error">{errorMessage}</p>}

        <button className="primary-button" type="submit" disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar tema'}
        </button>
      </form>
    </section>
  );
}

export default HomePage;
