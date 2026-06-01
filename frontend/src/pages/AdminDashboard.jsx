import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getEvents, createEvent, getEventRegistrations } from '../api/index'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '', date: '', venue: '', maxCapacity: ''
  })
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  const [selectedEvent, setSelectedEvent] = useState(null)
  const [registrations, setRegistrations] = useState([])
  const [regLoading, setRegLoading] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    try {
      setLoading(true)
      const data = await getEvents()
      setEvents(data)
    } catch (error) {
      setError('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateEvent(e) {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')
    setFormLoading(true)
    try {
      await createEvent({
        name: formData.name,
        date: formData.date,
        venue: formData.venue,
        capacity: Number(formData.maxCapacity)
      })
      setFormSuccess('Event created successfully!')
      setFormData({ name: '', date: '', venue: '', maxCapacity: '' })
      fetchEvents()
    } catch (error) {
      setFormError(error.message || 'Failed to create event')
    } finally {
      setFormLoading(false)
    }
  }

  async function handleViewRegistrations(event) {
    setSelectedEvent(event)
    setRegLoading(true)
    try {
      const data = await getEventRegistrations(event._id)
      setRegistrations(data)
    } catch (error) {
      setRegistrations([])
    } finally {
      setRegLoading(false)
    }
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  function getCapacityColor(registered, max) {
    const pct = (registered / max) * 100
    if (pct >= 80) return 'red'
    if (pct >= 50) return 'amber'
    return 'green'
  }

  function getCapacityPct(registered, max) {
    return Math.round((registered / max) * 100)
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="page-wrapper">
      <div className="container">

        {/* ── Header ── */}
        <div className="flex-between mb-32">
          <div>
            <div className="brand-name">Inspirante</div>
            <p className="page-subtitle">Admin Dashboard</p>
          </div>
          <div className="flex gap-12 align-center">
            <span className="welcome-text">Hey, {user?.name} 👋</span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div className="dashboard-grid">

          {/* ── Left: Create Event Form ── */}
          <div>
            <div className="card">
              <h2 className="card-heading">Create Event</h2>
              <div className="flex flex-col gap-12 mt-16">
                <div>
                  <label className="input-label">Event Name</label>
                  <input
                    className="input mt-8"
                    type="text"
                    placeholder="e.g. Tech Symposium 2026"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="input-label">Date</label>
                  <input
                    className="input mt-8"
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="input-label">Venue</label>
                  <input
                    className="input mt-8"
                    type="text"
                    placeholder="e.g. Main Auditorium"
                    value={formData.venue}
                    onChange={e => setFormData({ ...formData, venue: e.target.value })}
                  />
                </div>
                <div>
                  <label className="input-label">Max Capacity</label>
                  <input
                    className="input mt-8"
                    type="number"
                    placeholder="e.g. 120"
                    value={formData.maxCapacity}
                    onChange={e => setFormData({ ...formData, maxCapacity: e.target.value })}
                  />
                </div>
              </div>
              {formError && <div className="error-msg mt-12">{formError}</div>}
              {formSuccess && <div className="success-msg mt-12">{formSuccess}</div>}
              <button
                className="btn-primary w-full mt-16"
                onClick={handleCreateEvent}
                disabled={formLoading}
              >
                {formLoading ? 'Creating...' : 'Create Event →'}
              </button>
            </div>
          </div>

          {/* ── Right: Events List ── */}
          <div>
            <div className="card">
              <h2 className="card-heading">All Events</h2>
              {loading && <p className="muted-text mt-16">Loading events...</p>}
              {error && <div className="error-msg mt-12">{error}</div>}
              {!loading && events.length === 0 && (
                <p className="muted-text mt-16">No events yet. Create one!</p>
              )}
              <div className="event-list mt-16">
                {events.map(event => {
                  const color = getCapacityColor(event.registrationCount, event.capacity)
                  const pct = getCapacityPct(event.registrationCount, event.capacity)
                  return (
                    <div key={event._id} className="event-item">
                      <div className="flex-between">
                        <div className="event-info">
                          <div className="event-name">{event.name}</div>
                          <div className="event-meta">
                            {formatDate(event.date)} · {event.venue}
                          </div>
                          <div className="event-meta mt-4">
                            {event.registrationCount} / {event.capacity} registered
                          </div>
                          <div className="progress-bg mt-8">
                            <div
                              className={`progress-fill progress-${color}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-8 align-end">
                          <span className={`chip chip-${color}`}>{pct}%</span>
                          <button
                            className="btn-secondary"
                            onClick={() => handleViewRegistrations(event)}
                          >
                            View List
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

        </div>

        {/* ── Registrations Modal ── */}
        {selectedEvent && (
          <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <div className="flex-between mb-16">
                <h2 className="card-heading">{selectedEvent.name}</h2>
                <button className="btn-close" onClick={() => setSelectedEvent(null)}>✕</button>
              </div>
              <p className="muted-text mb-16">
                {formatDate(selectedEvent.date)} · {selectedEvent.venue}
              </p>
              {regLoading && <p className="muted-text">Loading...</p>}
              {!regLoading && registrations.length === 0 && (
                <p className="muted-text">No registrations yet.</p>
              )}
              {!regLoading && registrations.length > 0 && (
                <div className="reg-list">
                  {registrations.map((reg, i) => (
                    <div key={reg._id} className="reg-item">
                      <span className="reg-number">{i + 1}</span>
                      <span className="reg-name">{reg.student?.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}