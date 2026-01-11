import { Schema, model } from "mongoose";

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // прибирає пробіли на початку та в кінці
    },
    content: {
      type: String,
      default: '',
      trim: true,
    },
    tag: {
      type: String,
      enum: ['Work', 'Personal', 'Meeting', 'Shopping', 'Ideas', 'Travel', 'Finance', 'Health', 'Important', 'Todo'],
      default: 'Todo',
    },
  },
  {
    timestamps: true,
  },
);

// Додаємо текстовий індекс до моделі Note

// Оскільки нам потрібно шукати текст по властивостям title та content,
// ми створюємо текстовий індекс по полям title та content.
// Додаємо текстовий індекс: кажемо MongoDB, що по полям title та content
// можна робити $text
noteSchema.index({ title: "text", content: "text" });

// Це забезпечить можливість виконувати $text-пошук у контролерах.

export const Note = model('Note', noteSchema);
