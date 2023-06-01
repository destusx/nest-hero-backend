import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { FileController } from './file.controller';

@Module({
    controllers: [FileController],
})
export class FileModule {}
