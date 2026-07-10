import { useState, useEffect } from 'react';
import localData from '../data/f1Data.json'; 

// 1. HOOK CENTRAL: Une datos del Backend (Spring Boot) y Locales (JSON)
export const useF1Data = () => {
  const [teams, setTeams] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mantenemos estas secciones de tu JSON local para no saturar la BD
  const seasons = localData.seasons;
  const circuits = localData.circuits;
  const recentRaces = localData.recentRaces;

  useEffect(() => {
    const API_BASE_URL = 'http://localhost:8082/api';

    const fetchBackendData = async () => {
      try {
        setLoading(true);

        // Consumo en paralelo desde tu Spring Boot en el puerto 8082
        const [teamsResponse, driversResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/teams`),
          fetch(`${API_BASE_URL}/drivers`)
        ]);

        if (!teamsResponse.ok || !driversResponse.ok) {
          throw new Error('No se pudo conectar con la API de Spring Boot. ¡Asegúrate de que el backend esté corriendo!');
        }

        const teamsData = await teamsResponse.json();
        const driversData = await driversResponse.json();

        setTeams(teamsData);
        setDrivers(driversData);
        console.log('Driver sample:', driversData[0]);
        setError(null);
      } catch (err) {
        console.error("Error de integración:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBackendData();
  }, []);

  return {
    loading,
    error,
    seasons,
    circuits,
    recentRaces,
    teams,
    drivers
  };
};

// 2. COMPONENTE: Pantalla de carga reutilizable
export const LoadingScreen = () => (
  <div style={{
    minHeight: '60vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: '1rem'
  }}>
    <div style={{ fontSize: '3rem', animation: 'spin 1s linear infinite' }}>🏎️</div>
    <div style={{ fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
      Cargando datos desde Spring Boot...
    </div>
    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
  </div>
);

// 3. COMPONENTE: Pantalla de error controlada
export const ErrorScreen = ({ message }) => (
  <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
    <div style={{ fontSize: '3rem' }}>⚠️</div>
    <div style={{ fontWeight: '700', color: 'var(--accent)' }}>Error al sincronizar el sistema</div>
    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', maxWidth: '400px' }}>{message}</div>
  </div>
);