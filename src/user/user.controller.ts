import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { ExpressRequestInterface } from 'src/types/expressRequest.interface';
import { User } from './decorators/user.decorator';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUse.dto';
import { AuthGuard } from './guards/auth.guard';
import { UserResponse } from './types/userResponse.type';
import { UserResponseToken } from './types/userResponseToken.type';
import { UserService } from './user.service';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    @UsePipes(new ValidationPipe())
    async createUser(
        @Body() createUserDto: CreateUserDto,
    ): Promise<UserResponseToken> {
        const user = await this.userService.createUser(createUserDto);
        return this.userService.buildUserRespone(user);
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    async login(
        @Body() loginUserDto: LoginUserDto,
    ): Promise<UserResponseToken> {
        const user = await this.userService.login(loginUserDto);
        return this.userService.buildUserRespone(user);
    }

    @Get('user')
    @UseGuards(AuthGuard)
    async currentUser(@User() user: UserResponse): Promise<UserResponseToken> {
        return this.userService.buildUserRespone(user);
    }
}
