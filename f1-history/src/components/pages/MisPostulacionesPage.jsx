import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AppContext';

const API = 'http://localhost:8082/api';

const STATUS_CONFIG = {
  PENDING:  { icon: '🕐', label: 'Pendiente', color: 'var(--accent-gold)',  bg: 'rgba(245,197,24,0.1)',  border: 'rgba(245,197,24,0.3)' },
  APPROVED: { icon: '✅', label: 'Aprobado',  color: 'var(--accent-green)', bg: 'rgba(0,230,118,0.1)',   border: 'rgba(0,230,118,0.3)' },
  REJECTED: { icon: '❌', label: 'Rechazado', color: 'var(--accent)',       bg: 'rgba(229,9,20,0.1)',    border: 'rgba(229,9,20,0.3)' },
};

const MisPostulacionesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API}/teams/my-submissions`, {
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
      .then(r => {
        if (!r.ok) throw new Error('No se pudieron cargar tus postulaciones');
        return r.json();
      })
      .then(setTeams)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.token]);

  return (
    <div className="page">
      <div style={{ background:'var(--gradient-hero)', padding:'4rem 0 2.5rem', borderBottom:'1px solid var(--border)' }}>
        <div className="container">
          <div className="hero-eyebrow">📋 Seguimiento</div>
          <h1 style={{ fontSize:'2.8rem', fontWeight:'900', marginBottom:'0.5rem', color:'var(--hero-text-primary)' }}>Mis Postulaciones</h1>
          <p style={{ color:'var(--hero-text-secondary)' }}>Revisa el estado de las escuderías que has postulado</p>
        </div>
      </div>

      <div className="container" style={{ padding:'2rem' }}>
        <div style={{ marginBottom:'1.5rem' }}>
          <button className="btn btn-primary" onClick={() => navigate('/postular-equipo')}>
            ➕ Nueva Postulación
          </button>
        </div>

        {loading && (
          <div style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)' }}>
            <div style={{ fontSize:'2rem', marginBottom:'1rem' }}>⏳</div>
            Cargando tus postulaciones...
          </div>
        )}

        {error && (
          <div style={{ background:'rgba(229,9,20,0.08)', border:'1px solid rgba(229,9,20,0.3)', color:'var(--accent)', padding:'1rem', borderRadius:'6px' }}>
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && teams.length === 0 && (
          <div style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)' }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>📋</div>
            <div style={{ fontWeight:'700', marginBottom:'0.5rem', color:'var(--text-primary)' }}>Aún no has postulado ninguna escudería</div>
            <div style={{ fontSize:'0.85rem' }}>Cuando postules un equipo, aparecerá aquí con su estado.</div>
          </div>
        )}

        {!loading && !error && teams.length > 0 && (
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            {teams.map(team => {
              const cfg = STATUS_CONFIG[team.status] || STATUS_CONFIG.PENDING;
              let pilots = [];
              try { pilots = JSON.parse(team.pilotsData || '[]'); } catch {}

              return (
                <div key={team.id} className="card">
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                      <div style={{ width:48, height:48, borderRadius:'50%', background:team.color, border:'3px solid rgba(255,255,255,0.1)', flexShrink:0 }} />
                      <div>
                        <div style={{ fontWeight:'900', fontSize:'1.1rem', color:'var(--text-primary)' }}>{team.name}</div>
                        <div style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>{team.fullName}</div>
                        <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{team.base} · Fundado: {team.founded}</div>
                      </div>
                    </div>
                    <div style={{ background:cfg.bg, border:`1px solid ${cfg.border}`, color:cfg.color, padding:'4px 12px', borderRadius:'4px', fontSize:'0.75rem', fontWeight:'700' }}>
                      {cfg.icon} {cfg.label}
                    </div>
                  </div>

                  {pilots.length > 0 && (
                    <div style={{ marginTop:'1rem', paddingTop:'1rem', borderTop:'1px solid var(--border)', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                      {pilots.map((p,i) => (
                        <div key={i} style={{ background:'var(--bg-secondary)', padding:'0.75rem 1rem', borderRadius:'6px', border:'1px solid var(--border)' }}>
                          <div style={{ fontSize:'0.68rem', fontWeight:'700', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'0.35rem' }}>Piloto {i+1}</div>
                          <div style={{ fontWeight:'700', color:'var(--text-primary)' }}>{p.name}</div>
                          <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{p.nationality} · #{p.number}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {team.status === 'REJECTED' && team.notes && (
                    <div style={{ marginTop:'0.75rem', padding:'0.75rem 1rem', background:'rgba(229,9,20,0.05)', border:'1px solid rgba(229,9,20,0.15)', borderRadius:'6px', fontSize:'0.82rem', color:'var(--text-secondary)' }}>
                      <strong style={{ color:'var(--accent)' }}>Motivo del rechazo:</strong> {team.notes}
                    </div>
                  )}

                  {team.status === 'APPROVED' && (
                    <div style={{ marginTop:'0.75rem', fontSize:'0.82rem', color:'var(--accent-green)' }}>
                      🎉 Tu equipo y pilotos ya forman parte de la parrilla 2027
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisPostulacionesPage;
