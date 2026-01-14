// src/models/user.js
import { model, Schema } from "mongoose";
import bcrypt from 'bcrypt';

// Створюємо модель User
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
  },
  // Для автоматичного створення полів createdAt та updatedAt,
  // використовуємо параметр timestamps: true при створенні моделі
  { timestamps: true, versionKey: false }
);

// Створємо хук pre('save'), щоб за замовчуванням встановлювати username
// таким самим, як email, при створенні користувача.
userSchema.pre('save', async function () {
  if (!this.username) {
    this.username = this.email;
  }
});
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});
// Додаємо до схеми userSchema метод toJSON, щоб видаляти пароль
// із об'єкта користувача перед відправкою у відповідь
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);

// Тепер, коли ми відправляємо користувача через res.json(),
// поле password автоматично видаляється.
