import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [esRegistro, setEsRegistro] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (esRegistro) {
        await api.post('/usuario/signup', { username, password })
        setEsRegistro(false)
        setError('Usuario creado, ahora inicia sesión')
      } else {
        const { data } = await api.post('/usuario/login', { username, password })
        localStorage.setItem('token', data.token)
        navigate('/pedidos')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Ocurrió un error')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: '48px 40px',
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>📦</div>
          <h1 style={{ margin: 0, fontSize: 26, color: '#134e4a', fontWeight: 700 }}>
            Gestión de Pedidos
          </h1>
          <p style={{ margin: '8px 0 0', color: '#6b7280', fontSize: 14 }}>
            {esRegistro ? 'Crea tu cuenta para continuar' : 'Inicia sesión para continuar'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151', fontSize: 14 }}>
              Usuario
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              required
              style={{ width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: 15, outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#0d9488'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151', fontSize: 14 }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
              style={{ width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: 15, outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#0d9488'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {error && (
            <div style={{
              background: error.includes('creado') ? '#d1fae5' : '#fee2e2',
              color: error.includes('creado') ? '#065f46' : '#991b1b',
              padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 20
            }}>
              {error}
            </div>
          )}

          <button type="submit" style={{
            width: '100%', padding: '13px',
            background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
            color: 'white', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer'
          }}>
            {esRegistro ? 'Crear cuenta' : 'Iniciar sesión'}
          </button>
        </form>

        <p style={{ marginTop: 24, textAlign: 'center', color: '#6b7280', fontSize: 14 }}>
          {esRegistro ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
          <span onClick={() => { setEsRegistro(!esRegistro); setError('') }}
            style={{ color: '#0d9488', fontWeight: 600, cursor: 'pointer' }}>
            {esRegistro ? 'Inicia sesión' : 'Regístrate'}
          </span>
        </p>
      </div>
    </div>
  )
}
