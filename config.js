const BASE_IP = import.meta.env.VITE_BASE_IP || 'localhost';
const BASE_URL = import.meta.env.VITE_API_URL || `http://${BASE_IP}:5000`;

export { BASE_IP, BASE_URL };