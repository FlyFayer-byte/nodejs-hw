// src/middleware/notFoundHandler.js - обробка всіх запитів на неіснуючі
// маршрути (повертає статус 404 та наступний об’єкт:
/*
{
  message: 'Route not found',
}
*/

export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: 'Route not found' });
  console.log('Error 404 - Route not found');
};

// Це middleware підключається після всіх маршрутів.
// Якщо жоден маршрут не збігся, керування потрапить сюди.
// Ми відправляємо клієнту відповідь зі статусом 404 Not Found.
