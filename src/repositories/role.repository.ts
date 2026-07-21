import { pool } from '../config/database'; // Ajustá la ruta a tu conexión

export const getRoleIdByName = async (roleName: string) => {
  // .toLowerCase() para evitar problemas con 'User', 'USER', etc.
  const formattedRoleName = roleName.toLowerCase();

  const result = await pool.query(
    'SELECT intern_id FROM roles WHERE name = $1',
    [formattedRoleName]
  );

  // Si no encuentra el rol, lanzamos un error claro antes de leer intern_id
  if (result.rows.length === 0) {
    throw new Error(`El rol '${roleName}' no existe en la tabla roles.`);
  }

  return result.rows[0].intern_id;
};