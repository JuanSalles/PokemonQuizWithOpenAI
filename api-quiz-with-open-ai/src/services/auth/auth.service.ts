import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async getToken(nick: string) {
    const payload = { nickname: nick };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
