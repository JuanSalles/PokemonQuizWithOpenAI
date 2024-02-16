import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as OpenAI from 'openai';

@Injectable()
export class AppService {
  private openai: OpenAI.OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI.OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generateText(prompt: string): Promise<JSON> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You need to answer with a JSON object with 10 questions about programming. The questions should be in Portuguese. The questions must have five options and a correct answer. The options and the correct answer must be in Portuguese. The correct answer must be a letter from A to E. You must follow this model: {questions:[{question: "Exemple of question", options: ["A) option", "B) option", "C) option", "D) option", "E) option"], correct: "A"}]}',
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
      console.log(jsonMatch[0]);
      const jsonObject = JSON.parse(jsonMatch[0]);
      console.log(jsonObject);
      return jsonObject;
    } else {
      throw new Error('Resposta inválida da API do OpenAI');
    }
  }
}
