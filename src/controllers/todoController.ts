import { Request, Response } from 'express';
import { TodoModel } from '../models/todoModel.js';

export const getTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.userId;
    const todos = await TodoModel.getByUserId(userId);
    res.status(200).json({ success: true, data: todos });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data todo.' });
  }
};

export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.userId;
    const { task } = req.body;
    const todoId = await TodoModel.create(userId, task);
    res.status(201).json({
      success: true,
      message: 'Berhasil menambahkan todo!',
      data: { id: todoId, user_id: userId, task }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menambahkan todo.' });
  }
};