import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Hero } from '@prisma/client';
import slugify from 'slugify';
import { PrismaService } from 'src/prisma.service';
import { CreateHeroDto } from './dto/createHero.dto';
import { HeroesResponseInterface } from './types/heroesResponse.inteface';

@Injectable()
export class HeroService {
    constructor(readonly prisma: PrismaService) {}

    async findAll(query: any): Promise<HeroesResponseInterface> {
        let take = 5;
        let skip = 0;

        if (query.limit) {
            take = +query.limit;
        }
        if (query.skip) {
            skip = +query.skip;
        }

        const heroes = await this.prisma.hero.findMany({
            orderBy: { createdAt: 'desc' },
            skip,
            take,
        });

        const heroesCount = await this.prisma.hero.count();

        return { heroes, heroesCount };
    }

    async createHero(
        userId: number,
        createHeroDto: CreateHeroDto,
    ): Promise<Hero> {
        const {
            nickname,
            realName,
            originDescription,
            superpowers,
            catchPhrase,
            images,
        } = createHeroDto;

        await this.checkHeroUniqueByName(nickname);

        const slug = this.getSlug(nickname);

        const newHero = await this.prisma.hero.create({
            data: {
                nickname,
                realName,
                originDescription,
                superpowers,
                catchPhrase,
                images,
                slug,
                userId,
            },
        });

        return newHero;
    }

    async updateHero(
        userId: number,
        slug: string,
        createHeroDto: CreateHeroDto,
    ): Promise<Hero> {
        const hero = await this.getHeroBySlug(slug);

        const {
            nickname,
            realName,
            originDescription,
            superpowers,
            catchPhrase,
            images,
        } = createHeroDto;

        if (userId !== hero.userId) {
            throw new HttpException(
                'You cant delete this hero',
                HttpStatus.FORBIDDEN,
            );
        }

        const defaultImage = ['/uploads/default.svg'];

        const updatedHero = await this.prisma.hero.update({
            where: { slug },
            data: {
                nickname,
                realName,
                originDescription,
                superpowers,
                catchPhrase,
                images: images || defaultImage,
                slug,
                userId,
            },
        });

        return updatedHero;
    }

    async getHeroBySlug(slug: string): Promise<Hero> {
        const hero = await this.prisma.hero.findFirst({
            where: { slug },
        });

        if (!hero) {
            throw new HttpException(
                'There is no hero by this slug',
                HttpStatus.BAD_REQUEST,
            );
        }

        return hero;
    }

    async deleteHero(userId: number, slug: string) {
        const hero = await this.getHeroBySlug(slug);

        if (userId !== hero.userId) {
            throw new HttpException(
                'You cant delete this hero',
                HttpStatus.FORBIDDEN,
            );
        }

        return await this.prisma.hero.delete({
            where: { slug },
        });
    }

    private getSlug(title: string): string {
        return slugify(title, {
            replacement: '-',
            lower: true,
            trim: true,
            strict: true,
        });
    }

    async checkHeroUniqueByName(nickname: string): Promise<Hero> {
        const hero = await this.prisma.hero.findFirst({
            where: { nickname },
        });

        if (hero) {
            throw new HttpException(
                'This superhero already exists',
                HttpStatus.UNPROCESSABLE_ENTITY,
            );
        }

        return hero;
    }
}
