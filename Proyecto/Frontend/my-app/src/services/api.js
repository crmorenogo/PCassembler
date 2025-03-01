import axios from 'axios';

const API_URL = 'http://localhost:3001/api';


export const getTestMessage = async () => {
  try {
    const response = await axios.get(`${API_URL}/test`);
    return response.data;
  } catch (error) {
    console.error('Error al conectar con el backend:', error);
    throw error;
  }
};
