// src/db/connectMongoDB.js
import mongoose from 'mongoose';
import { Note } from '../models/note.js';

export const connectMongoDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL; // читаємо рядок підключення (MONGO_URL) зі змінних оточення
    await mongoose.connect(mongoUrl);  // викликаємо mongoose.connect(...) для встановлення з’єднання
    console.log('✅ MongoDB connection established successfully');
    // Гарантуємо, що індекси в БД відповідають схемі
    await Note.syncIndexes();
    console.log("Indexes synced successfully");
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1); // аварійне завершення програми
  }
};
