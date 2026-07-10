import React, { useState } from 'react';
import { useF1Data, LoadingScreen, ErrorScreen } from '../../hooks/useF1Data';

const TEAM_COLORS = {
  'Mercedes':'#00D2BE','Red Bull':'#3671C6','Ferrari':'#E8002D','McLaren':'#FF8000',
  'Aston Martin':'#358C75','Alpine':'#0093CC','Williams':'#37BEDD',
};

const initials = name => name.split(' ').map(n => n[0]).join('').slice(0, 2);

const STAT_ROWS = [
  { label:'🏆 Títulos',    k:'championships' },
  { label:'🏁 Victorias',  k:'wins' },
  { label:'🥇 Podios',     k:'podiums' },
  { label:'⚡ Poles',      k:'poles' },
  { label:'📊 Puntos tot.',k:'points' },
];

const ComparatorPage = () => {
  const { loading, error, drivers } = useF1Data();
  const [p1Id, setP1Id] = useState(null);
  const [p2Id, setP2Id] = useState(null);

  if (loading) return <div className="page"><LoadingScreen /></div>;
  if (error)   return <div className="page"><ErrorScreen message={error} /></div>;

  const defaultP1 = drivers.find(d => d.slug === 'max-verstappen')?.id ?? drivers[0]?.id;
  const defaultP2 = drivers.find(d => d.slug === 'lando-norris')?.id  ?? drivers[1]?.id;

  const p1 = drivers.find(d => d.id === (p1Id ?? defaultP1));
  const p2 = drivers.find(d => d.id === (p2Id ?? defaultP2));

  if (!p1 || !p2) return null;

  const teamName = (driver) => driver.currentTeam?.name ?? 'Sin Escudería';
  const teamColor = (driver) => TEAM_COLORS[teamName(driver)] ?? '#888';

  const better = (k) => ({
    p1: p1[k] > p2[k],
    p2: p2[k] > p1[k],
  });

  return (
    <div className="page">
      <div style={{ background:'var(--gradient-hero)', padding:'4rem 0 2.5rem', borderBottom:'1px solid var(--border)' }}>
        <div className="container">
          <div className="hero-eyebrow">⚔️ Duelo</div>
          <h1 style={{ fontSize:'2.8rem', fontWeight:'900', marginBottom:'0.5rem', color:'white' }}>Comparador de Pilotos</h1>
          <p style={{ color:'rgba(255,255,255,0.6)' }}>Compara estadísticas cara a cara entre dos pilotos</p>
        </div>
      </div>

      <div className="container" style={{ padding:'2rem' }}>

        {/* Selectores */}
        <div style={{ display:'flex', gap:'1.5rem', marginBottom:'2rem', flexWrap:'wrap', alignItems:'center', justifyContent:'center' }}>
          <select
            className="comparator-select"
            value={p1Id ?? defaultP1}
            onChange={e => setP1Id((e.target.value))}
          >
            {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <div style={{ fontWeight:'900', fontSize:'1.3rem', color:'var(--accent)' }}>VS</div>
          <select
            className="comparator-select"
            value={p2Id ?? defaultP2}
            onChange={e => setP2Id((e.target.value))}
          >
            {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        {/* Cabeceras de piloto */}
        <div style={{ display:'flex', justifyContent:'space-around', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
          {[p1, p2].map(p => (
            <div key={p.id} style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
              <div style={{
                width:70, height:70, borderRadius:'50%',
                background:`linear-gradient(135deg,${teamColor(p)},rgba(0,0,0,0.5))`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontWeight:'900', fontSize:'1.2rem', color:'white',
                border:`2px solid ${teamColor(p)}`
              }}>
                {initials(p.name)}
              </div>
              <div>
                <div style={{ fontWeight:'900', fontSize:'1.2rem', color:'var(--text-primary)' }}>{p.name}</div>
                <div style={{ fontSize:'0.82rem', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:'0.35rem' }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:teamColor(p), display:'inline-block' }} />
                  {teamName(p)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabla 3×3 */}
        <div className="comparator-grid" style={{ marginBottom:'2rem' }}>
          {/* Cabecera */}
          <div className="comparator-cell comparator-header">Estadísticas</div>
          <div className="comparator-cell comparator-header" style={{ textAlign:'center' }}>
            <div style={{ fontWeight:'900', color:'var(--text-primary)' }}>{p1.name.split(' ')[0]}</div>
            <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>Títulos · Victorias</div>
          </div>
          <div className="comparator-cell comparator-header" style={{ textAlign:'center', borderRight:'none' }}>
            <div style={{ fontWeight:'900', color:'var(--text-primary)' }}>{p2.name.split(' ')[0]}</div>
            <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>Títulos · Victorias</div>
          </div>

          {/* Fila Títulos */}
          <div className="comparator-cell"><div className="comparator-stat-name">🏆 Títulos</div></div>
          <div className="comparator-cell" style={{ textAlign:'center' }}>
            <div className={`comparator-val ${better('championships').p1 ? 'better' : ''}`} style={{ fontSize:'2rem' }}>{p1.championships}</div>
            <div style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>Puntos totales</div>
            <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'0.9rem', color:'var(--text-secondary)' }}>{p1.points}</div>
          </div>
          <div className="comparator-cell" style={{ textAlign:'center', borderRight:'none' }}>
            <div className={`comparator-val ${better('championships').p2 ? 'better' : ''}`} style={{ fontSize:'2rem' }}>{p2.championships}</div>
            <div style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>Puntos totales</div>
            <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'0.9rem', color:'var(--text-secondary)' }}>{p2.points}</div>
          </div>

          {/* Fila Victorias */}
          <div className="comparator-cell" style={{ borderBottom:'none' }}><div className="comparator-stat-name">🏁 Victorias</div></div>
          <div className="comparator-cell" style={{ textAlign:'center', borderBottom:'none' }}>
            <div className={`comparator-val ${better('wins').p1 ? 'better' : ''}`} style={{ fontSize:'2rem' }}>{p1.wins}</div>
            <div style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>Podios</div>
            <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'0.9rem', color:'var(--text-secondary)' }}>{p1.podiums}</div>
          </div>
          <div className="comparator-cell" style={{ textAlign:'center', borderBottom:'none', borderRight:'none' }}>
            <div className={`comparator-val ${better('wins').p2 ? 'better' : ''}`} style={{ fontSize:'2rem' }}>{p2.wins}</div>
            <div style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>Podios</div>
            <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'0.9rem', color:'var(--text-secondary)' }}>{p2.podiums}</div>
          </div>
        </div>

        {/* Comparación extendida */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'1rem' }}>
          {STAT_ROWS.map(s => {
            const b = better(s.k);
            const total = (p1[s.k] ?? 0) + (p2[s.k] ?? 0);
            const pct = total > 0 ? ((p1[s.k] ?? 0) / total) * 100 : 50;
            return (
              <div key={s.k} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'8px', padding:'1.25rem' }}>
                <div style={{ fontSize:'0.75rem', fontWeight:'700', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'0.75rem' }}>{s.label}</div>
                <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                  <div style={{ flex:1, textAlign:'center' }}>
                    <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginBottom:'0.25rem' }}>{p1.name.split(' ')[0]}</div>
                    <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'1.6rem', fontWeight:'900', color: b.p1 ? 'var(--accent-green)' : 'var(--text-primary)' }}>{p1[s.k]}</div>
                  </div>
                  <div style={{ color:'var(--text-muted)', fontWeight:'700' }}>vs</div>
                  <div style={{ flex:1, textAlign:'center' }}>
                    <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginBottom:'0.25rem' }}>{p2.name.split(' ')[0]}</div>
                    <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'1.6rem', fontWeight:'900', color: b.p2 ? 'var(--accent-green)' : 'var(--text-primary)' }}>{p2[s.k]}</div>
                  </div>
                </div>
                <div style={{ marginTop:'0.75rem', height:'6px', background:'var(--bg-secondary)', borderRadius:'3px', overflow:'hidden', display:'flex' }}>
                  <div style={{ width:`${pct}%`, background:'var(--accent)', transition:'width 0.8s ease' }} />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default ComparatorPage;