// src/routes/studentsRoutes.js - опис роутів

import { Router } from 'express';
// Використовуємо створені схеми валідації
import { celebrate } from 'celebrate';
import {
  noteIdSchema,
  getAllNotesSchema,
  createNoteSchema,
  updateNoteSchema
} from '../validations/notesValidation.js';
import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote
} from '../controllers/notesController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

// Додаємо middleware до всіх шляхів, що починаються з /notes
router.use("/notes", authenticate);

// Роут GET /notes
router.get('/notes', celebrate(getAllNotesSchema), getAllNotes);

// Роут GET /notes/:noteId
router.get('/notes/:noteId', celebrate(noteIdSchema), getNoteById);

// Роут POST /notes - для створення нової нотатки
router.post('/notes', celebrate(createNoteSchema), createNote);

// Роут DELETE /notes/:noteId
router.delete('/notes/:noteId', celebrate(noteIdSchema), deleteNote);

// Роут PATCH /notes/:noteId
router.patch('/notes/:noteId', celebrate(updateNoteSchema), updateNote);

export default router;
