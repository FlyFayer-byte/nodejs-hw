// src/server/js
// В цьому файлі знаходиться логіка роботи нашого express-серверу

import 'dotenv/config'; // ініціалізуємо бібліотек для зчитування .env

// Використовуємо значення з .env або дефолтний порт 3000
const PORT = process.env.PORT ?? 3000;


// app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
// });
