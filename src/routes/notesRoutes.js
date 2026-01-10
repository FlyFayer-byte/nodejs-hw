// src/routes/studentsRoutes.js - опис роутів

import { Router } from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote
} from '../controllers/notesController.js';

const router = Router();
// Роут GET /notes
router.get('/notes', getAllNotes);
// Роут GET /notes/:noteId
router.get('/notes/:noteId', getNoteById);
// Роут POST /notes
router.post('/notes', createNote);
// Роут DELETE /notes/:noteId
router.delete('/notes/:noteId', deleteNote);
// Роут PATCH /notes/:noteId
router.patch('/notes/:noteId', updateNote);

export default router;
