import type { Request, Response, NextFunction } from 'express';
import type { RegisterRequest, LoginRequest } from '../types/auth';
import type { CreateTodoRequest, UpdateTodoRequest } from '../types/todo';
import { sendError } from '../utils/response';

export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
  const payload: RegisterRequest = req.body;

  if (!payload.username || !payload.email || !payload.password) {
    sendError(res, 'Username, email, dan password wajib diisi!', 400);
    return;
  }

  if (!payload.email.includes('@')) {
    sendError(res, 'Format email tidak valid!', 400);
    return;
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const payload: LoginRequest = req.body;

  if (!payload.username || !payload.password) {
    sendError(res, 'Username dan password wajib diisi!', 400);
    return;
  }

  next();
};

export const validateTodo = (req: Request, res: Response, next: NextFunction): void => {
  const payload: CreateTodoRequest = req.body;

  if (!payload.task || typeof payload.task !== 'string') {
    sendError(res, 'Task wajib diisi dengan format string!', 400);
    return;
  }

  next();
};

export const validateUpdateTodo = (req: Request, res: Response, next: NextFunction): void => {
  const payload: UpdateTodoRequest = req.body;

  if (!payload.task || typeof payload.task !== 'string') {
    sendError(res, 'Task wajib diisi dengan format string!', 400);
    return;
  }

  if (typeof payload.is_completed !== 'boolean') {
    sendError(res, 'Status is_completed wajib diisi dengan tipe boolean!', 400);
    return;
  }

  next();
};