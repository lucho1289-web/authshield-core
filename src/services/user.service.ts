import { createUser } from '../repositories/user.repository';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {getRoleIdByName} from '../repositories/role.repository';

export const registerUser = async (email: string, user_name: string, password_raw: string) => {
  try {
    // 1. Generamos los datos que no nos dio el usuario
    const password_hash = await bcrypt.hash(password_raw, 10);
    const public_id = uuidv4();
    const updated_at = new Date(); // La fecha y hora actual para la base de datos
    
    
    const role_id = await getRoleIdByName('client');

    // 2. Ahora que tenemos TODO, llamamos al Repository para guardar en la base de datos
    await createUser(public_id, user_name, email, password_hash, role_id, updated_at);

  } catch (error) {
    // 3. Si el repositorio falla (ej: email duplicado), el error salta ACÁ
    console.error('Error en el servicio de registro:', error);
    throw error;
  }
};