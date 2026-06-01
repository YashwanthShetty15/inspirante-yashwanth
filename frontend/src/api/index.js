const BASE_URL = 'http://localhost:3000/api'

function getToken() {
  return localStorage.getItem('token')
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  }
}

// ── Auth
export async function loginUser(username, password) {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Login failed')
    return data
  } catch (error) {
    throw error
  }
}

// ── Events 
export async function getEvents() {
  try {
    const res = await fetch(`${BASE_URL}/events`, {
      headers: authHeaders()
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to fetch events')
    return data
  } catch (error) {
    throw error
  }
}

export async function createEvent(eventData) {
  try {
    const res = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(eventData)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to create event')
    return data
  } catch (error) {
    throw error
  }
}

export async function getEventRegistrations(eventId) {
  try {
    const res = await fetch(`${BASE_URL}/events/${eventId}/registrations`, {
      headers: authHeaders()
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to fetch registrations')
    return data
  } catch (error) {
    throw error
  }
}

// ── Registrations 
export async function registerForEvent(eventId) {
  try {
    const res = await fetch(`${BASE_URL}/registrations`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ eventId })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to register')
    return data
  } catch (error) {
    throw error
  }
}

export async function getMyRegistrations() {
  try {
    const res = await fetch(`${BASE_URL}/registrations/mine`, {
      headers: authHeaders()
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to fetch your registrations')
    return data
  } catch (error) {
    throw error
  }
}