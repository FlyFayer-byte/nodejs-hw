// src/controllers/studentsController.js

import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

// Опис контролера getAllNotes - отримати список усіх нотаток + пагінація
export const getAllNotes = async (req, res) => {
  // Отримуємо параметри запиту
  const { page = 1, perPage = 10, tag, search } = req.query;

  const skip = (page - 1) * perPage;

  // Створюємо базовий запит до колекції
  const notesQuery = Note.find({userId: req.user._id});

  // Будуємо фільтр
  if (tag) {
    notesQuery.where("tag").equals(tag);
  };

  // Текстовий пошук (працює лише якщо створено текстовий індекс)
  if (search) {
    notesQuery.where({ $text: { $search: search } });
  };

  // Виконуємо одразу два запити паралельно
  const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);

  // Обчислюємо загальну кількість «сторінок»
  const totalPages = Math.ceil(totalNotes / perPage);

  // const notes = await Note.find();
  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes
  });
};

// Опис контролера getNoteById - отримати одну нотатку за id або помилку 404
export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOne({ _id: noteId, userId: req.user._id });

  if (!note) {
    // замість «звичайної» помилки, явно вказуємо код 404 і повідомлення
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.status(200).json(note);
};

// Опис контролера createNote - для створення нової нотатки
// Додаємо можливість створювати нову нотатку до колекції за маршрутом POST /notes.
// У запиті будемо очікувати тіло запиту, яке приходитиме як JSON.
export const createNote = async (req, res) => {
  const note = await Note.create({ ...req.body, userId: req.user._id });
  res.status(201).json(note);
};

// Перший аргумент для Note.create() обов’язковий і має містити об'єкт даних,
// які будуть використані для створення нового документа у колекції.
// База даних створює новий документ, додає до нього унікальний ідентифікатор
// та повертає створений об’єкт.

// Опис контролера deleteNote - для видалення існуючої нотатки за її ідентифікатором
export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({ _id: noteId, userId: req.user._id });

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(note);
};

// Опис контролера updateNote - для оновлення існуючої нотатки за її ідентифікатором
export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId: req.user._id }, // Шукаємо по id
    req.body,
    { new: true }, // повертаємо оновлений документ
  );

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.status(200).json(note);
};
