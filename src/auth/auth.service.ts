/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    // generate the password hash
    const hash = await argon.hash(dto.password);

    try {
      // find the user by email
      const existedEmail = await this.prisma.user.findFirst({
        where: { email: dto.email },
      });
      if (existedEmail) {
        throw new HttpException('Credentials taken', HttpStatus.BAD_REQUEST);
      }
      //save new user in database
      const user = await this.prisma.user.create({
        data: { email: dto.email, hash },
      });

      delete user.hash;
      // return the saved user
      return user;
    } catch (error) {
      throw error;
    }
  }
  async signin(dto: AuthDto) {
    try {
      // find the user by email
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      // if user do not exist throw exception
      if (!user) {
        throw new HttpException(
          'Credentials incorrect',
          HttpStatus.BAD_REQUEST,
        );
      }
      // compare password
      const verified = await argon.verify(user.hash, dto.password);
      // if password incorrect throw exception
      if (!verified) {
        throw new HttpException('password incorrect', HttpStatus.BAD_REQUEST);
      }
      //send back the user
      delete user.hash;
      return user;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
