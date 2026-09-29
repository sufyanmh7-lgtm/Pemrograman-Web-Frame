import type { Request, Response } from 'express';
import { TodoModel } from '../models/todoModel';
import type { CreateTodoRequest, UpdateTodoRequest, TodoResponse } from '../types/todo';
import { sendSuccess, sendSuccessPagination, sendError } from '../utils/response';

export const getTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    
    // Gunakan String() untuk menghindari error ts(2345)
    const page = parseInt(String(req.query.page || '1'), 10);
    const perPage = parseInt(String(req.query.perPage || '5'), 10);
    const offset = (page - 1) * perPage;

    const total = await TodoModel.countByUserId(userId);
    const todosRaw = await TodoModel.getByUserId(userId, perPage, offset);

    const data: TodoResponse[] = todosRaw.map((todo) => ({
      id: todo.id,
      todo: todo.task,
      completed: Boolean(todo.is_completed),
    }));

    const totalPages = Math.ceil(total / perPage);

    sendSuccessPagination(
      res,
      'Berhasil mengambil daftar todo',
      data,
      { page, perPage, total, totalPages }
    );
  } catch (error) {
    sendError(res, 'Gagal mengambil data todo', 500);
  }
};

export const getTodoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const id = parseInt(String(req.params.id), 10);

    const todo = await TodoModel.getById(id, userId);
    if (!todo) {
      sendError(res, 'Data todo tidak ditemukan', 404);
      return;
    }

    const data: TodoResponse = {
      id: todo.id,
      todo: todo.task,
      completed: Boolean(todo.is_completed),
    };

    sendSuccess(res, 'Berhasil mengambil detail todo', data);
  } catch (error) {
    sendError(res, 'Gagal mengambil detail todo', 500);
  }
};

export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { task }: CreateTodoRequest = req.body;

    const insertId = await TodoModel.create(userId, task);
    const newTodo = await TodoModel.getById(insertId, userId);

    if (!newTodo) {
      sendError(res, 'Gagal membuat todo', 500);
      return;
    }

    const data: TodoResponse = {
      id: newTodo.id,
      todo: newTodo.task,
      completed: Boolean(newTodo.is_completed),
    };

    sendSuccess(res, 'Berhasil menambahkan todo', data, 201);
  } catch (error) {
    sendError(res, 'Gagal menambahkan todo', 500);
  }
};

export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const id = parseInt(String(req.params.id), 10);
    const { task, is_completed }: UpdateTodoRequest = req.body;

    const isUpdated = await TodoModel.update(id, userId, task, is_completed);
    if (!isUpdated) {
      sendError(res, 'Todo tidak ditemukan atau tidak diperbarui', 404);
      return;
    }

    const updatedTodo = await TodoModel.getById(id, userId);
    if (!updatedTodo) {
      sendError(res, 'Gagal mengambil data todo yang diperbarui', 500);
      return;
    }

    const data: TodoResponse = {
      id: updatedTodo.id,
      todo: updatedTodo.task,
      completed: Boolean(updatedTodo.is_completed),
    };

    sendSuccess(res, 'Berhasil memperbarui todo', data);
  } catch (error) {
    sendError(res, 'Gagal memperbarui todo', 500);
  }
};

export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const id = parseInt(String(req.params.id), 10);

    const isDeleted = await TodoModel.delete(id, userId);
    if (!isDeleted) {
      sendError(res, 'Todo tidak ditemukan', 404);
      return;
    }

    sendSuccess(res, 'Berhasil menghapus todo', null);
  } catch (error) {
    sendError(res, 'Gagal menghapus todo', 500);
  }
};