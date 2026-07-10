import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useF1Data, LoadingScreen, ErrorScreen } from '../../hooks/useF1Data';

const TEAM_COLORS = {
  'Mercedes':'#00D2BE','Red Bull':'#3671C6','Ferrari':'#E8002D','McLaren':'#FF8000',
  'Aston Martin':'#358C75','Alpine':'#0093CC','Williams':'#37BEDD','AlphaTauri':'#4E7C9B',
  'Alfa Romeo':'#B12335','Haas':'#B6BABD',
};

const initials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2);

const DriversPage = () => {
  const navigate = useNavigate();
  const { loading, error, drivers } = useF1Data();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  if (loading) return <div className="page"><LoadingScreen /></div>;
  if (error)   return <div className="page"><ErrorScreen message={error} /></div>;

  const filtered = drivers.filter(d => {
    const q = search.toLowerCase();
    const teamName = d.currentTeam?.name ?? '';
    const matchSearch = !q ||
      d.name.toLowerCase().includes(q) ||
      d.nationality.toLowerCase().includes(q) ||
      teamName.toLowerCase().includes(q);
    const matchFilter = filter === 'all' || (filter === 'champions' && d.championships > 0);
    return matchSearch && matchFilter;
  });

  return (
    <div className="page">
      <div style={{ background: 'var(--gradient-hero)', padding: '4rem 0 2.5rem', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="hero-eyebrow">🏎 Parrilla</div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: '900', marginBottom: '0.5rem', color: 'white' }}>Pilotos</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>Todos los pilotos activos en la era 2020–2026</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
            <input
              style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', padding: '0.65rem 1rem 0.65rem 2.25rem', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }}
              placeholder="Buscar piloto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[['all','Todos'],['champions','🏆 Campeones']].map(([val, lbl]) => (
              <button key={val} onClick={() => setFilter(val)} className={`btn btn-sm ${filter===val?'btn-primary':'btn-secondary'}`}>{lbl}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {filtered.map(driver => {
            const teamName = driver.currentTeam?.name ?? 'Sin Escudería';
            const teamColor = TEAM_COLORS[teamName] ?? '#888';

            return (
              <div
                key={driver.id}
                className="card"
                style={{ cursor: 'pointer', borderLeft: `3px solid ${teamColor}` }}
                onClick={() => navigate(`/piloto/${driver.slug}`)}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width:60, height:60, borderRadius:'50%', background:`linear-gradient(135deg,${teamColor},rgba(0,0,0,0.5))`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'900', fontSize:'1.1rem', color:'white', flexShrink:0 }}>
                    {initials(driver.name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '900', fontSize: '1rem', color: 'var(--text-primary)' }}>{driver.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{driver.nationality}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      <span style={{ width:8, height:8, borderRadius:'50%', background: teamColor, display:'inline-block' }} />
                      {teamName}
                    </div>
                  </div>
                  <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'1.4rem', fontWeight:'700', color:'var(--border)', lineHeight:1 }}>
                    #{driver.number}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  {[{v:driver.championships,l:'Títulos'},{v:driver.wins,l:'Victorias'},{v:driver.podiums,l:'Podios'}].map((s,i) => (
                    <div key={i}>
                      <div style={{ fontFamily:"'Share Tech Mono',monospace", fontWeight:'700', color:'var(--accent)', fontSize:'1.1rem' }}>{s.v}</div>
                      <div style={{ fontSize:'0.68rem', fontWeight:'700', letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text-muted)' }}>{s.l}</div>
                    </div>
                  ))}
                </div>

                {driver.championships > 0 && (
                  <div style={{ marginTop: '0.75rem' }}>
                    {Array.from({ length: Math.min(driver.championships, 7) }).map((_, i) => (
                      <span key={i} style={{ fontSize: '0.9rem' }}>🏆</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏎</div>
            <div style={{ fontWeight: '700' }}>No se encontraron pilotos</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriversPage;