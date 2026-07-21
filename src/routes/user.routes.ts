import { Router } from 'express';
import { register, login } from '../controllers/user.controller'; // Importamos la nueva función

const router = Router();

router.post('/register', register);
router.post('/login', login); // Conectamos la URL con el controlador mediante POST

export default router;