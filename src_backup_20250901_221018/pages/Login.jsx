import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import CardSpainRoom from '../components/CardSpainRoom.jsx'
import { setUser } from '../store/auth.js'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')
    if(!email.includes('@')) return setError('Email invÃ¡lido')
    if(password.length < 4) return setError('ContraseÃ±a muy corta')
    const role = email.toLowerCase().includes('admin') ? 'admin' : 'user'
    setUser({ email, role })
    navigate('/')
  }

  return (
    <section className="page">
      <div className="auth-grid">
        <CardSpainRoom title="Entrar en SpainRoom">
          <form className="form" onSubmit={onSubmit}>
            <label>Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@email.com" />
            <label>ContraseÃ±a</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="â€¢â€¢â€¢â€¢â€¢â€¢" />
            {error && <div className="error">{error}</div>}
            <button className="btn" type="submit">Entrar</button>
            <p style={{color:'#6b7280'}}>Â¿No tienes cuenta? <Link to="/registro">Registrarse</Link></p>
          </form>
        </CardSpainRoom>
      </div>
    </section>
  )
}


