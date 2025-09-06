const API_BASE = window.location.pathname.includes('/vue') ? '' : '/api'

export async function getCategories() {
  const response = await fetch(`${API_BASE}/categories`)
  if (!response.ok) throw new Error('Failed to fetch categories')
  return response.json()
}

export async function getCategory(id) {
  const response = await fetch(`${API_BASE}/categories/${id}`)
  if (!response.ok) throw new Error('Category not found')
  return response.json()
}

export async function createCategory(category) {
  const response = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category)
  })
  if (!response.ok) throw new Error('Failed to create category')
  return response.json()
}

export async function updateCategory(id, category) {
  const response = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category)
  })
  if (!response.ok) throw new Error('Failed to update category')
  return response.json()
}

export async function deleteCategory(id) {
  const response = await fetch(`${API_BASE}/categories/${id}/delete`, {
    method: 'POST'
  })
  if (!response.ok) throw new Error('Failed to delete category')
}