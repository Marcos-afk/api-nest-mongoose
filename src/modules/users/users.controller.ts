import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  public async create(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    const user = await this.usersService.signUp(signUpDto);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Usuário criado com sucesso!', user });
  }

  @Post('signin')
  public async login(@Body() signInDto: SignInDto, @Res() res: Response) {
    const user = await this.usersService.signIn(signInDto);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Login realizado com sucesso!', user });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  public async listUsers(@Res() res: Response) {
    const users = await this.usersService.getAllUsers();
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Lista de usuários.', users });
  }
}
