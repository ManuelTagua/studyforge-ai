import MarkdownContent from './MarkdownContent.jsx';

function normalizeQuizContent(content) {
  return (content || '')
    .replace(/\s+(?=(?:#{1,6}\s*)?\d+\.\s+)/g, '\n\n')
    .replace(/\s+(?=\*{0,2}[A-D]\)\*{0,2}\s+)/g, '\n')
    .replace(/\s+(?=\*{0,2}Respuesta correcta\*{0,2}\s*:)/gi, '\n')
    .trim();
}

function stripInlineMarkdown(value) {
  return (value || '')
    .replace(/^\s*#{1,6}\s*/, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^[-*]\s+/, '')
    .trim();
}

function parseQuiz(content) {
  const normalizedContent = normalizeQuizContent(content);
  const questionPattern =
    /(?:^|\n)\s*(?:#{1,6}\s*)?(\d+)\.\s*([\s\S]*?)(?=\n\s*(?:#{1,6}\s*)?\d+\.\s+|$)/g;
  const questions = [];
  let match = questionPattern.exec(normalizedContent);

  while (match) {
    const block = match[2].trim();
    const optionMatches = [...block.matchAll(/(?:^|\n)\s*\*{0,2}([A-D])\)\*{0,2}\s*([^\n]+)/g)];
    const answerMatch = block.match(/(?:^|\n)\s*\*{0,2}Respuesta correcta\*{0,2}\s*:\s*([A-D])\b/mi);
    const questionText = block
      .split(/\n\s*\*{0,2}A\)\*{0,2}\s+/)[0]
      .replace(/\s*\*{0,2}Respuesta correcta\*{0,2}\s*:\s*[A-D]\b.*$/i, '')
      .trim();

    if (questionText && optionMatches.length >= 4) {
      questions.push({
        number: Number(match[1]),
        question: stripInlineMarkdown(questionText),
        options: optionMatches.slice(0, 4).map((optionMatch) => ({
          letter: optionMatch[1],
          text: stripInlineMarkdown(optionMatch[2])
        })),
        answer: answerMatch?.[1] || ''
      });
    }

    match = questionPattern.exec(normalizedContent);
  }

  return questions;
}

function QuizResult({ content }) {
  const questions = parseQuiz(content);

  if (questions.length === 0) {
    return <MarkdownContent content={normalizeQuizContent(content)} />;
  }

  return (
    <div className="quiz-result-list">
      {questions.map((question) => (
        <article className="quiz-result-card" key={`${question.number}-${question.question}`}>
          <h3>
            {question.number}. {question.question}
          </h3>
          <ol className="quiz-option-list" aria-label={`Opciones de la pregunta ${question.number}`}>
            {question.options.map((option) => (
              <li key={option.letter}>
                <span>{option.letter})</span>
                {option.text}
              </li>
            ))}
          </ol>
          {question.answer && (
            <p className="quiz-answer">Respuesta correcta: {question.answer}</p>
          )}
        </article>
      ))}
    </div>
  );
}

export default QuizResult;
