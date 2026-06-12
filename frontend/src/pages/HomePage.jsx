import { useState } from 'react';
import { createTopic } from '../api/topics.js';

function HomePage() {
  const [title, setTitle] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!title.trim() || !originalText.trim()) {
      setErrorMessage('Completa el título y los apuntes antes de guardar.');
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
      setErrorMessage('No se pudo guardar el tema. Revisa que el backend esté en marcha.');
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

        <label htmlFor="topic-notes">Apuntes</label>
        <textarea
          id="topic-notes"
          value={originalText}
          onChange={(event) => setOriginalText(event.target.value)}
          placeholder="Pega aquí tus apuntes..."
          rows="14"
        />

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
