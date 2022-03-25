import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { FormDataRequest } from 'nestjs-form-data';
import { IdToEntity } from 'src/common/pipes/id-to-entity.pipe';
import { ValidationException } from 'test/test-exceptions/validation.exception';
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { ProductsService } from "./products.service";

@Controller()
export class ProductsController {
    constructor(private service: ProductsService) {
    }

    @Post('/products')
    @UseInterceptors(FilesInterceptor('new_images'))
    async create(@Body() body, @UploadedFiles() images: Array<Express.Multer.File>) {
        let cpd = null;
        const plain = {
            ...body,
            new_images: images,//.map(image => image.buffer)
        };
        cpd = plainToClass(CreateProductDto, plain, { enableImplicitConversion: true });
        const validationErrors = await validate(cpd);
        console.log(validationErrors);
        if (validationErrors.length > 0) {
            throw new ValidationException(validationErrors);
        }
        await this.service.create({
            ...cpd,
            new_images: images,
        });


        return;
    }


    /*     @Post('/products')
        @FormDataRequest()
        async create(@Body() body) {
            console.log(body);
            return;
        } */

    @Get('/products')
    getAll() {

    }

    @Get('/products/:id')
    get(@Param('id') productId: string) {

    }

    @Patch('/products/:id')
    async update(@Param('id', new IdToEntity(Product, ['category', 'properties'])) product: Product, @Body() body: UpdateProductDto) {
        await this.service.update(product, body);
        return;
    }

    @Delete('/products/:id')
    async delete(@Param('id', new IdToEntity(Product)) product: Product) {
        return await this.service.delete(product);
    }

    @Get('/products/:id/images')
    getImages(@Param('id') productId: string) {

    }

    @Get('/products/:id/category')
    getCategory(@Param('id') productId: string) {

    }

    @Get('/products/:id/properties')
    getProperties(@Param('id') productId: string) {

    }
}
