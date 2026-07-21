import { createUser,getUserByEmail} from '../repositories/user.repository';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {getRoleIdByName} from '../repositories/role.repository';

export const registerUser = async (email: string, user_name: string, password_raw: string) => {
  try {
    // 1. Generamos los datos que no nos dio el usuario
    const password_hash = await bcrypt.hash(password_raw, 10);
    const public_id = uuidv4();
    const updated_at = new Date(); // La fecha y hora actual para la base de datos
    
    
    const role_id = await getRoleIdByName('user');

    // 2. Ahora que tenemos TODO, llamamos al Repository para guardar en la base de datos
    await createUser(public_id, user_name, email, password_hash, role_id, updated_at);

  } catch (error) {
    // 3. Si el repositorio falla (ej: email duplicado), el error salta ACÁ
    console.error('Error en el servicio de registro:', error);
    throw error;
  }
 
};
// 2. FUNCIÓN DE HOY: Inicio de sesión
export const loginUser = async (email: string, password_raw: string) => {
  // Bloque A: Buscar si el usuario existe por su email
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  // Bloque B: Comparar la contraseña ingresada con el hash de la base de datos
  const isPasswordValid = await bcrypt.compare(password_raw, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas');
  }

  // Bloque C: Generar el Token JWT firmado si todo coincide
  const secretKey = process.env.JWT_SECRET || 'clave_secreta_de_emergencia';
  
  const token = jwt.sign(
    { 
      public_id: user.public_id, 
      user_name: user.user_name,
      role_id: user.role_id 
    }, 
    secretKey, 
    { expiresIn: '2h' } // El token expira automáticamente en 2 horas
  );

  // Bloque D: Devolver el token y la información limpia del usuario al Controller
  return {
    token,
    user: {
      public_id: user.public_id,
      user_name: user.user_name,
      email: user.email
    }
  };
};
