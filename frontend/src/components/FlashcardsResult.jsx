import { useState } from 'react';
import MarkdownContent from './MarkdownContent.jsx';

function cleanCardText(value) {
  return value
    .trim()
    .replace(/^\s*#{1,6}\s*/, '')
    .replace(/^[-*]\s+/, '')
    .replace(/^\*+|\*+$/g, '')
    .trim();
}

export function parseFlashcards(content) {
  if (!content) {
    return [];
  }

  const flashcardPattern =
    /(?:^|\n)\s*(?:#{1,6}\s*)?\*{0,2}Flashcard\s+(\d+)\*{0,2}\s*[\r\n]+(?:[-*]\s*)?\*{0,2}Pregunta:\*{0,2}\s*([\s\S]*?)[\r\n]+(?:[-*]\s*)?\*{0,2}Respuesta:\*{0,2}\s*([\s\S]*?)(?=[\r\n]+\s*(?:#{1,6}\s*)?\*{0,2}Flashcard\s+\d+\*{0,2}|$)/gi;
  const flashcards = [];
  let match = flashcardPattern.exec(content);

  while (match) {
    flashcards.push({
      number: Number(match[1]),
      question: cleanCardText(match[2]),
      answer: cleanCardText(match[3])
    });
    match = flashcardPattern.exec(content);
  }

  return flashcards;
}

function Flashcard({ flashcard, index }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const number = flashcard.number || index + 1;
  const toggleFlashcard = () => setIsFlipped((currentValue) => !currentValue);
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleFlashcard();
    }
  };

  return (
    <article
      className={isFlipped ? 'flashcard-result-card is-flipped' : 'flashcard-result-card'}
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      onClick={toggleFlashcard}
      onKeyDown={handleKeyDown}
    >
      <span className="flashcard-number">Flashcard {number}</span>
      <span className="flashcard-flip-hint">{isFlipped ? 'Respuesta' : 'Pregunta'}</span>
      <div className="flashcard-flip-stage" aria-hidden="true">
        <div className="flashcard-face flashcard-front">
          <MarkdownContent content={flashcard.question} />
        </div>
        <div className="flashcard-face flashcard-back">
          <MarkdownContent content={flashcard.answer} />
        </div>
      </div>
      <span className="flashcard-action-hint">
        {isFlipped ? 'Pulsa para ver pregunta' : 'Pulsa para ver respuesta'}
      </span>
      <span className="sr-only">
        {isFlipped ? `Respuesta: ${flashcard.answer}` : `Pregunta: ${flashcard.question}`}
      </span>
    </article>
  );
}

function FlashcardsResult({ content, fallback = null }) {
  const flashcards = parseFlashcards(content);

  if (flashcards.length === 0) {
    return fallback;
  }

  return (
    <div className="flashcard-result-grid">
      {flashcards.map((flashcard, index) => (
        <Flashcard flashcard={flashcard} index={index} key={`${flashcard.number}-${flashcard.question}`} />
      ))}
    </div>
  );
}

export default FlashcardsResult;
