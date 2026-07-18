import {pool} from '../config/database';
export const createUser=async(
   public_id: string,
  user_name: string,
  email: string,
  password_hash: string,
  role_id: number,
  updated_at: Date

)=>{
// 1. El molde de la consulta con los marcadores de posición
  const text = `
    INSERT INTO users (public_id, user_name, email, password_hash, role_id, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6);
  `;

  // 2. Tu array ordenado de datos (el que armaste recién)
  const values = [public_id, user_name, email, password_hash, role_id, updated_at];

  try {
    // Intentamos ejecutar la consulta
    await pool.query(text, values);
  } catch (error) {
    // Si la base de datos lanza un error (como email duplicado), cae ACÁ adentro
    console.error('Error en el repositorio al crear usuario:', error);
    
    // Volvemos a lanzar el error hacia la capa de arriba (el Service) para que decida qué responder
    throw error;
  }
};