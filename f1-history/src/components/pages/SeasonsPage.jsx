import React, { useState } from 'react';
import { useF1Data, LoadingScreen, ErrorScreen } from '../../hooks/useF1Data';

const TEAM_COLORS = {
  'Mercedes':'#00D2BE','Red Bull':'#3671C6','Ferrari':'#E8002D','McLaren':'#FF8000',
  'Aston Martin':'#358C75','Alpine':'#0093CC','Williams':'#37BEDD','Renault':'#FFF500',
  'AlphaTauri':'#4E7C9B','Alfa Romeo':'#B12335','Haas':'#B6BABD','Racing Point':'#F596C8',
  'Kick Sauber':'#52E252','Visa Cash App RB':'#6692FF',
};

const SeasonsPage = () => {
  const { loading, error, seasons, drivers } = useF1Data();
  const [tab, setTab] = useState('drivers');

  const years = Object.keys(seasons).map(Number).sort();
  const [selected, setSelected] = useState(null);

  // Set default once data loads
  const currentYear = selected || (years.length ? years[years.length - 1] : null);
  const season = currentYear ? seasons[currentYear] : null;

  if (loading) return <div className="page"><LoadingScreen /></div>;
  if (error)   return <div className="page"><ErrorScreen message={error} /></div>;

  const standings = drivers
    .map(d => { const s = d.seasons?.find(x => x.year === currentYear); return s ? { ...d, ...s } : null; })
    .filter(Boolean)
    .sort((a, b) => b.points - a.points);

  return (
    <div className="page">
      <div style={{ background: 'var(--gradient-hero)', padding: '4rem 0 2.5rem', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="hero-eyebrow">📅 Historial</div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: '900', marginBottom: '0.5rem', color: 'white' }}>Temporadas</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>Resultados completos de cada campeonato — 2020 a 2026</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem' }}>
        {/* Selector de año */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {years.map(y => (
            <button key={y} onClick={() => setSelected(y)} style={{
              padding: '0.5rem 1.25rem', borderRadius: '4px', border: '1px solid',
              fontWeight: '700', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.9rem',
              cursor: 'pointer', transition: 'all 0.2s',
              background: currentYear === y ? 'var(--accent)' : 'var(--bg-card)',
              borderColor: currentYear === y ? 'var(--accent)' : 'var(--border)',
              color: currentYear === y ? 'white' : 'var(--text-secondary)',
            }}>{y}</button>
          ))}
        </div>

        {season && (
          <>
            {/* Cabecera de temporada */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '3rem', fontWeight: '900', color: 'var(--accent)', lineHeight: 1 }}>{season.year}</div>
                  <div style={{ fontWeight: '700', fontSize: '1rem', marginTop: '0.25rem', color: 'var(--text-primary)' }}>{season.highlight}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.35rem', maxWidth: '500px' }}>{season.description}</div>
                </div>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {[
                    { v: season.races, l: 'Carreras' },
                    { v: season.teams?.length, l: 'Equipos' },
                    { v: season.champion || '—', l: 'Campeón Piloto' },
                    { v: season.constructorChampion || '—', l: 'Campeón Constructor' },
                  ].map((s, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: i < 2 ? '1.8rem' : '0.95rem', fontWeight: '900', color: 'var(--accent)' }}>{s.v}</div>
                      <div style={{ fontSize: '0.68rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="page-tabs">
              {[['drivers','🏎 Clasificación Pilotos'],['teams','🏁 Escuderías'],['info','ℹ️ Información']].map(([id, lbl]) => (
                <button key={id} className={`page-tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>{lbl}</button>
              ))}
            </div>

            {tab === 'drivers' && (
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Pos</th><th>Piloto</th><th>Escudería</th><th>Victorias</th><th>Puntos</th></tr></thead>
                  <tbody>
                    {standings.map((d, i) => (
                      <tr key={d.id}>
                        <td><span className={`pos-badge ${i===0?'pos-1':i===1?'pos-2':i===2?'pos-3':''}`}>{i+1}</span></td>
                        <td>
                          <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{d.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.nationality}</div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: TEAM_COLORS[d.team] || '#888', display: 'inline-block', flexShrink: 0 }} />
                            {d.team}
                          </div>
                        </td>
                        <td style={{ fontFamily: "'Share Tech Mono',monospace", fontWeight: '700', color: 'var(--text-primary)' }}>{d.wins}</td>
                        <td style={{ fontFamily: "'Share Tech Mono',monospace", fontWeight: '700', color: 'var(--accent)' }}>{d.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === 'teams' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {season.teams?.map(t => (
                  <div key={t} className="card" style={{ borderLeft: `3px solid ${TEAM_COLORS[t] || '#888'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <span style={{ width: 12, height: 12, borderRadius: '50%', background: TEAM_COLORS[t] || '#888', display: 'inline-block' }} />
                      <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>{t}</span>
                    </div>
                    {t === season.constructorChampion && (
                      <span style={{ background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.3)', color: 'var(--accent-gold)', padding: '2px 8px', borderRadius: '2px', fontSize: '0.7rem', fontWeight: '700' }}>
                        🏆 Campeón Constructor
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {tab === 'info' && (
              <div className="card">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>Temporada {season.year}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{season.description}</p>
                <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  {[
                    { l: 'Carreras disputadas', v: season.races },
                    { l: 'Campeón Piloto', v: season.champion || 'Por definir' },
                    { l: 'Campeón Constructor', v: season.constructorChampion || 'Por definir' },
                    { l: 'Equipos participantes', v: season.teams?.length },
                  ].map((x, i) => (
                    <div key={i} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>{x.l}</div>
                      <div style={{ fontWeight: '700', fontFamily: "'Share Tech Mono',monospace", color: 'var(--accent)' }}>{x.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SeasonsPage;
