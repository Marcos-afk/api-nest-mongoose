import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUsers } from './models/users.model';
import { Model } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { SignUpDto } from './dto/signup.dto';
import { compare, hash } from 'bcrypt';
import { GenerationCode } from './utils/gerationCode.util';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private readonly usersModel: Model<IUsers>,
    private readonly authService: AuthService,
  ) {}

  public async signUp(signUpDto: SignUpDto) {
    const isExistEmail = await this.usersModel.findOne({
      email: signUpDto.email,
    });
    if (isExistEmail) {
      throw new HttpException('Email inválido.', HttpStatus.BAD_REQUEST);
    }

    if (signUpDto.password !== signUpDto.confirmPassword) {
      throw new HttpException('Senhas não conferem.', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersModel.create({
      name: signUpDto.name,
      password: await hash(signUpDto.password, 8),
      email: signUpDto.email,
      confirmationCode: GenerationCode(),
    });

    return user;
  }

  public async signIn(signInDto: SignInDto) {
    const user = await this.usersModel.findOne({
      email: signInDto.email,
    });
    if (!user) {
      throw new HttpException('Email/Senha inválido(s).', HttpStatus.FORBIDDEN);
    }

    if (!user.isActive) {
      throw new HttpException('Usuário bloqueado.', HttpStatus.FORBIDDEN);
    }

    if (!user.isConfirmed) {
      throw new HttpException(
        'Conta com ativação pendente, verifique seu email.',
        HttpStatus.FORBIDDEN,
      );
    }

    const confirmedPassword = await compare(signInDto.password, user.password);
    if (!confirmedPassword) {
      throw new HttpException('Email/Senha inválido(s).', HttpStatus.FORBIDDEN);
    }

    const jwtToken = await this.authService.createAccessToken(String(user._id));

    return { name: user.name, email: user.email, token: jwtToken };
  }

  public async getAllUsers() {
    const users = await this.usersModel.find();
    if (users.length < 1) {
      throw new HttpException('Lista de usuários vazia.', HttpStatus.NOT_FOUND);
    }

    return users;
  }
}
