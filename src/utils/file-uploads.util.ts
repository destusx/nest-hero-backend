import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';

// Разрешить только изображения
export const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(
            new HttpException('File must be an image', HttpStatus.BAD_REQUEST),
            false,
        );
    }
    callback(null, true);
};

export const fileSizeFilter = (req, file, callback) => {
    const maxSize = 1024 * 1024; // 1 MB
    if (file.size > maxSize) {
        return callback(
            new HttpException(
                `File size exceeds ${maxSize / 1024} KB limit!`,
                HttpStatus.BAD_REQUEST,
            ),
            false,
        );
    }
    callback(null, true);
};

export const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 10).toString(10))
        .join('');
    callback(null, `${name}${randomName}${fileExtName}`);
};
