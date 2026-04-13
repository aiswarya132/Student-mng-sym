const BASE = '/api/students'

async function parseBody(res) {
  if (res.status === 204) return null
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await parseBody(res)
  if (!res.ok) {
    const err = new Error(data?.error || 'Request failed')
    err.status = res.status
    throw err
  }
  return data
}

export function listStudents(search) {
  const q = search?.trim() ? `?search=${encodeURIComponent(search.trim())}` : ''
  return request(q)
}

export function getStudent(id) {
  return request(`/${encodeURIComponent(id)}`)
}

export function createStudent(body) {
  return request('', { method: 'POST', body: JSON.stringify(body) })
}

export function updateStudent(id, body) {
  return request(`/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export function deleteStudent(id) {
  return request(`/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
