import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useF1Data, LoadingScreen, ErrorScreen } from '../../hooks/useF1Data';

const TEAM_COLORS = {
  'Red Bull':'#3671C6','Mercedes':'#00D2BE','Ferrari':'#E8002D',
  'McLaren':'#FF8000','Aston Martin':'#358C75',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', padding:'0.75rem 1rem', borderRadius:'6px', fontSize:'0.85rem' }}>
      <div style={{ fontWeight:'700', marginBottom:'0.4rem', color:'var(--text-primary)' }}>{label}</div>
      {payload.map((p,i) => <div key={i} style={{ color:p.color||'var(--accent)' }}>{p.name}: {p.value}</div>)}
    </div>
  );
};

const DashboardPage = () => {
  const { loading, error, seasons, drivers, recentRaces } = useF1Data();

  if (loading) return <div className="page"><LoadingScreen /></div>;
  if (error)   return <div className="page"><ErrorScreen message={error} /></div>;

  const seasonList = Object.values(seasons).sort((a,b) => a.year - b.year);

  const winsPerYear = seasonList.map(s => ({
    year: s.year, wins: s.results?.[0]?.wins || 0, champion: s.champion?.split(' ').pop() || '—'
  }));

  const pointsData = [...drivers]
  .sort((a, b) => b.wins - a.wins)
  .slice(0, 5)
  .map(d => ({
    name: d.name.split(' ')[1] || d.name.split(' ')[0],
    total: d.points,
    wins: d.wins,
  }));

  const champPie = [
    { name:'Verstappen', value:4 },
    { name:'Hamilton',   value:1 },
    { name:'Norris',     value:1 },
  ];
  const pieColors = ['#3671C6','#00D2BE','#FF8000'];

  const seasonPoints = seasonList.map(s => ({
    year: String(s.year),
    p1: s.results?.[0]?.points || 0,
    p2: s.results?.[1]?.points || 0,
  }));

  const current = seasonList[seasonList.length - 1];

  console.log('drivers recibidos:', drivers);
console.log('pointsData calculado:', pointsData);

  return (
    <div className="page">
      <div style={{ background:'var(--gradient-hero)', padding:'4rem 0 2.5rem', borderBottom:'1px solid var(--border)' }}>
        <div className="container">
          <div className="hero-eyebrow">📊 Panel</div>
          <h1 style={{ fontSize:'2.8rem', fontWeight:'900', marginBottom:'0.5rem', color:'white' }}>Dashboard</h1>
          <p style={{ color:'rgba(255,255,255,0.6)' }}>Visión general de estadísticas, tendencias y resultados recientes</p>
        </div>
      </div>

      <div className="container" style={{ padding:'2rem' }}>
        {/* KPIs */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
          {[
            {icon:'🏆', val:'4', label:'Títulos Verstappen',  sub:'2021–2024',      color:'#3671C6'},
            {icon:'🏎', val:'104',label:'Victorias Hamilton', sub:'Récord histórico',color:'#00D2BE'},
            {icon:'🏁', val:'17', label:'Victorias Norris',   sub:'2023–2026',      color:'#FF8000'},
            {icon:'🔴', val: String(seasonList.reduce((a,s)=>a+s.races,0)), label:'GPs disputados', sub:'2020–2026', color:'#E8002D'},
            {icon:'📅', val: String(seasonList.length), label:'Temporadas', sub:'2020–2026', color:'#358C75'},
          ].map((c,i) => (
            <div key={i} className="card" style={{ borderTop:`3px solid ${c.color}` }}>
              <div style={{ fontSize:'1.5rem', marginBottom:'0.5rem' }}>{c.icon}</div>
              <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'2rem', fontWeight:'900', color:c.color, lineHeight:1 }}>{c.val}</div>
              <div style={{ fontWeight:'700', fontSize:'0.85rem', marginTop:'0.25rem', color:'var(--text-primary)' }}>{c.label}</div>
              <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{c.sub}</div>
            </div>
          ))}
        </div>

        <div className="dashboard-grid">
          {/* Victorias por año */}
          <div className="card col-8">
            <div className="card-header"><div className="card-title">🏆 Victorias del Campeón por Temporada</div></div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={winsPerYear}>
                <XAxis dataKey="year" tick={{ fill:'var(--text-muted)', fontSize:12 }} />
                <YAxis tick={{ fill:'var(--text-muted)', fontSize:12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="wins" fill="var(--accent)" radius={[4,4,0,0]} name="Victorias" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Títulos */}
          <div className="card col-4">
            <div className="card-header"><div className="card-title">🥇 Distribución Títulos 2020–2026</div></div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={champPie} cx="50%" cy="50%" outerRadius={65} dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={11}>
                  {champPie.map((_,i) => <Cell key={i} fill={pieColors[i]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display:'flex', gap:'0.75rem', justifyContent:'center', flexWrap:'wrap' }}>
              {champPie.map((c,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.35rem', fontSize:'0.75rem', color:'var(--text-secondary)' }}>
                  <span style={{ width:10, height:10, borderRadius:'50%', background:pieColors[i], display:'inline-block' }} />
                  {c.name}
                </div>
              ))}
            </div>
          </div>

          {/* Puntos por temporada */}
          <div className="card col-8">
            <div className="card-header"><div className="card-title">📈 Puntos del Top 2 por Temporada</div></div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={seasonPoints}>
                <XAxis dataKey="year" tick={{ fill:'var(--text-muted)', fontSize:12 }} />
                <YAxis tick={{ fill:'var(--text-muted)', fontSize:12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="p1" stroke="var(--accent)" strokeWidth={2.5} dot={{ r:4 }} name="1° Puesto" />
                <Line type="monotone" dataKey="p2" stroke="var(--accent-blue)" strokeWidth={2.5} dot={{ r:4 }} name="2° Puesto" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Ranking actual */}
          <div className="card col-4">
            <div className="card-header"><div className="card-title">🏎 Ranking Actual {current?.year}</div></div>
            {current?.results?.map((r,i) => {
              const maxPts = current.results[0].points;
              return (
                <div key={i} className="ranking-item">
                  <div className={`rank-pos ${i<3?'top3':''}`}>{i+1}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:'700', fontSize:'0.88rem', color:'var(--text-primary)' }}>{r.driver.split(' ')[1]||r.driver}</div>
                    <div style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{r.team}</div>
                    <div className="rank-bar-wrap">
                      <div className="rank-bar" style={{ width:`${(r.points/maxPts)*100}%`, background:TEAM_COLORS[r.team]||'var(--accent)' }} />
                    </div>
                  </div>
                  <div className="rank-points">{r.points}</div>
                </div>
              );
            })}
          </div>

          {/* Últimas carreras */}
          <div className="card col-12">
            <div className="card-header"><div className="card-title">🏁 Últimas Carreras {current?.year}</div></div>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Gran Premio</th><th>Circuito</th><th>Fecha</th><th>Ganador</th><th>Equipo</th><th>Vuelta Rápida</th></tr></thead>
                <tbody>
                  {recentRaces.map((r,i) => (
                    <tr key={i}>
                      <td style={{ fontWeight:'700', color:'var(--text-primary)' }}>{r.race}</td>
                      <td style={{ color:'var(--text-muted)', fontSize:'0.88rem' }}>{r.circuit}</td>
                      <td style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'0.82rem', color:'var(--text-muted)' }}>{r.date}</td>
                      <td style={{ fontWeight:'700', color:'var(--text-primary)' }}>{r.winner}</td>
                      <td>
                        <span style={{ display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.85rem', color:'var(--text-primary)' }}>
                          <span style={{ width:8, height:8, borderRadius:'50%', background:TEAM_COLORS[r.team]||'#888', display:'inline-block' }} />
                          {r.team}
                        </span>
                      </td>
                      <td style={{ fontSize:'0.85rem', color:'var(--text-secondary)' }}>{r.fastestLap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Victorias top 5 */}
          <div className="card col-12">
            <div className="card-header"><div className="card-title">📊 Top 5 Pilotos — Victorias Históricas</div></div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={pointsData} layout="vertical">
                <XAxis type="number" tick={{ fill:'var(--text-muted)', fontSize:12 }} />
                <YAxis type="category" dataKey="name" tick={{ fill:'var(--text-secondary)', fontSize:13 }} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="wins" fill="var(--accent)" radius={[0,4,4,0]} name="Victorias" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
