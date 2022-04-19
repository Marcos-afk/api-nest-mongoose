import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { sign } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { Request } from 'express';
import { IUsers } from '../users/models/users.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Users') private readonly usersModel: Model<IUsers>,
  ) {}

  public async createAccessToken(userId: string) {
    return sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
  }

  public async validateUser(userId: string) {
    const user = await this.usersModel.findById(userId);
    if (!user) {
      throw new HttpException(
        'Código de identificação de usuário inválido.',
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  private jwtExtractor(request: Request) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new HttpException('Sem token.', HttpStatus.NOT_FOUND);
    }

    const [, token] = authHeader.split(' ');

    return token;
  }

  public returnJwtExtractor() {
    return this.jwtExtractor;
  }
}
