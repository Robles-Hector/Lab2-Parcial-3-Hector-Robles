import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useF1Data, LoadingScreen, ErrorScreen } from '../../hooks/useF1Data';
import { useAuth } from '../../context/AppContext';

const TEAM_COLORS = {
  'Mercedes':'#00D2BE','Red Bull':'#3671C6','Ferrari':'#E8002D','McLaren':'#FF8000',
  'Aston Martin':'#358C75','Alpine':'#0093CC','Williams':'#37BEDD','AlphaTauri':'#4E7C9B',
  'Alfa Romeo':'#B12335','Haas':'#B6BABD','Renault':'#FFF500','Racing Point':'#F596C8',
};

const PilotPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { loading, error, drivers } = useF1Data();
  const [tab, setTab] = useState('stats');
  const [editData, setEditData] = useState({});
  const [saved, setSaved] = useState(false);

  if (loading) return <div className="page"><LoadingScreen /></div>;
  if (error)   return <div className="page"><ErrorScreen message={error} /></div>;

  const driver = drivers.find(d => d.slug === slug);

  if (!driver) return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏎</div>
        <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>Piloto no encontrado</div>
        <button className="btn btn-primary" onClick={() => navigate('/pilotos')}>Ver todos los pilotos</button>
      </div>
    </div>
  );
  
  let seasons = [];
  try { seasons = JSON.parse(driver.seasonsData || '[]'); } catch {}

  const initials = driver.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const teamName = driver.currentTeam?.name ?? 'Sin Escudería';
  const teamColor = TEAM_COLORS[teamName] || '#888';

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div className="page">
      <section className="pilot-hero">
        <div className="container">
          <button onClick={() => navigate('/pilotos')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', fontSize:'0.85rem', cursor:'pointer', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
            ← Volver a Pilotos
          </button>
          <div className="pilot-hero-inner">
            <div className="pilot-avatar-large" style={{ background: `linear-gradient(135deg,${teamColor},rgba(0,0,0,0.6))` }}>
              {initials}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize:'0.75rem', fontWeight:'700', letterSpacing:'0.15em', textTransform:'uppercase', color:teamColor, marginBottom:'0.35rem' }}>
                #{driver.number} · {driver.nationality}
              </div>
              <div className="pilot-title-name">{driver.name}</div>
              <div className="pilot-current-team" style={{ color: teamColor }}>{teamName}</div>
              <div className="pilot-mini-stats">
                {[{v:driver.championships,l:'Títulos'},{v:driver.wins,l:'Victorias'},{v:driver.podiums,l:'Podios'},{v:driver.poles,l:'Poles'}].map((s,i) => (
                  <div key={i}>
                    <div style={{ fontFamily:"'Share Tech Mono',monospace", fontWeight:'900', fontSize:'1.5rem', color:'var(--accent)' }}>{s.v}</div>
                    <div style={{ fontSize:'0.7rem', fontWeight:'700', letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pilot-number">#{driver.number}</div>
          </div>
        </div>
      </section>

      <div className="container" style={{ padding: '2rem' }}>
        <div className="page-tabs">
          {[['stats','📊 Estadísticas'],['seasons','📅 Temporadas'],['teams','🏁 Escuderías'],
            ...(isAdmin ? [['edit','⚙ Editar (Admin)']] : [])
          ].map(([id,lbl]) => (
            <button key={id} className={`page-tab ${tab===id?'active':''}`} onClick={() => setTab(id)}>{lbl}</button>
          ))}
        </div>

        {tab === 'stats' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:'1.5rem' }}>
            <div className="card">
              <div className="card-title" style={{ marginBottom:'1rem' }}>📊 Estadísticas de Carrera</div>
              {[
                {l:'Campeonatos Mundiales',v:driver.championships},
                {l:'Victorias',v:driver.wins},{l:'Podios',v:driver.podiums},
                {l:'Poles Position',v:driver.poles},{l:'Puntos de carrera',v:driver.points},
              ].map((s,i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.7rem 0', borderBottom:'1px solid var(--border)' }}>
                  <span style={{ fontSize:'0.88rem', color:'var(--text-secondary)' }}>{s.l}</span>
                  <span style={{ fontFamily:"'Share Tech Mono',monospace", fontWeight:'700', color:'var(--accent)' }}>{s.v}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="card-title" style={{ marginBottom:'1rem' }}>👤 Información Personal</div>
              {[
                {l:'Nombre completo',v:driver.name},{l:'Nacionalidad',v:driver.nationality},
                {l:'Fecha de nacimiento',v:driver.born},{l:'Número',v:`#${driver.number}`},
                {l:'Equipo actual',v:teamName},
              ].map((s,i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.7rem 0', borderBottom:'1px solid var(--border)', flexWrap:'wrap', gap:'0.5rem' }}>
                  <span style={{ fontSize:'0.88rem', color:'var(--text-secondary)' }}>{s.l}</span>
                  <span style={{ fontWeight:'700', fontSize:'0.9rem', color:'var(--text-primary)' }}>{s.v}</span>
                </div>
              ))}
              {driver.bio && (
                <div style={{ marginTop:'1rem', padding:'1rem', background:'var(--bg-secondary)', borderRadius:'6px', fontSize:'0.88rem', color:'var(--text-secondary)', lineHeight:1.7 }}>
                  {driver.bio}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'seasons' && (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Año</th><th>Escudería</th><th>Posición Final</th><th>Victorias</th><th>Puntos</th></tr></thead>
              <tbody>
                {(seasons.map(s => (
                  <tr key={s.year}>
                    <td style={{ fontFamily:"'Share Tech Mono',monospace", fontWeight:'700', color:'var(--accent)' }}>{s.year}</td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', color:'var(--text-primary)' }}>
                        <span style={{ width:10, height:10, borderRadius:'50%', background:TEAM_COLORS[s.team]||'#888', display:'inline-block' }} />
                        {s.team}
                      </div>
                    </td>
                    <td><span className={`pos-badge ${s.position===1?'pos-1':s.position===2?'pos-2':s.position===3?'pos-3':''}`}>{s.position}</span></td>
                    <td style={{ fontFamily:"'Share Tech Mono',monospace", fontWeight:'700', color:'var(--text-primary)' }}>{s.wins}</td>
                    <td style={{ fontFamily:"'Share Tech Mono',monospace", fontWeight:'700', color:'var(--accent)' }}>{s.points}</td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'teams' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'1rem' }}>
            {[...new Set(seasons.map(s => s.team))].map(team => {
  const teamSeasons = seasons.filter(s => s.team === team);
              const totalWins   = teamSeasons.reduce((a,b) => a + b.wins, 0);
              const totalPoints = teamSeasons.reduce((a,b) => a + b.points, 0);
              return (
                <div key={team} className="card" style={{ borderLeft:`3px solid ${TEAM_COLORS[team]||'#888'}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.75rem' }}>
                    <span style={{ width:12, height:12, borderRadius:'50%', background:TEAM_COLORS[team]||'#888', display:'inline-block' }} />
                    <span style={{ fontWeight:'700', fontSize:'1rem', color:'var(--text-primary)' }}>{team}</span>
                  </div>
                  <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:'0.5rem' }}>
                    Temporadas: {teamSeasons.map(s => s.year).join(', ')}
                  </div>
                  <div style={{ display:'flex', gap:'1.5rem' }}>
                    {[{v:totalWins,l:'Victorias'},{v:totalPoints,l:'Puntos'}].map((s,i) => (
                      <div key={i}>
                        <div style={{ fontFamily:"'Share Tech Mono',monospace", fontWeight:'700', color:'var(--accent)' }}>{s.v}</div>
                        <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'edit' && isAdmin && (
          <div className="admin-form">
            <div className="admin-warning">
              <span className="admin-warning-icon">⚠️</span>
              <span className="admin-warning-text">Como administrador, debes completar la información obligatoria del piloto.</span>
            </div>
            <div className="form-grid">
              {[
                {l:'Nombre completo *',k:'name',def:driver.name},
                {l:'Nacionalidad *',k:'nationality',def:driver.nationality},
                {l:'Fecha de nacimiento *',k:'born',def:driver.born},
                {l:'Número de carrera *',k:'number',def:driver.number},
                {l:'Escudería actual *', k:'currentTeam', def: teamName},
                {l:'Campeonatos',k:'championships',def:driver.championships},
                {l:'Victorias totales',k:'wins',def:driver.wins},
                {l:'Podios totales',k:'podiums',def:driver.podiums},
              ].map(f => (
                <div key={f.k} className="form-group">
                  <label className="form-label">{f.l}</label>
                  <input className="form-input" defaultValue={f.def} onChange={e => setEditData(d => ({...d,[f.k]:e.target.value}))} />
                </div>
              ))}
              <div className="form-group full">
                <label className="form-label">Biografía *</label>
                <textarea className="form-input" rows={4} defaultValue={driver.bio} onChange={e => setEditData(d => ({...d,bio:e.target.value}))} />
              </div>
            </div>
            <div style={{ marginTop:'1.5rem' }}>
              <button className="btn btn-primary" onClick={handleSave}>💾 Guardar Cambios</button>
            </div>
          </div>
        )}
      </div>

      {saved && <div className="success-toast">✅ Datos guardados correctamente</div>}
    </div>
  );
};

export default PilotPage;
