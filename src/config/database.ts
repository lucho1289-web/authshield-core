import { Pool } from 'pg';
import 'dotenv/config';
// Instanciamos el pool de conexiones usando las variables del .env
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'), // El puerto debe ser un número entero
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Opcional: Escuchar errores en las conexiones que están en segundo plano
pool.on('error', (err) => {
  console.error('Error inesperado en el cliente de PostgreSQL:', err);
  process.exit(-1);
});