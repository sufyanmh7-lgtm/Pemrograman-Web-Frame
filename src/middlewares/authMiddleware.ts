import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, message: 'Akses ditolak. Token tidak ditemukan!' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    
    // Memastikan ID tersimpan dari berbagai kemungkinan nama properti token
    const userId = decoded.id || decoded.userId || decoded.user_id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User ID tidak ditemukan dari token!' });
      return;
    }

    res.locals.userId = userId;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: 'Sesi tidak valid atau kedaluwarsa!' });
  }
};