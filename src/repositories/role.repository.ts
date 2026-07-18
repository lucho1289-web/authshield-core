import {pool} from '../config/database';

export const getRoleIdByName=async(role_name:string)=>{
 const text = `SELECT intern_id FROM roles WHERE role_name = $1`;
 const values=[role_name]; 
 try {
    // Mandamos a ejecutar pasándole el molde y los valores
    const result = await pool.query(text, values);
    return result.rows[0].intern_id;

    // (Acá abajo vamos a procesar la respuesta, pero primero armemos el bloque)

  } catch (error) {
    console.error('Error en role.repository al buscar rol:', error);
    throw error;
  }
};
