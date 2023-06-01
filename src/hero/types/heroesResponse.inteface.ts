import { Hero } from '@prisma/client';

export type HeroesResponseInterface = {
    heroes: Hero[];
    heroesCount: number;
};
