import { PrismaService } from './prisma.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [PrismaService],
})
export class PrismaModule {}
