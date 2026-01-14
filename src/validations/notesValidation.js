import { Joi, Segments } from "celebrate";
import { isValidObjectId } from "mongoose";
import { TAGS } from "../constants/tags.js";

// Схеми валідації:
// Створюємо кастомний валідатор для Joi,
// який перевірятиме значення на валідність ObjectId
const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value)
    ? helpers.message('Invalid id format')
    : value;
};

// Схема для перевірки параметра noteId
export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required().messages({
        'string.base': 'Note id must be a string',
        'any.required': 'Note id is required',
      }),
    }),
};

// 1. Для GET /notes потрібно валідувати параметри рядка запиту Segments.QUERY:

// - page - ціле число, мінімальне значення 1, за замовчуванням 1.
// - perPage - ціле число, мінімальне значення 5, максимальне 20,
//   за замовчуванням 10.
// - tag - рядок, одне із можливих значень із файла src/contacts/tags.js,
//   необов’язкове поле
// - search - рядок, можливо передавати порожній рядок

// Для цього створіть схему валідації getAllNotesSchema
export const getAllNotesSchema = {[Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
        'number.base': 'Page must be a number',
        'number.min': 'Page must be at least 1',
      }),
    perPage: Joi.number().integer().min(5).max(20).default(10).messages({
        'number.base': 'PerPage must be a number',
        'number.min': 'PerPage must be at least 5',
        'number.max': 'PerPage must be at most 20',
      }),
    tag: Joi.string().valid(...TAGS).messages({
        'any.only': 'Invalid tag value',
        'string.base': 'Tag must be a string',
      }),
    search: Joi.string().trim().allow('').messages({
        'string.base': 'Search must be a string',
      }),
  }),
};

// 2. Для маршрутів:
// - GET /notes/:noteId
// - DELETE /notes/:noteId
// потрібно валідувати параметр запиту noteId:

// - noteId - валідуємо як рядок із кастомною валідацію через isValidObjectId
//   із mongoose.

// Для цього використайте схему валідації noteIdSchema

// 3. Для маршруту POST /notes потрібно валідувати тіло запиту як об’єкт
// із наступними властивостями:

// - title - рядок, мінімум 1 символ, обов’язкове поле
// - content - рядок, може бути порожнім рядком, необов’язкове поле
// - tag - одне зі значень із файла src/contacts/tags.js, необов’язкове поле.

// Для цього створіть схему валідації createNoteSchema

export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    // title - рядок, мінімум 1 символ, обов’язкове поле
    title: Joi.string().min(1).required().messages({
        'string.base': 'Title must be a string',
        'string.min': 'Title must contain at least 1 character',
        'any.required': 'Title is required',
      }),
    // content - рядок, може бути порожнім рядком, необов’язкове поле
    content: Joi.string().allow('').messages({
        'string.base': 'Content must be a string',
      }),
    // tag - одне зі значень із файла src/contacts/tags.js, необов’язкове поле
    tag: Joi.string().valid(...TAGS).messages({
        'any.only': 'Invalid tag value',
        'string.base': 'Tag must be a string',
      }),
  }),
};

// 4. Для маршруту PATCH /notes/:noteId потрібно валідувати параметр запиту
// noteId (валідуємо як рядок із кастомною валідацію через isValidObjectId
// із mongoose) та тіло запиту як об’єкт із наступними властивостями:

// - title - рядок, мінімум 1 символ, необов’язкове поле
// - content - рядок, може бути порожнім рядком, необов’язкове поле
// - tag - одне із значень із файла src/contacts/tags.js, необов’язкове поле

// Додайте перевірку, що хоча б одне з полів `title`, `content` або `tag`
// буде присутнім, тобто тіло запиту не має бути порожнім.
// Для цього створіть схему валідації updateNoteSchema

// Зверніть увагу: обидві частини валідації (параметри маршруту та тіло запиту) потрібно реалізувати в одній схемі updateNoteSchema.

export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required().messages({
        'any.required': 'Note id is required',
        'string.base': 'Note id must be a string',
        'any.custom': 'Invalid id format',
      }),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).messages({
        'string.base': 'Title must be a string',
        'string.min': 'Title must contain at least 1 character',
      }),
    content: Joi.string().allow('').messages({
        'string.base': 'Content must be a string',
      }),
    tag: Joi.string().valid(...TAGS) .messages({
        'any.only': 'Invalid tag value',
        'string.base': 'Tag must be a string',
      }),
  }).min(1)
.messages({
      'object.min': 'At least one field (title, content or tag) must be provided',
    }),
};

// Segments — це набір «ключів», які визначають, яку саме частину запиту
// потрібно перевіряти:

// - Segments.BODY → тіло запиту (req.body);
// - Segments.PARAMS → параметри маршруту (req.params);
// - Segments.QUERY → рядок запиту (req.query);
// - Segments.HEADERS → заголовки (req.headers);
// - Segments.COOKIES → кукі (req.cookies).
