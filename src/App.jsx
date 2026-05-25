// src/App.jsx
import React, { useState, useEffect } from 'react';
import { getIpDetails } from './services/ipService';

function App() {
  // Estados para los datos de la API, carga y errores
  const [ipData, setIpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // NUEVO: Estado para controlar el texto que escribe el usuario en el buscador
  const [searchQuery, setSearchQuery] = useState('');
  // NUEVO: Estado para saber si estamos mostrando la IP propia o una buscada
  const [isCustomSearch, setIsCustomSearch] = useState(false);

  // Función reutilizable para obtener los datos (recibe o no una IP)
  const fetchIpData = async (ipToSearch = '') => {
    try {
      setLoading(true);
      setError(null);
      const data = await getIpDetails(ipToSearch);
      setIpData(data);
    } catch (err) {
      setError(err.message);
      setIpData(null); // Limpiamos datos anteriores si hay error
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial: Detecta la IP del usuario al entrar al sitio
  useEffect(() => {
    fetchIpData(); // Sin parámetros = IP actual
  }, []);

  // NUEVO: Función que maneja el envío del formulario de búsqueda
  const handleSearch = (e) => {
    e.preventDefault(); // Evita que la página se recargue (comportamiento por defecto de HTML)
    
    if (!searchQuery.trim()) {
      setError('Por favor, ingresa una dirección IP válida.');
      return;
    }

    setIsCustomSearch(true);
    fetchIpData(searchQuery.trim());
  };

  // NUEVO: Función para regresar a ver la IP propia del usuario
  const handleReset = () => {
    setSearchQuery('');
    setIsCustomSearch(false);
    fetchIpData(); // Vuelve a consultar la IP del cliente
  };

  return (
    <div>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--accent-color)', margin: 0 }}>IP Guide Finder</h1>
        <p style={{ color: '#94a3b8' }}>Proyecto Universitario - Mentoría MERN</p>
      </header>

      {/* NUEVO: Formulario de Búsqueda */}
      <form onSubmit={handleSearch} className="search-box">
        <input 
          type="text" 
          placeholder="Ej: 8.8.8.8 o 1.1.1.1" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Buscar IP</button>
      </form>

      {/* NUEVO: Botón para volver si es una búsqueda personalizada */}
      {isCustomSearch && (
        <button 
          onClick={handleReset} 
          style={{ backgroundColor: '#475569', color: 'white', marginTop: '1rem', width: '100%' }}
        >
          🔄 Volver a mi IP actual
        </button>
      )}

      {/* Renderizado Condicional: Mientras carga */}
      {loading && <p style={{ textAlign: 'center', marginTop: '2rem' }}>Consultando a la API...</p>}

      {/* Renderizado Condicional: Si hay un error */}
      {error && <div className="error-message">❌ Error: {error}</div>}

      {/* Renderizado Condicional: Resultados Enriquecidos */}
      {!loading && ipData && (
        <div className="card">
          <h2>
            {isCustomSearch ? '🔍 Resultado de la Búsqueda' : '📍 Tu Conexión Actual'}
          </h2>
          <hr style={{ borderColor: '#475569', margin: '1rem 0' }} />
          
          {/* Datos de Red */}
          <p><strong>Dirección IP:</strong> <span style={{ color: 'var(--accent-color)' }}>{ipData.ip}</span></p>
          
          {/* Datos de Ubicación Geográfica */}
          {ipData.location && (
            <>
              {/* Corregido: country_iso para que no salga el paréntesis vacío */}
              <p><strong>País:</strong> {ipData.location.country} ({ipData.location.country_iso || 'N/A'})</p>
              <p><strong>Ciudad / Región:</strong> {ipData.location.city || 'No especificada por el proveedor'}</p>
              <p><strong>Zona Horaria:</strong> ⏰ {ipData.location.timezone}</p>
              
              {/* NUEVO: Coordenadas Geográficas (Latitud y Longitud) */}
              <p><strong>Coordenadas (Lat, Lon):</strong> 🌐 {ipData.location.latitude}, {ipData.location.longitude}</p>
            </>
          )}

          {/* Datos de Organización / ISP con alternativa si viene vacío */}
          <p>
            <strong>Organización / ISP:</strong>{' '}
            {ipData.autonomous_system?.organization 
              ? ipData.autonomous_system.organization 
              : 'Red Privada / Proveedor Local No Registrado'} 
            {ipData.autonomous_system?.asn && ` (ASN: AS${ipData.autonomous_system.asn})`}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;