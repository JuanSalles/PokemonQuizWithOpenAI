import { Injectable } from '@nestjs/common';
import * as OpenAI from 'openai';

@Injectable()
export class AppService {
  private openai: OpenAI.OpenAI;

  constructor() {
    this.openai = new OpenAI.OpenAI({
      apiKey: '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',
    });
  }

  async generateText(prompt: string): Promise<JSON> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
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
      const jsonObject = JSON.parse(jsonMatch[0]);
      // console.log(jsonObject);
      return jsonObject.questoes;
    } else {
      throw new Error('Resposta inválida da API do OpenAI');
    }
  }
}
