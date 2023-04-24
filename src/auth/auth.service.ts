/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt/dist';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
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

      return this.signToken(user.id, user.email);
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

      return this.signToken(user.id, user.email);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      accessToken: token,
    };
  }
}
