const API_BASE = '/api'

export async function getExerciseSets() {
  const response = await fetch(`${API_BASE}/exercise-sets`)
  if (!response.ok) throw new Error('Failed to fetch exercise sets')
  return response.json()
}

export async function getExerciseSet(id) {
  const response = await fetch(`${API_BASE}/exercise-sets/${id}`)
  if (!response.ok) throw new Error('Exercise set not found')
  return response.json()
}

export async function saveExerciseSet(id, data) {
  const url = id ? `${API_BASE}/exercise-sets/${id}` : `${API_BASE}/exercise-sets`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Failed to save exercise set')
  return response.json()
}

export async function deleteExerciseSet(id) {
  const response = await fetch(`${API_BASE}/exercise-sets/${id}/delete`, {
    method: 'POST'
  })
  if (!response.ok) throw new Error('Failed to delete exercise set')
}

export async function saveExercise(id, data) {
  const url = id ? `${API_BASE}/exercises/${id}` : `${API_BASE}/exercises`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Failed to save exercise')
  return response.json()
}

export async function deleteExercise(id) {
  const response = await fetch(`${API_BASE}/exercises/${id}/delete`, {
    method: 'POST'
  })
  if (!response.ok) throw new Error('Failed to delete exercise')
}
