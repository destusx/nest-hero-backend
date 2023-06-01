import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class LoginUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(5, { message: 'Password must be at least 5 characters long' })
    password: string;
}
