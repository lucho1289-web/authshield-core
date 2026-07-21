import { registerUser, loginUser } from '../services/user.service'; // 1. Importación modificada
import { Request, Response } from 'express';

export const register = async (req: Request, res: Response) => {
  const { email, user_name, password_raw } = req.body;
  try {
    await registerUser(email, user_name, password_raw);
    return res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error: any) {
    console.error('Error en user.controller:', error);
    return res.status(500).json({ error: 'Hubo un problema al procesar el registro' });
  }
};

// 2. Nuevo controlador para el Inicio de Sesión
export const login = async (req: Request, res: Response) => {
  const { email, password_raw } = req.body;

  try {
    // Delegamos la validación pesada al Service
    const result = await loginUser(email, password_raw);

    // Éxito: Respondemos con 200 OK y le entregamos el token al cliente
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error en user.controller -> login:', error);

    // Bifurcación de errores: Evaluamos la causa del fallo
    if (error.message === 'Credenciales inválidas') {
      return res.status(401).json({ error: error.message });
    }

    // Error de infraestructura (Base de datos caída, error de código, etc.)
    return res.status(500).json({ error: 'Hubo un problema al procesar el ingreso' });
  }
};