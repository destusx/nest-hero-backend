import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthGuard } from './guards/auth.guard';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    controllers: [UserController],
    providers: [UserService, PrismaService, AuthGuard],
    exports: [UserService],
})
export class UserModule {}
