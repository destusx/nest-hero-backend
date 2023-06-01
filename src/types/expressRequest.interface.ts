import { User } from '@prisma/client';
import { Request } from 'express';
import { UserResponse } from 'src/user/types/userResponse.type';

export interface ExpressRequestInterface extends Request {
    user?: UserResponse;
}
