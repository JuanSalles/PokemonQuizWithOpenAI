import { Schema, Types } from 'mongoose';

export const SessionSchema = new Schema({
  nickname: String,
  tempScore: Number,
  date: Date,
  isFished: Boolean,
  answers: [Number],
  questions: [{ type: Types.ObjectId, ref: 'Questions' }],
});
