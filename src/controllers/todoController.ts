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

// Langkah 10b: Tambah getTodoById
export const getTodoById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = res.locals.userId;
  try {
    const todo = await TodoModel.getById(Number(id), userId);
    if (!todo) {
      res.status(404).json({ success: false, message: 'Tugas tidak ditemukan!' });
      return;
    }
    res.status(200).json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data.' });
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

// Langkah 2: Tambah updateTodo
export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { task, is_completed } = req.body;
  const userId = res.locals.userId;
  try {
    const affectedRows = await TodoModel.update(Number(id), task, is_completed, userId);
    if (affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Tugas tidak ditemukan!' });
      return;
    }
    res.status(200).json({ success: true, message: 'Tugas berhasil diperbarui!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui tugas.' });
  }
};

// Langkah 2: Tambah deleteTodo
export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = res.locals.userId;
  try {
    const affectedRows = await TodoModel.delete(Number(id), userId);
    if (affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Tugas tidak ditemukan!' });
      return;
    }
    res.status(200).json({ success: true, message: 'Tugas berhasil dihapus!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus tugas.' });
  }
};