import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import CardSpainRoom from '../components/CardSpainRoom.jsx'
import { setUser } from '../store/auth.js'

export default function Registro(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')
    if(!email.includes('@')) return setError('Email invÃ¡lido')
    if(password.length < 6) return setError('La contraseÃ±a debe tener 6+ caracteres')
    if(password !== password2) return setError('Las contraseÃ±as no coinciden')
    setUser({ email, role:'user' })
    navigate('/')
  }

  return (
    <section className="page">
      <div className="auth-grid">
        <CardSpainRoom title="Crear cuenta">
          <form className="form" onSubmit={onSubmit}>
            <label>Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@email.com" />
            <label>ContraseÃ±a</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="â€¢â€¢â€¢â€¢â€¢â€¢" />
            <label>Repetir contraseÃ±a</label>
            <input type="password" value={password2} onChange={e=>setPassword2(e.target.value)} placeholder="â€¢â€¢â€¢â€¢â€¢â€¢" />
            {error && <div className="error">{error}</div>}
            <button className="btn" type="submit">Crear cuenta</button>
            <p style={{color:'#6b7280'}}>Â¿Ya tienes cuenta? <Link to="/login">Entrar</Link></p>
          </form>
        </CardSpainRoom>
      </div>
    </section>
  )
}


