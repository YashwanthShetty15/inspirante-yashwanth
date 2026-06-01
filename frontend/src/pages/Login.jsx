import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../api/index'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await loginUser(username, password)
      login(data.user, data.token)

      if (data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/student')
      }
    } catch (error) {
      setError(error.message || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-glow" />

      <div className="login-layout">
        <div className="login-header">
          <div className="login-logo">Inspirante</div>
          <p className="login-sub">Event Registration Portal</p>
        </div>

        <div className="card login-card">
          <div className="flex flex-col gap-12">
            <div>
              <label className="input-label">Username</label>
              <input
                className="input mt-8"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="input-label">Password</label>
              <input
                className="input mt-8"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="error-msg mt-16">{error}</div>}

          <button
            className="btn-primary w-full mt-24"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </div>
      </div>
    </div>
  )
}