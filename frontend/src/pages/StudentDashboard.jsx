import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getEvents, registerForEvent, getMyRegistrations } from '../api/index'

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [events, setEvents] = useState([])
  const [myRegistrations, setMyRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(null)
  const [errors, setErrors] = useState({})
  const [successes, setSuccesses] = useState({})

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    try {
      setLoading(true)
      const [eventsData, myRegsData] = await Promise.all([
        getEvents(),
        getMyRegistrations()
      ])
      setEvents(eventsData)
      setMyRegistrations(myRegsData)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(eventId) {
    setErrors(prev => ({ ...prev, [eventId]: '' }))
    setSuccesses(prev => ({ ...prev, [eventId]: '' }))
    setRegistering(eventId)
    try {
      await registerForEvent(eventId)
      setSuccesses(prev => ({ ...prev, [eventId]: 'Registered successfully!' }))
      fetchAll()
    } catch (error) {
      setErrors(prev => ({ ...prev, [eventId]: error.message || 'Registration failed' }))
    } finally {
      setRegistering(null)
    }
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  function isRegistered(eventId) {
    return myRegistrations.some(reg => reg.event?._id === eventId || reg.event === eventId)
  }

  function isFull(event) {
    return event.registrationCount >= event.capacity
  }

  function spotsLeft(event) {
    return event.capacity - event.registrationCount
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
            <p className="page-subtitle">Student Dashboard</p>
          </div>
          <div className="flex gap-12 align-center">
            <span className="welcome-text">Hey, {user?.name} </span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div className="student-grid">

          {/* ── Left: All Events ── */}
          <div>
            <div className="card">
              <h2 className="card-heading">Upcoming Events</h2>
              {loading && <p className="muted-text mt-16">Loading events...</p>}
              {!loading && events.length === 0 && (
                <p className="muted-text mt-16">No events available.</p>
              )}
              <div className="event-list mt-16">
                {events.map(event => {
                  const registered = isRegistered(event._id)
                  const full = isFull(event)
                  const left = spotsLeft(event)
                  return (
                    <div key={event._id} className="event-item">
                      <div className="flex-between">
                        <div className="event-info">
                          <div className="event-name">{event.name}</div>
                          <div className="event-meta">
                            {formatDate(event.date)} · {event.venue}
                          </div>
                          <div className="event-meta mt-4">
                            {full
                              ? <span className="full-label">No spots left</span>
                              : <span>{left} spot{left !== 1 ? 's' : ''} left</span>
                            }
                          </div>
                        </div>
                        <div className="flex flex-col gap-8 align-end">
                          {registered ? (
                            <button
                              className="btn-primary"
                              style={{ padding: '8px 16px', fontSize: '13px' }}
                              onClick={() => setErrors(prev => ({ ...prev, [event._id]: 'You have already registered for this event.' }))}
                            >
                              ✓ Registered
                            </button>
                          ) : full ? (
                            <button className="btn-disabled" disabled>Full</button>
                          ) : (
                            <button
                              className="btn-primary"
                              style={{ padding: '8px 16px', fontSize: '13px' }}
                              onClick={() => handleRegister(event._id)}
                              disabled={registering === event._id}
                            >
                              {registering === event._id ? '...' : 'Register'}
                            </button>
                          )}
                        </div>
                      </div>
                      {errors[event._id] && (
                        <div className="error-msg mt-8">{errors[event._id]}</div>
                      )}
                      {successes[event._id] && (
                        <div className="success-msg mt-8">{successes[event._id]}</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── Right: My Registrations ── */}
          <div>
            <div className="card">
              <h2 className="card-heading">My Registrations</h2>
              {loading && <p className="muted-text mt-16">Loading...</p>}
              {!loading && myRegistrations.length === 0 && (
                <p className="muted-text mt-16">You haven't registered for any events yet.</p>
              )}
              <div className="event-list mt-16">
                {myRegistrations.map(reg => (
                  <div key={reg._id} className="event-item">
                    <div className="event-name">{reg.event?.name}</div>
                    <div className="event-meta mt-4">
                      {reg.event?.date ? formatDate(reg.event.date) : ''} · {reg.event?.venue}
                    </div>
                    <div className="mt-8">
                      <span className="chip chip-blue">✓ Registered</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}