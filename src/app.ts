import express from 'express';
import userRoutes from './routes/user.routes';

const app = express();

// Middleware obligatorio para que Express entienda el JSON que le manda el frontend
app.use(express.json());

// Enganchamos tus rutas de usuario bajo el prefijo '/api/users'
app.use('/api/users', userRoutes);

// Definimos el puerto y prendemos el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo con éxito en http://localhost:${PORT}`);
});