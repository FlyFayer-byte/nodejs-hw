// src/server/js
// В цьому файлі знаходиться логіка роботи нашого express-серверу

import 'dotenv/config'; // ініціалізуємо бібліотек для зчитування .env
import express from 'express';
import cors from 'cors';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import  router  from './routes/notesRoutes.js';

const app = express();

// Використовуємо значення з .env або дефолтний порт 3000
const PORT = process.env.PORT ?? 3000;

// Підключення middleware:
app.use(logger);         // 1. Логер першим — бачить усі запити
app.use(express.json()); // 2. Парсинг JSON-тіла
app.use(cors());         // 3. Дозвіл для запитів з інших доменів

// Логування часу
app.use((req, res, next) => {
  console.log(`Time: ${new Date().toLocaleString()}`);
  next();
});

// Реєстрацію загального роута нотаток (підключаємо групу маршрутів)
app.use(router);

// Middleware 404 (після всіх маршрутів)
app.use(notFoundHandler);

// Error — якщо під час запиту виникла помилка
app.use(errorHandler);

// Встановлення з’єднання з базою даних перед запуском сервера
await connectMongoDB();

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});


// Чому порядок важливий?

// 1. Logger першим → логуються всі вхідні запити.
// 2. JSON і CORS далі → кожен запит обробляється перед передачею в маршрути.
// 3. Маршрути → відповідають на конкретні запити.
// 4. 404 handler → якщо маршрут не знайдено.
// 5. Error handler → якщо трапилась помилка на будь-якому етапі.
