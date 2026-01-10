// src/middleware/errorHandler.js - middleware для обробки помилок

import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  console.error('Error Middleware:', err);

  // Якщо помилка створена через http-errors
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message || err.name,
    });
  }

  const isProd = process.env.NODE_ENV === "production";

  // Усі інші помилки — як внутрішні
  res.status(500).json({
    message: isProd
      ? "Something went wrong. Please try again later."
      : err.message,
  });
};

// Це middleware має 4 аргументи (err, req, res, next) —
// саме за цим Express розуміє, що воно призначене для помилок.

//Використовується завжди останнім, щоб перехопити всі помилки
// з попередніх обробників.

// Ми виводимо помилку в консоль і повертаємо клієнту відповідь
// зі статусом 500 Internal Server Error.
