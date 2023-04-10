/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { User, Bookmark } from '@prisma/client'

@Injectable({})
export class AuthService {
  signup() {
    return { msg: 'signup' };
  }
  signin() {
    return { msg: 'signin' };
  }
}
