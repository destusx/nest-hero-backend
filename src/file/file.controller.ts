import {
    Controller,
    HttpStatus,
    Post,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { editFileName, imageFileFilter } from 'src/utils/file-uploads.util';

@Controller()
export class FileController {
    @Post('uploads')
    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: 'uploads',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
            limits: { fileSize: 1024 * 1024 },
        }),
    )
    async uploadedFile(@UploadedFile() file: Express.Multer.File) {
        const response = {
            originalname: file.originalname,
            filename: file.filename,
            url: `/uploads/${file.filename}`,
        };

        return {
            status: HttpStatus.OK,
            message: 'Image uploaded successfully!',
            data: response,
        };
    }

    @Post('uploadMultipleFiles')
    @UseInterceptors(
        FilesInterceptor('file', 10, {
            storage: diskStorage({
                destination: './uploads',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
        const response = [];
        files.forEach(file => {
            const fileReponse = {
                originalname: file.originalname,
                filename: file.filename,
                url: `/uploads/${file.filename}`,
            };
            response.push(fileReponse);
        });
        return {
            status: HttpStatus.OK,
            message: 'Images uploaded successfully!',
            data: response,
        };
    }
}
