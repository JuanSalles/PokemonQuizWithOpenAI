import { Schema } from 'mongoose';

export const QuestionSchema = new Schema({
  language: String,
  difficulty: Number,
  question: String,
  options: [String],
  correct: Number,
});
