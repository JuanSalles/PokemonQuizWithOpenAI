import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionSchema } from './database/schemas/questionSchema';
import { RankingSchema } from './database/schemas/rankingSchema';
import { SessionSchema } from './database/schemas/sessionSchema';
import { AuthService } from './services/auth/auth.service';
import { LocalStrategy } from './services/auth/LocalStrategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([
      { name: 'Questions', schema: QuestionSchema },
      { name: 'Ranking', schema: RankingSchema },
      { name: 'Sessions', schema: SessionSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '800s' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, LocalStrategy],
})
export class AppModule {}
