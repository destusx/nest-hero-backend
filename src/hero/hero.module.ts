import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { HeroController } from './hero.controller';
import { HeroService } from './hero.service';

@Module({
    controllers: [HeroController],
    providers: [HeroService, PrismaService],
})
export class HeroModule {}
