import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AppContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Completa todos los campos');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await register(username.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'var(--bg-primary)' }}>
      <div style={{ position:'fixed', inset:0, zIndex:0, background:'var(--gradient-hero)', opacity:0.6 }} />
      <div style={{
        position:'fixed', inset:0, zIndex:0,
        backgroundImage:`radial-gradient(circle at 20% 50%, rgba(229,9,20,0.08) 0%, transparent 50%),
                         radial-gradient(circle at 80% 20%, rgba(229,9,20,0.05) 0%, transparent 40%)`,
      }} />

      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:'440px', padding:'1.5rem' }}>

        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.75rem' }}>
            <span style={{ background:'var(--accent)', color:'var(--bg-primary)', fontSize:'0.85rem', padding:'4px 12px', borderRadius:'3px', fontWeight:'900', letterSpacing:'0.15em' }}>F1</span>
            <span style={{ fontWeight:'900', fontSize:'1.1rem', letterSpacing:'0.1em', color:'var(--text-primary)' }}>HISTORICAL DB</span>
          </div>
          <div style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>Crea tu cuenta para postular escuderías</div>
        </div>

        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'12px', padding:'2.5rem', boxShadow:'var(--shadow)' }}>
          <h1 style={{ fontSize:'1.6rem', fontWeight:'900', marginBottom:'0.25rem' }}>Crear Cuenta</h1>
          <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', marginBottom:'2rem' }}>Regístrate para acceder al dashboard y postular equipos</p>

          {error && (
            <div style={{ background:'rgba(229,9,20,0.08)', border:'1px solid rgba(229,9,20,0.3)', color:'var(--accent)', padding:'0.75rem 1rem', borderRadius:'6px', fontSize:'0.85rem', marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem', marginBottom:'1.75rem' }}>
            <div className="form-group">
              <label className="form-label">Usuario</label>
              <input className="form-input" style={{ width:'100%' }} type="text" placeholder="Elige un nombre de usuario"
                value={username} onChange={e => setUsername(e.target.value)} autoFocus />
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input className="form-input" style={{ width:'100%' }} type="password" placeholder="Mínimo 6 caracteres"
                value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Confirmar Contraseña</label>
              <input className="form-input" style={{ width:'100%' }} type="password" placeholder="Repite tu contraseña"
                value={confirm} onChange={e => setConfirm(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>
          </div>

          <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center', height:'48px', fontSize:'0.9rem' }}
            onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creando cuenta...' : '✅ Registrarme'}
          </button>

          <div style={{ marginTop:'1.5rem', textAlign:'center', fontSize:'0.85rem', color:'var(--text-muted)' }}>
            ¿Ya tienes cuenta?{' '}
            <button onClick={() => navigate('/login')} style={{ background:'none', border:'none', color:'var(--accent)', cursor:'pointer', fontWeight:'700' }}>
              Inicia sesión
            </button>
          </div>
        </div>

        <div style={{ textAlign:'center', marginTop:'1.5rem' }}>
          <button onClick={() => navigate('/')} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:'0.85rem' }}>
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
