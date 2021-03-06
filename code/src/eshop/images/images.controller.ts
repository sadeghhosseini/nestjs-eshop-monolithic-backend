import { Body, Controller, Delete, Get, Logger, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { promises } from 'fs';
import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileFacade } from 'src/common/file-facade.utils';
import { RequirePermissions } from 'src/users/permissions.decorator';
import { PermissionsGuard } from 'src/users/permissions.guard';
import { Repository } from 'typeorm';
import { CreateImageDto } from './dto/create-image.dto';
import { Image } from './image.entity';

@Controller()
export class ImagesController {
    constructor(
        @InjectRepository(Image)
        private repository: Repository<Image>,
        private configService: ConfigService,
        private fileFacade: FileFacade,
    ) {

    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('add-image')
    @Post('/images')
    @FormDataRequest()
    async create(@Body() body: CreateImageDto) {
        //upload the image
        for (const image of body.images) {
            const file = image.file as MemoryStoredFile;
            const timestamp = Date.now();
            const fileName = `${image.path}_${timestamp}.${file.mimetype.split('/')[1]}`;
            try {
                // await promises.writeFile(this.configService.get<string>('UPLOAD_PATH') + '/' + fileName, file.buffer);
                await this.fileFacade.save(this.configService.get<string>('UPLOAD_PATH') + '/' + fileName, file.buffer);
            } catch(e) {
                Logger.log(e);
                throw e;
            }
        }
        return;
        //save the path into the database
        /* for (const image of body.images) {
            this.repository.save({
                path: image.path,
            });
        } */
    }

    @Get('/images')
    getAll() {

    }

    @Get('/images/:id')
    get(@Param('id') imageId: string) {

    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('delete-image-any')
    @Delete('/images/:id')
    delete(@Param('id') imageId: string) {

    }

    @Get('/images/:id/products')
    getProducts(@Param('id') imageId: string) {

    }
}
