import { pool } from '../config/database';

export const createUser = async (
  public_id: string,
  user_name: string,
  email: string,
  password_hash: string,
  role_id: number,
  updated_at: Date
) => {
  const text = `
    INSERT INTO users (public_id, user_name, email, password_hash, role_id, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6);
  `;

  const values = [public_id, user_name, email, password_hash, role_id, updated_at];

  try {
    await pool.query(text, values);
  } catch (error) {
    console.error('Error en el repositorio al crear usuario:', error);
    throw error;
  }
}; // <-- Esta es la llave que faltaba para cerrar createUser

export const getUserByEmail = async (email: string) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];

  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};