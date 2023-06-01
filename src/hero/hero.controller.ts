import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { Hero } from '@prisma/client';
import { User } from 'src/user/decorators/user.decorator';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { CreateHeroDto } from './dto/createHero.dto';
import { UpdateHeroDto } from './dto/updateHero.dto';
import { HeroService } from './hero.service';
import { HeroesResponseInterface } from './types/heroesResponse.inteface';

@Controller()
export class HeroController {
    constructor(private readonly heroService: HeroService) {}

    @Get('heroes')
    async findAll(@Query() query: any): Promise<HeroesResponseInterface> {
        return await this.heroService.findAll(query);
    }

    @Post('heroes')
    @UseGuards(AuthGuard)
    async createHero(
        @User('id') userId: number,
        @Body() createHeroDto: CreateHeroDto,
    ): Promise<Hero> {
        return await this.heroService.createHero(userId, createHeroDto);
    }

    @Put('hero/:slug')
    @UseGuards(AuthGuard)
    async updateHero(
        @User('id') userId: number,
        @Param('slug') slug: string,
        @Body() updateHeroDto: UpdateHeroDto,
    ): Promise<Hero> {
        return await this.heroService.updateHero(userId, slug, updateHeroDto);
    }

    @Delete('hero/:slug')
    async deleteHero(@User('id') userId: number, @Param('slug') slug: string) {
        return await this.heroService.deleteHero(userId, slug);
    }

    @Get('hero/:slug')
    async getHeroBySlug(@Param('slug') slug: string): Promise<Hero> {
        return await this.heroService.getHeroBySlug(slug);
    }
}
