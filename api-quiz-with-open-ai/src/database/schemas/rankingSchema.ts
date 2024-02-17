import { Schema } from 'mongoose';

export const RankingSchema = new Schema({
  nickname: String,
  score: Number,
  date: Date,
});
