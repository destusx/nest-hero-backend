import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from 'src/config';
import { UserResponse } from './types/userResponse.type';
import { UserResponseToken } from './types/userResponseToken.type';
import { LoginUserDto } from './dto/loginUse.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async createUser(createUserDto: CreateUserDto): Promise<UserResponse> {
        const { email, name, password } = createUserDto;

        const userByEmail = await this.prisma.user.findFirst({
            where: { email },
        });

        const userByName = await this.prisma.user.findFirst({
            where: { name },
        });

        if (userByName) {
            throw new HttpException(
                'This name is already in use',
                HttpStatus.UNPROCESSABLE_ENTITY,
            );
        }

        if (userByEmail) {
            throw new HttpException(
                'This email is already in use',
                HttpStatus.UNPROCESSABLE_ENTITY,
            );
        }

        const hashPassword = await hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                email,
                name,
                password: hashPassword,
            },
        });

        const userWithoutPassword = this.excludeKeys(user, ['password']);
        return userWithoutPassword;
    }

    async login(loginUserDto: LoginUserDto): Promise<UserResponse> {
        const { email, password } = loginUserDto;
        const user = await this.prisma.user.findFirst({
            where: { email },
        });

        if (!user) {
            throw new HttpException(
                'Invalid Email or Password',
                HttpStatus.UNPROCESSABLE_ENTITY,
            );
        }

        const isPasswordCorrect = await compare(password, user.password);

        if (!isPasswordCorrect) {
            throw new HttpException(
                'Invalid Email or Password',
                HttpStatus.UNPROCESSABLE_ENTITY,
            );
        }

        const userWithoutPassword = this.excludeKeys(user, ['password']);
        return userWithoutPassword;
    }

    async findUserById(id: number): Promise<UserResponse> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { favorites: { select: { id: true } } },
        });

        if (!user) {
            throw new HttpException(
                'This user doesnt exist',
                HttpStatus.NOT_FOUND,
            );
        }

        return this.excludeKeys(user, ['password']);
    }

    generateJwt(user: UserResponse): string {
        return sign(
            {
                id: user.id,
                name: user.name,
            },
            JWT_SECRET,
        );
    }

    buildUserRespone(user: UserResponse): UserResponseToken {
        return {
            ...user,
            token: this.generateJwt(user),
        };
    }

    excludeKeys<User, Key extends keyof User>(
        user: User,
        keys: Key[],
    ): Omit<User, Key> {
        for (let key of keys) {
            delete user[key];
        }
        return user;
    }
}
