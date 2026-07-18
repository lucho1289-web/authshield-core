import {registerUser} from '../services/user.service';

import {Request,Response} from 'express';

export const register=async(req:Request,res:Response)=>{
 const { email, user_name, password_raw } = req.body;
 try{
  await registerUser(email, user_name, password_raw);
  return res.status(201).json({ message: 'Usuario registrado con éxito' });
 }
 catch(error:any){
  console.error('Error en user.controller:', error);
  return res.status(500).json({ error: 'Hubo un problema al procesar el registro' });
 }
};