const API_BASE_URL = 'http://localhost:8080/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
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
