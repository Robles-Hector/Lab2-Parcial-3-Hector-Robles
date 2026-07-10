import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useF1Data, LoadingScreen, ErrorScreen } from '../../hooks/useF1Data';

const TEAM_COLORS = {
  'Mercedes':'#00D2BE','Red Bull':'#3671C6','Ferrari':'#E8002D','McLaren':'#FF8000',
  'Aston Martin':'#358C75','Alpine':'#0093CC','Williams':'#37BEDD','Renault':'#FFF500',
  'Racing Point':'#F596C8','AlphaTauri':'#4E7C9B','Alfa Romeo':'#B12335','Haas':'#B6BABD',
  'Kick Sauber':'#52E252','Visa Cash App RB':'#6692FF',
};

const GlobalSearch = ({ drivers, seasons, teams, circuits }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const search = (q) => {
    setQuery(q);
    if (!q.trim()) { setResults([]); setOpen(false); return; }
    const lq = q.toLowerCase(); const found = [];
    drivers.filter(d => d.name.toLowerCase().includes(lq)).slice(0,3)
      .forEach(d => found.push({ type:'Piloto', name:d.name, sub:d.currentTeam, path:`/piloto/${d.slug}` }));
    teams.filter(t => t.name.toLowerCase().includes(lq)).slice(0,2)
      .forEach(t => found.push({ type:'Escudería', name:t.name, sub:t.base, path:'/temporadas' }));
    Object.values(seasons).filter(s => String(s.year).includes(lq)).slice(0,2)
      .forEach(s => found.push({ type:'Temporada', name:`Temporada ${s.year}`, sub:`Campeón: ${s.champion||'En curso'}`, path:'/temporadas' }));
    circuits.filter(c => c.name.toLowerCase().includes(lq)||c.country.toLowerCase().includes(lq)).slice(0,2)
      .forEach(c => found.push({ type:'Circuito', name:c.name, sub:c.country, path:'/circuitos' }));
    setResults(found); setOpen(found.length > 0);
  };
  const go = (path) => { navigate(path); setQuery(''); setOpen(false); };
  return (
    <div className="search-container" ref={ref}>
      <span className="search-icon">🔍</span>
      <input className="search-input" value={query} onChange={e => search(e.target.value)}
        placeholder="Buscar piloto, escudería, temporada o circuito..."
        onFocus={() => results.length > 0 && setOpen(true)} />
      {open && (
        <div className="search-results">
          {results.map((r,i) => (
            <div key={i} className="search-result-item" onClick={() => go(r.path)}>
              <span className="search-result-type">{r.type}</span>
              <div><div className="search-result-name">{r.name}</div><div className="search-result-sub">{r.sub}</div></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TimelineSection = ({ seasons }) => {
  const years = Object.keys(seasons).map(Number).sort();
  const [selected, setSelected] = useState(years[years.length-2] || years[0]);
  const season = seasons[selected];
  if (!season) return null;
  return (
    <div className="timeline-section">
      <div className="container">
        <div style={{marginBottom:'2rem'}}>
          <div className="section-title">Historia</div>
          <div className="section-heading">Timeline Interactiva</div>
          <div style={{color:'var(--text-secondary)',fontSize:'0.9rem'}}>Explora cada temporada — pilotos, autos y campeonatos</div>
        </div>
        <div className="timeline-track">
          {years.map(y => (
            <div key={y} className={`timeline-item ${selected===y?'active':''}`} onClick={() => setSelected(y)}>
              <div className="timeline-year">{y}</div>
              <div className="timeline-dot" />
              <div className="timeline-label">{seasons[y].champion?.split(' ').pop()||'En curso'}</div>
            </div>
          ))}
        </div>
        <div className="timeline-content">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'1rem',marginBottom:'1.5rem'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.5rem'}}>
                <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'2rem',fontWeight:'900',color:'var(--accent)'}}>{season.year}</span>
                {season.champion && <span style={{background:'rgba(245,197,24,0.1)',border:'1px solid rgba(245,197,24,0.3)',color:'var(--accent-gold)',fontSize:'0.72rem',padding:'3px 10px',borderRadius:'2px',fontWeight:'700',letterSpacing:'0.1em'}}>🏆 {season.highlight}</span>}
              </div>
              <div style={{color:'var(--text-secondary)',fontSize:'0.9rem',maxWidth:'500px'}}>{season.description}</div>
            </div>
            <div style={{display:'flex',gap:'2rem'}}>
              {[{v:season.races,l:'Carreras'},{v:season.teams?.length,l:'Equipos'}].map((s,i) => (
                <div key={i} style={{textAlign:'center'}}>
                  <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'1.8rem',fontWeight:'900',color:'var(--accent)'}}>{s.v}</div>
                  <div style={{fontSize:'0.7rem',fontWeight:'700',letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--text-muted)'}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'}}>
            <div>
              <div style={{fontSize:'0.72rem',fontWeight:'700',letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:'1rem'}}>🏎 Top 3 Pilotos</div>
              {season.results?.map((r,i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.6rem 0',borderBottom:'1px solid var(--border)'}}>
                  <span className={`pos-badge ${i===0?'pos-1':i===1?'pos-2':'pos-3'}`}>{i+1}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:'700',fontSize:'0.9rem',color:'var(--text-primary)'}}>{r.driver}</div>
                    <div style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>{r.team}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontFamily:"'Share Tech Mono',monospace",fontWeight:'700',color:'var(--accent)'}}>{r.points} pts</div>
                    <div style={{fontSize:'0.72rem',color:'var(--text-muted)'}}>{r.wins} victorias</div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div style={{fontSize:'0.72rem',fontWeight:'700',letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:'1rem'}}>🏁 Escuderías</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem'}}>
                {season.teams?.map(t => (
                  <span key={t} style={{display:'flex',alignItems:'center',gap:'0.4rem',background:'var(--bg-secondary)',border:'1px solid var(--border)',padding:'4px 10px',borderRadius:'4px',fontSize:'0.78rem',fontWeight:'600',color:'var(--text-primary)'}}>
                    <span style={{width:8,height:8,borderRadius:'50%',background:TEAM_COLORS[t]||'#888',display:'inline-block'}} />{t}
                  </span>
                ))}
              </div>
              {season.constructorChampion && (
                <div style={{marginTop:'1.25rem',padding:'1rem',background:'rgba(229,9,20,0.05)',border:'1px solid rgba(229,9,20,0.15)',borderRadius:'6px'}}>
                  <div style={{fontSize:'0.7rem',fontWeight:'700',letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--accent)',marginBottom:'0.35rem'}}>🏆 Campeón Constructor</div>
                  <div style={{fontWeight:'900',fontSize:'1.1rem',display:'flex',alignItems:'center',gap:'0.5rem',color:'var(--text-primary)'}}>
                    <span style={{width:10,height:10,borderRadius:'50%',background:TEAM_COLORS[season.constructorChampion]||'#888',display:'inline-block'}} />
                    {season.constructorChampion}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const { loading, error, seasons, drivers, teams, circuits } = useF1Data();
  if (loading) return <div className="page"><LoadingScreen /></div>;
  if (error)   return <div className="page"><ErrorScreen message={error} /></div>;
  const currentChampion = seasons['2025'];
  const champion = currentChampion?.results?.[0];
  return (
    <div className="page">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-eyebrow">🏎 Base de Datos Histórica</div>
            <h1 className="hero-title">FORMULA <span>1</span><br />HISTORICAL DATABASE</h1>
            <div className="hero-years">1950 — 2026</div>
            <p className="hero-subtitle">Explora pilotos, equipos, temporadas y estadísticas históricas de la competición más exigente del mundo.</p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => navigate('/pilotos')}>🏎 Explorar Pilotos</button>
              <button className="btn btn-secondary" onClick={() => navigate('/temporadas')}>📅 Ver Temporadas</button>
            </div>
          </div>
        </div>
        <div className="hero-stripe" />
      </section>

      <section className="bg-secondary-section" style={{padding:'2.5rem 0'}}>
        <div className="container">
          <GlobalSearch drivers={drivers} seasons={seasons} teams={teams} circuits={circuits} />
        </div>
      </section>

      <section className="section" style={{paddingTop:'3rem',paddingBottom:'2rem'}}>
        <div className="container">
          <div className="section-title">Estadísticas Globales</div>
          <div className="section-heading" style={{marginBottom:'1.5rem'}}>Números de una Era</div>
          <div className="stats-grid">
            {[
              {val:Object.keys(seasons).length, label:'Temporadas'},
              {val:`${drivers.length}+`,        label:'Pilotos'},
              {val:teams.length,                label:'Escuderías'},
              {val:circuits.length,             label:'Circuitos'},
              {val:Object.values(seasons).reduce((a,s)=>a+s.races,0), label:'Carreras'},
              {val:[...new Set(Object.values(seasons).filter(s=>s.champion).map(s=>s.champion))].length, label:'Campeones'},
            ].map((s,i) => (
              <div key={i} className="stat-card">
                <div className="stat-value">{s.val}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {champion && (
        <section className="section" style={{paddingTop:'1rem',paddingBottom:'2rem'}}>
          <div className="container">
            <div className="section-title">Campeón Vigente</div>
            <div className="section-heading" style={{marginBottom:'1.5rem'}}>Campeón 2025</div>
            <div className="champion-card" style={{cursor:'pointer'}} onClick={() => navigate('/piloto/lando-norris')}>
              <div className="champion-avatar">LN</div>
              <div>
                <div className="champion-name">{champion.driver}</div>
                <div className="champion-team">{champion.team}</div>
                <div className="champion-stats">
                  {[{v:champion.points,l:'Puntos'},{v:champion.wins,l:'Victorias'},{v:1,l:'Títulos'},{v:champion.podiums,l:'Podios 2025'}].map((s,i) => (
                    <div key={i}><div className="champion-stat-val">{s.v}</div><div className="champion-stat-lbl">{s.l}</div></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <TimelineSection seasons={seasons} />

      <footer className="bg-secondary-section" style={{padding:'2rem 0',textAlign:'center'}}>
        <div className="container">
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0.75rem',marginBottom:'0.5rem'}}>
            <span style={{background:'var(--accent)',color:'var(--hero-text-primary)',fontSize:'0.7rem',padding:'2px 8px',borderRadius:'2px',fontWeight:'900'}}>F1</span>
            <span style={{fontWeight:'700',letterSpacing:'0.1em',color:'var(--text-primary)'}}>HISTORICAL DATABASE</span>
          </div>
          <div style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>Datos históricos 2020–2026 · Proyecto educativo</div>
        </div>
      </footer>
    </div>
  );
};
export default HomePage;
