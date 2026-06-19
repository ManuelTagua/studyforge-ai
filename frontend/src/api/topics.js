const API_URL = "https://studyforge-ai-314w.onrender.com/api";

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const { headers, ...fetchOptions } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers: isFormData
      ? headers
      : {
          'Content-Type': 'application/json',
          ...headers
        }
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'No se pudo completar la acción.');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getTopics() {
  return request('/topics');
}

export function getTopicById(id) {
  return request(`/topics/${id}`);
}

export function getTopicContents(id) {
  return request(`/topics/${id}/contents`);
}

export function createTopic(topic) {
  return request('/topics', {
    method: 'POST',
    body: JSON.stringify(topic)
  });
}

export function importPdf(file, title) {
  const formData = new FormData();
  formData.append('file', file);

  if (title?.trim()) {
    formData.append('title', title.trim());
  }

  return request('/topics/import-pdf', {
    method: 'POST',
    body: formData
  });
}

export function generateSummary(topicId) {
  return request(`/ai/summary/${topicId}`, {
    method: 'POST'
  });
}

export function generateQuiz(topicId) {
  return request(`/ai/quiz/${topicId}`, {
    method: 'POST'
  });
}

export function generateFlashcards(topicId) {
  return request(`/ai/flashcards/${topicId}`, {
    method: 'POST'
  });
}

export function generateExplanation(topicId) {
  return request(`/ai/explanation/${topicId}`, {
    method: 'POST'
  });
}
