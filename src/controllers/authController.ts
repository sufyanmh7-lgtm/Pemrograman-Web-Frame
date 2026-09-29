import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel';
import type { RegisterRequest, LoginRequest } from '../types/auth';
import { sendSuccess, sendError } from '../utils/response';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password }: RegisterRequest = req.body;

    const existingUser = await UserModel.findByUsername(username);
    if (existingUser) {
      sendError(res, 'Username sudah digunakan!', 400);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.create(username, email, hashedPassword);

    sendSuccess(res, 'Registrasi berhasil!', null, 201);
  } catch (error) {
    sendError(res, 'Gagal melakukan registrasi', 500);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password }: LoginRequest = req.body;

    const user = await UserModel.findByUsername(username);
    if (!user) {
      sendError(res, 'Username atau password salah!', 401);
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      sendError(res, 'Username atau password salah!', 401);
      return;
    }

    const payload = { id: user.id, username: user.username, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1d' });

    sendSuccess(res, 'Login berhasil!', { token });
  } catch (error) {
    sendError(res, 'Gagal melakukan login', 500);
  }
};