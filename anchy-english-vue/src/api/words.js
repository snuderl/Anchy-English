const API_BASE = window.location.pathname.includes('/vue') ? '' : '/api'

export async function getWords() {
  const response = await fetch(`${API_BASE}/words`)
  if (!response.ok) throw new Error('Failed to fetch words')
  return response.json()
}

export async function searchWords(query) {
  const response = await fetch(`${API_BASE}/words/search?q=${encodeURIComponent(query)}`)
  if (!response.ok) throw new Error('Failed to search words')
  return response.json()
}

export async function createWord(word) {
  const response = await fetch(`${API_BASE}/words`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(word)
  })
  if (!response.ok) throw new Error('Failed to create word')
  return response.json()
}

export async function updateWord(id, word) {
  const response = await fetch(`${API_BASE}/words/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(word)
  })
  if (!response.ok) throw new Error('Failed to update word')
  return response.json()
}

export async function deleteWord(id) {
  const response = await fetch(`${API_BASE}/words/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Failed to delete word')
}