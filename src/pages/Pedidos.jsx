import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([])
  const [form, setForm] = useState({ nombre: '', telefono: '', fecha_solicitud: '', fecha_envio: '', total: '', comentario: '' })
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const navigate = useNavigate()

  const cargarPedidos = async () => {
    try {
      const { data } = await api.get('/pedidos')
      setPedidos(data)
    } catch {
      setError('Error al cargar pedidos')
    }
  }

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/')
    } else {
      cargarPedidos()
    }
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleCrear = async (e) => {
    e.preventDefault()
    try {
      await api.post('/pedidos', form)
      setForm({ nombre: '', telefono: '', fecha_solicitud: '', fecha_envio: '', total: '', comentario: '' })
      setExito('Pedido creado correctamente')
      setTimeout(() => setExito(''), 3000)
      cargarPedidos()
    } catch {
      setError('Error al crear pedido')
    }
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este pedido?')) return
    try {
      await api.delete(`/pedidos/${id}`)
      cargarPedidos()
    } catch {
      setError('Error al eliminar pedido')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    border: '2px solid #ccfbf1', borderRadius: 8,
    fontSize: 14, outline: 'none', background: '#f0fdfa'
  }

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#f0fdfa' }}>

      {/* Navbar */}
      <div style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>📦</span>
          <h1 style={{ margin: 0, color: 'white', fontSize: 20, fontWeight: 700 }}>Gestión de Pedidos</h1>
        </div>
        <button onClick={handleLogout}
          style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.5)', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
          Cerrar sesión
        </button>
      </div>

      <div style={{ maxWidth: 1000, margin: '32px auto', padding: '0 24px' }}>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{error}</div>}
        {exito && <div style={{ background: '#d1fae5', color: '#065f46', padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{exito}</div>}

        {/* Formulario */}
        <div style={{ background: 'white', borderRadius: 12, padding: 28, marginBottom: 28, boxShadow: '0 2px 16px rgba(13,148,136,0.1)', border: '1px solid #ccfbf1' }}>
          <h2 style={{ margin: '0 0 20px', color: '#134e4a', fontSize: 18, fontWeight: 700 }}>➕ Nuevo Pedido</h2>
          <form onSubmit={handleCrear}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#0f766e', fontSize: 13 }}>Nombre del cliente</label>
                <input name="nombre" placeholder="Nombre completo" value={form.nombre} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#0f766e', fontSize: 13 }}>Teléfono</label>
                <input name="telefono" placeholder="10 dígitos" value={form.telefono} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#0f766e', fontSize: 13 }}>Fecha de solicitud</label>
                <input name="fecha_solicitud" type="date" value={form.fecha_solicitud} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#0f766e', fontSize: 13 }}>Fecha de envío</label>
                <input name="fecha_envio" type="date" value={form.fecha_envio} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#0f766e', fontSize: 13 }}>Total ($)</label>
                <input name="total" type="number" placeholder="0.00" value={form.total} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#0f766e', fontSize: 13 }}>Comentario</label>
                <input name="comentario" placeholder="Notas adicionales..." value={form.comentario} onChange={handleChange} style={inputStyle} />
              </div>
            </div>
            <button type="submit" style={{
              padding: '11px 28px',
              background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
              color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer'
            }}>
              Crear pedido
            </button>
          </form>
        </div>

        {/* Tabla */}
        <div style={{ background: 'white', borderRadius: 12, padding: 28, boxShadow: '0 2px 16px rgba(13,148,136,0.1)', border: '1px solid #ccfbf1' }}>
          <h2 style={{ margin: '0 0 20px', color: '#134e4a', fontSize: 18, fontWeight: 700 }}>
            📋 Pedidos ({pedidos.length})
          </h2>
          {pedidos.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#9ca3af', padding: '40px 0' }}>No hay pedidos aún</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#f0fdfa' }}>
                  {['Nombre', 'Teléfono', 'Fecha envío', 'Total', 'Comentario', 'Acciones'].map(h => (
                    <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: '#0f766e', fontWeight: 600, borderBottom: '2px solid #99f6e4' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p) => (
                  <tr key={p._id} style={{ borderBottom: '1px solid #f0fdfa' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#134e4a' }}>{p.nombre}</td>
                    <td style={{ padding: '12px 14px', color: '#4b5563' }}>{p.telefono}</td>
                    <td style={{ padding: '12px 14px', color: '#4b5563' }}>{new Date(p.fecha_envio).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ background: '#ccfbf1', color: '#0f766e', padding: '4px 12px', borderRadius: 20, fontWeight: 700 }}>
                        ${p.total}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#6b7280' }}>{p.comentario || '—'}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <button onClick={() => handleEliminar(p._id)}
                        style={{ padding: '6px 14px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
