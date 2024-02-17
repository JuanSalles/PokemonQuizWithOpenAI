import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import * as OpenAI from 'openai';
import { QuestionDTO } from './DTOs/questionDTO';

@Injectable()
export class AppService {
  private openai: OpenAI.OpenAI;

  constructor(
    private configService: ConfigService,
    @InjectModel('Questions') private questionModel: Model<any>,
    @InjectModel('Ranking') private rankingModel: Model<any>,
    @InjectModel('Sessions') private sessionModel: Model<any>,
  ) {
    this.openai = new OpenAI.OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }
  async isThereSession(nickname: string): Promise<any> {
    const session = await this.sessionModel
      .findOne({
        nickname: nickname,
        isFished: false,
      })
      .populate('questions')
      .exec();

    if (session) return session;
    return null;
  }

  async startQuiz(nickname: string, about: string): Promise<QuestionDTO> {
    const session = await this.isThereSession(nickname);

    if (session) {
      if (session.questions.length < 10) {
        console.log('Faltam questões na sessão, sessão finalizada');
        session.isFished = true;
        await session.save();
        return this.startQuiz(nickname, about);
      }
      console.log('Questões encontradas na sessão:', session.questions);
      return this.mapToDTO(session.questions[session.answers.length]);
    }

    const newSession = new this.sessionModel({
      nickname,
      tempScore: 0,
      date: new Date(),
      isFished: false,
      answers: [],
      questions: [],
    });

    try {
      newSession.questions = await this.getQuestions(about);
      await newSession.save();
      const currentSession = await this.isThereSession(nickname);
      return this.mapToDTO(currentSession.questions[0]);
    } catch (e) {
      console.error(e);
      throw new Error('Erro ao buscar questões');
    }
  }
  async getQuestionsFromOPENAI(prompt: string) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are required to provide a JSON object containing 10 programming-related questions. These questions should be in Portuguese. Each question should have five answer options and one correct answer. The difficulty of each question should increase, ranging from 1 to 10. The answer options and the correct answer should also be in Portuguese. The correct answer should be represented by the number of the correct option.
          
          The JSON should follow this model: {
            "questions": [
              {
                "language": "Programming language of the question",
                "difficulty": number,
                "question": "Example of a question",
                "options": ["A) option", "B) option", "C) option", "D) option", "E) option"],
                "correct": number
              }
            ]
          }`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    if (
      response &&
      response.choices &&
      response.choices[0] &&
      response.choices[0].message &&
      response.choices[0].message.content
    ) {
      const text = response.choices[0].message.content;
      const regex = /\{[^]*\}/;
      const jsonMatch = text.match(regex);
      // console.log(jsonMatch[0]);
      console.log('JSON:', jsonMatch[0]);
      const jsonObject = JSON.parse(jsonMatch[0]);
      // console.log(jsonObject);
      await this.saveQuestions(jsonObject);
    } else {
      throw new Error('Resposta inválida da API do OpenAI');
    }
  }

  async getQuestions(language: string): Promise<Array<any>> {
    try {
      return await this.getQuestionsFromOPENAI(language)
        .then(() => {
          console.log('Questões do OPENAI salvas com sucesso');
          return this.tryFunction(() => this.getRandomQuestionsInDB(language));
        })
        .catch((e) => {
          console.error(e);
          throw new Error('Erro ao buscar questões');
        });
    } catch (e) {
      console.error(e);
      throw new Error('Erro ao buscar questões');
    }
  }
  async getRandomQuestionsInDB(language: string): Promise<Array<any>> {
    const promises = Array.from({ length: 10 }, async (_, i) => {
      const question = await this.questionModel
        .aggregate([
          { $match: { difficulty: i + 1, language: language } },
          { $sample: { size: 1 } },
        ])
        .exec();

      if (question.length > 0) {
        return question[0];
      } else {
        throw new Error(
          `No question found for difficulty ${i + 1} and language ${language}`,
        );
      }
    });

    const questions = await Promise.all(promises);
    console.log('Questões encontradas no banco de dados:', questions);

    return questions;
  }
  async saveQuestions(jsonObject: JSON): Promise<void> {
    jsonObject['questions'].forEach(async (question: any) => {
      const model = new this.questionModel(question);
      await model.save();
    });
  }
  async saveAnswer(
    answer: number,
    id: string,
    nickname: string,
  ): Promise<string> {
    const session = await this.isThereSession(nickname);

    if (!session) throw new Error('Sessão não encontrada');

    const isCorrect =
      session.questions[session.answers.length].correct == answer;

    if (isCorrect) {
      session.tempScore += 10;
    }
    session.answers.push(answer);

    if (session.answers.length === 10) {
      session.isFished = true;
      await this.saveRanking(nickname, session.tempScore);
    }
    await session.save();
    return session.tempScore.toString();
  }

  async getRanking(): Promise<any> {
    const ranking = await this.rankingModel
      .find()
      .sort({ score: -1 })
      .limit(10);
    return ranking;
  }

  async saveRanking(nickname: string, score: number): Promise<void> {
    const model = new this.rankingModel({
      nickname,
      score,
      date: new Date(),
    });
    await model.save();
  }

  mapToDTO(question: any): QuestionDTO {
    const questionDTO = new QuestionDTO();
    questionDTO.question = question.question;
    questionDTO.options = question.options;
    return questionDTO;
  }

  async tryFunction(func: () => any, retries = 2) {
    for (let i = 0; i < retries; i++) {
      try {
        return await func();
      } catch (error) {
        console.error(error);
        console.error(`Attempt ${i + 1} failed. Retrying after 5 seconds...`);
        if (i < retries - 1) {
          // Se ainda houver tentativas restantes, espere 5 segundos antes da próxima
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }
    }
    throw new Error('All attempts failed');
  }
}
