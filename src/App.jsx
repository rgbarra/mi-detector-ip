// src/App.jsx
import React, { useState, useEffect } from 'react';
import { getIpDetails } from './services/ipService';

function App() {
  const [ipData, setIpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCustomSearch, setIsCustomSearch] = useState(false);

  const fetchIpData = async (ipToSearch = '') => {
    try {
      setLoading(true);
      setError(null);
      const data = await getIpDetails(ipToSearch);
      setIpData(data);
    } catch (err) {
      setError(err.message);
      setIpData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIpData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError('Por favor, ingresa una dirección IP válida.');
      return;
    }
    setIsCustomSearch(true);
    fetchIpData(searchQuery.trim());
  };

  const handleReset = () => {
    setSearchQuery('');
    setIsCustomSearch(false);
    fetchIpData();
  };

  return (
    <div>
      <header style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ color: 'var(--accent-cyan)', fontSize: '2.5rem', margin: '0 0 0.5rem 0', fontWeight: '800' }}>
          <i className="fa-solid fa-network-wired" style={{ marginRight: '10px' }}></i>
          IP Guide Finder
        </h1>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.05rem' }}>
          Proyecto Universitario • Panel de Geolocalización de Red
        </p>
      </header>

      {/* Buscador */}
      <form onSubmit={handleSearch} className="search-box">
        <input 
          type="text" 
          placeholder="Buscar dirección IP (Ej: 8.8.8.8)" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">
          <i className="fa-solid fa-magnifying-glass" style={{ marginRight: '8px' }}></i>
          Buscar
        </button>
      </form>

      {isCustomSearch && (
        <button 
          onClick={handleReset} 
          style={{ background: '#334155', marginTop: '1rem', width: '100%', boxShadow: 'none' }}
        >
          <i className="fa-solid fa-arrow-rotate-left" style={{ marginRight: '8px' }}></i>
          Volver a mi IP actual
        </button>
      )}

      {/* Cargando */}
      {loading && (
        <p style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-muted)' }}>
          <i className="fa-solid fa-circle-notch fa-spin" style={{ marginRight: '10px', color: 'var(--accent-blue)' }}></i>
          Consultando base de datos global...
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="error-message">
          <i className="fa-solid fa-triangle-exclamation"></i>
          <span><strong>Error:</strong> {error}</span>
        </div>
      )}

      {/* Tarjeta de Resultados */}
      {!loading && ipData && (
        <div className="card">
          <h2 style={{ marginTop: 0, fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isCustomSearch ? (
              <i className="fa-solid fa-globe icon-blue"></i>
            ) : (
              <i className="fa-solid fa-location-dot icon-cyan"></i>
            )}
            {isCustomSearch ? 'Resultado de la Búsqueda' : 'Tu Conexión Actual'}
          </h2>
          <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1rem 0' }} />
          
          <div className="info-item">
            <i className="fa-solid fa-ethernet icon-blue"></i>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block' }}>DIRECCIÓN IP</span>
              <strong>{ipData.ip}</strong>
            </div>
          </div>
          
          {ipData.location && (
            <>
              <div className="info-item">
                <i className="fa-solid fa-flag icon-cyan"></i>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block' }}>PAÍS</span>
                  <strong>{ipData.location.country} ({ipData.location.country_iso || 'N/A'})</strong>
                </div>
              </div>

              <div className="info-item">
                <i className="fa-solid fa-city icon-blue"></i>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block' }}>CIUDAD</span>
                  <strong>{ipData.location.city || 'No detectada por el proveedor'}</strong>
                </div>
              </div>

              <div className="info-item">
                <i className="fa-solid fa-clock icon-cyan"></i>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block' }}>ZONA HORARIA</span>
                  <strong>{ipData.location.timezone}</strong>
                </div>
              </div>

              <div className="info-item">
                <i className="fa-solid fa-map-location-dot icon-blue"></i>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block' }}>COORDENADAS</span>
                  <strong>Lat: {ipData.location.latitude} | Lon: {ipData.location.longitude}</strong>
                </div>
              </div>
            </>
          )}

          <div className="info-item">
            <i className="fa-solid fa-server icon-cyan"></i>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block' }}>PROVEEDOR DE INTERNET (ISP)</span>
              <strong>
                {ipData.autonomous_system?.organization || 'Red Privada / Proveedor Local No Registrado'}
                {ipData.autonomous_system?.asn && ` (ASN: AS${ipData.autonomous_system.asn})`}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;