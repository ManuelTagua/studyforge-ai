const API_BASE_URL = 'http://localhost:8080/api';

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
    throw new Error(message || 'No se pudo completar la petición');
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
