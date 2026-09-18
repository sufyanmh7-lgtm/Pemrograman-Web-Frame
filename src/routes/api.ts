import { Router } from 'express';
import { validateRegister, validateLogin, validateTodo } from '../middlewares/validator.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { register, login } from '../controllers/authController.js';
import { getTodos, createTodo } from '../controllers/todoController.js';

const router = Router();

// Route Autentikasi
router.post('/auth/register', validateRegister, register);
router.post('/auth/login', validateLogin, login);

// Route Todos
router.get('/todos', verifyToken, getTodos);
router.post('/todos', verifyToken, validateTodo, createTodo);

export default router;