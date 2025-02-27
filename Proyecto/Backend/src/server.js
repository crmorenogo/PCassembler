/* eslint-disable no-undef */

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js'; // Importar rutas de usuarios

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

app.get('/api/test', (req, res) => {
  console.log("API called /api/test");
  res.send('¡Hola desde el backend!');
});

// Add user routes(All routes lead to API before)
app.use('/api', userRoutes);
 
app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});