const API_BASE = window.location.pathname.includes('/vue') ? '' : '/api'

export async function getWorksheets() {
  const response = await fetch(`${API_BASE}/worksheets`)
  if (!response.ok) throw new Error('Failed to fetch worksheets')
  return response.json()
}

export async function getWorksheet(id) {
  const response = await fetch(`${API_BASE}/worksheets/${id}`)
  if (!response.ok) throw new Error('Worksheet not found')
  return response.json()
}

export async function createWorksheet(worksheet) {
  const response = await fetch(`${API_BASE}/worksheets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(worksheet)
  })
  if (!response.ok) throw new Error('Failed to create worksheet')
  return response.json()
}

export async function updateWorksheet(id, worksheet) {
  const response = await fetch(`${API_BASE}/worksheets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(worksheet)
  })
  if (!response.ok) throw new Error('Failed to update worksheet')
  return response.json()
}

export async function deleteWorksheet(id) {
  const response = await fetch(`${API_BASE}/worksheets/${id}/delete`, {
    method: 'GET'
  })
  if (!response.ok) throw new Error('Failed to delete worksheet')
}