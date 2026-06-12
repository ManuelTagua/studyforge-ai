import ReactMarkdown from 'react-markdown';

const conversationalIntroPattern =
  /^\s*(?:[#>*\-\s]*)?(?:[\u00a1!\u00bf?]*\s*)?(?:claro que s[i\u00ed]|por supuesto|aqu[i\u00ed] tienes|te dejo|te explico|vamos a explicar|vamos a|a continuaci[o\u00f3]n|este es|esta es)\b[^\n.?:!]*(?:[.?:!]+|\n+|$)\s*/i;

function cleanGeneratedContent(content) {
  let cleanContent = content || '';

  while (conversationalIntroPattern.test(cleanContent)) {
    cleanContent = cleanContent.replace(conversationalIntroPattern, '');
  }

  return cleanContent.trim();
}

function MarkdownContent({ content }) {
  return (
    <div className="markdown-content">
      <ReactMarkdown>{cleanGeneratedContent(content)}</ReactMarkdown>
    </div>
  );
}

export default MarkdownContent;
