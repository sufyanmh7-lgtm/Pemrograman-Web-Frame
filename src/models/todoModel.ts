import db from '../config/db';
import type { TodoRow } from '../types/todo';

export class TodoModel {
  static async getByUserId(userId: number, limit: number, offset: number): Promise<TodoRow[]> {
    const [rows] = await db.query(
      'SELECT id, task, is_completed FROM todos WHERE user_id = ? LIMIT ? OFFSET ?',
      [userId, limit, offset]
    );
    return rows as TodoRow[];
  }

  static async countByUserId(userId: number): Promise<number> {
    const [rows] = await db.query(
      'SELECT COUNT(*) as total FROM todos WHERE user_id = ?',
      [userId]
    );
    const result = rows as { total: number }[];
    return result[0]?.total || 0;
  }

  static async getById(id: number, userId: number): Promise<TodoRow | null> {
    const [rows] = await db.query(
      'SELECT id, task, is_completed FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    const result = rows as TodoRow[];
    return result[0] || null;
  }

  static async create(userId: number, task: string): Promise<number> {
    const [result] = await db.query(
      'INSERT INTO todos (user_id, task, is_completed) VALUES (?, ?, 0)',
      [userId, task]
    );
    return (result as { insertId: number }).insertId;
  }

  static async update(id: number, userId: number, task: string, isCompleted: boolean): Promise<boolean> {
    const [result] = await db.query(
      'UPDATE todos SET task = ?, is_completed = ? WHERE id = ? AND user_id = ?',
      [task, isCompleted ? 1 : 0, id, userId]
    );
    return (result as { affectedRows: number }).affectedRows > 0;
  }

  static async delete(id: number, userId: number): Promise<boolean> {
    const [result] = await db.query(
      'DELETE FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return (result as { affectedRows: number }).affectedRows > 0;
  }
}