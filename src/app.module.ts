import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule, BookmarkModule, UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
