// src/services/ipService.js
import axios from 'axios';

// Creamos una instancia de Axios con la URL base de la API externa
const apiClient = axios.create({
  baseURL: 'https://ip.guide',
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Obtiene los detalles de una dirección IP.
 * @param {string} ip - (Opcional) La IP a consultar. Si está vacía, la API detecta la IP del cliente.
 * @returns {Promise<Object>} Datos de geolocalización y red.
 */
export const getIpDetails = async (ip = '') => {
  try {
    // Si pasamos un parámetro 'ip', la URL será /8.8.8.8, si no, será / (IP propia)
    const response = await apiClient.get(`/${ip}`);
    return response.data;
  } catch (error) {
    console.error("Error en getIpDetails:", error.message);
    // Relanzamos un mensaje de error limpio para que el componente lo capture
    throw new Error(error.response?.data?.error || 'No se pudo obtener la información de la IP');
  }
};