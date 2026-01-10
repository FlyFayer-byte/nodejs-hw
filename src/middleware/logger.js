// src/middleware/logger.js - логування HTTP-запитів за допомогою pino-http
// Щоб бачити всі запити, підключимо pino-http у logger.js

import pino from 'pino-http';

export const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
      messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
      hideObject: true,
    },
  },
});

// Логер дозволяє відстежувати всі запити до сервера:
// метод (GET, POST), шлях, статус відповіді, час виконання.

// Ми використовуємо pino - pretty, щоб логи в консолі були кольоровими
// та зручними для читання.

// Логер треба підключати одним із перших middleware,
// щоб він бачив усі запити та помилки.
