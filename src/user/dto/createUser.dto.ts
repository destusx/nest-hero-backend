import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @MinLength(5, { message: 'Password must be at least 5 characters long' })
    password: string;
}
