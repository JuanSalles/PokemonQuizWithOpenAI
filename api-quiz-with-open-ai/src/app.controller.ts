import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  UseGuards,
  Request,
  Response,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { QuestionDTO } from './DTOs/questionDTO';
import { AuthService } from './services/auth/auth.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return "Heelo, I'm the quiz API!";
  }

  @Get('question')
  @UseGuards(AuthGuard('jwt'))
  async generate(
    @Query('language') language: string,
    @Request() req,
  ): Promise<QuestionDTO> {
    const response = await this.appService.startQuiz(
      req.user.nickname,
      language,
    );
    console.log('Question:', response);
    return response;
  }

  @Post('login')
  async login(@Body('nickname') nickname: string, @Response() res) {
    const token = await this.authService.getToken(nickname);
    return res.status(200).json(token);
  }

  @Post('answer')
  @UseGuards(AuthGuard('jwt'))
  async saveAnswer(
    @Body('answer') answer: number,
    @Body('questionId') id: string,
    @Request() req,
  ): Promise<string> {
    const user = req.user;
    return this.appService.saveAnswer(answer, id, user.nickname);
  }

  @Get('ranking')
  async getRanking(): Promise<JSON> {
    return this.appService.getRanking();
  }
}
