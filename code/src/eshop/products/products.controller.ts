import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {FileFieldsInterceptor, FilesInterceptor} from '@nestjs/platform-express';
import {plainToClass} from 'class-transformer';
import {validate} from 'class-validator';
import {FormDataRequest} from 'nestjs-form-data';
import {JwtAuthGuard} from 'src/auth/jwt-auth.guard';
import {IdToEntity} from 'src/common/pipes/id-to-entity.pipe';
import {RequirePermissions} from 'src/users/permissions.decorator';
import {PermissionsGuard} from 'src/users/permissions.guard';
import {ValidationException} from 'test/test-exceptions/validation.exception';
import {CreateProductDto} from "./dto/create-product.dto";
import {UpdateProductDto} from './dto/update-product.dto';
import { ProductProvider } from './ports/product.provider';
import { ProductUseCase } from './ports/product.usecase';
import {Product} from './product.entity';
import {ProductsService} from "./products.service";

@Controller()
export class ProductsController {
    constructor(private productUseCases: ProductUseCase) {
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('add-product')
    @Post('/products')
    @UseInterceptors(FilesInterceptor('new_images'))
    async create(@Body() body, @UploadedFiles() images: Array<Express.Multer.File>) {
        let cpd = null;
        const plain = {
            ...body,
            new_images: images,//.map(image => image.buffer)
        };
        cpd = plainToClass(CreateProductDto, plain, {enableImplicitConversion: true});
        const validationErrors = await validate(cpd);
        if (validationErrors.length > 0) {
            throw new ValidationException(validationErrors);
        }
        await this.productUseCases.create({
            ...cpd,
            new_images: images,
        });

        return;
    }


    @Get('/products')
    getAll() {

    }

    @Get('/products/:id')
    get(@Param('id') productId: string) {

    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('edit-product-any')
    @Patch('/products/:id')
    async update(@Param('id', new IdToEntity(Product, ['category', 'properties'])) product: Product, @Body() body: UpdateProductDto) {
        await this.productUseCases.update(product, body);
        return;
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('delete-product-any')
    @Delete('/products/:id')
    async delete(@Param('id', new IdToEntity(Product)) product: Product) {
        return await this.productUseCases.delete(product);
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
