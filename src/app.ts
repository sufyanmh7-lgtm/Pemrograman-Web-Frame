import express from 'express';
import cors from 'cors';
import crypto from 'crypto';

const app = express();

// Konfigurasi CORS dengan exposedHeaders agar X-Request-Id dapat dibaca client
app.use(
  cors({
    exposedHeaders: ['X-Request-Id'],
  })
);

app.use(express.json());

// Middleware 1: Menambahkan header X-Request-Id ke request dan response
app.use((req, res, next) => {
  const requestId = crypto.randomUUID();
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
});

// Middleware 2: Menampilkan console log sesuai X-Request-Id
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'];
  console.log(`[${requestId}] ${req.method} ${req.url}`);
  next();
});

export default app;