import { INestApplication, ModuleMetadata, ValidationError, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Address } from "src/addresses/address.entity";
import { Cart } from "src/carts/cart.entity";
import { CartItems } from "src/carts/cartItems.entity";
import { Category } from "src/categories/category.entity";
import { Comment } from "src/comments/comment.entity";
import { HttpValidationExceptionFilter } from "test/test-filters/http-validation-exception.filter";
import { Image } from "src/images/image.entity";
import { Order } from "src/orders/order.entity";
import { OrderAddress } from "src/orders/orderAddress.entity";
import { OrderItems } from "src/orders/orderItems.entity";
import { Payment } from "src/payments/payment.entity";
import { Product } from "src/products/product.entity";
import { Property } from "src/properties/property.entity";
import { User } from "src/users/user.entity";
import { ValidationException } from "../test-exceptions/validation.exception";
import { NestjsFormDataModule } from "nestjs-form-data";
import { AddressesController } from "../../src/addresses/addresses.controller";
import { AddressesService } from "../../src/addresses/addresses.service";
import { AuthController } from "../../src/auth/auth.controller";
import { AuthService } from "../../src/auth/auth.service";
import { CartsController } from "../../src/carts/carts.controller";
import { CartsService } from "../../src/carts/carts.service";
import { CategoriesController } from "../../src/categories/categories.controller";
import { CategoriesService } from "../../src/categories/categories.service";
import { CommentsController } from "../../src/comments/comments.controller";
import { CommentsService } from "../../src/comments/comments.service";
import { ImagesController } from "../../src/images/images.controller";
import { ImagesService } from "../../src/images/images.service";
import { OrdersController } from "../../src/orders/orders.controller";
import { OrdersService } from "../../src/orders/orders.service";
import { PaymentsController } from "../../src/payments/payments.controller";
import { PaymentsService } from "../../src/payments/payments.service";
import { ProductsController } from "../../src/products/products.controller";
import { ProductsService } from "../../src/products/products.service";
import { PropertiesController } from "../../src/properties/properties.controller";
import { PropertiesService } from "../../src/properties/properties.service";
import { UsersController } from "../../src/users/users.controller";
import { UsersService } from "../../src/users/users.service";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { HttpInternalServerErrorException } from "../test-filters/http-internal-server-error-exception.filter";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage, memoryStorage } from "multer";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as path from "path";
import { myMemoryStorageEngine } from "../memory-storage-engine";
import { FileFacade } from "src/common/file-facade.utils";


const defaultConfig: any = {
    entities: [
        Address,
        Cart,
        Category,
        Comment,
        Image,
        Order,
        OrderAddress,
        Payment,
        Product,
        Property,
        User,
        OrderItems,
        CartItems,
    ],
    controllers: [
        AddressesController,
        AuthController,
        CartsController,
        CategoriesController,
        CommentsController,
        ImagesController,
        OrdersController,
        PaymentsController,
        ProductsController,
        PropertiesController,
        UsersController,
    ],
    providers: [
        AddressesService,
        AuthService,
        CartsService,
        CategoriesService,
        CommentsService,
        ImagesService,
        OrdersService,
        PaymentsService,
        ProductsService,
        PropertiesService,
        UsersService,
        FileFacade,
    ],
};
export const setupTestModule = async (
    config?: { entities?: EntityClassOrSchema[], controllers?: ModuleMetadata['controllers'], providers?: ModuleMetadata['providers'] },
    spreadConfig: { entities?: EntityClassOrSchema[], controllers?: ModuleMetadata['controllers'], providers?: ModuleMetadata['providers'] } = { providers: [] },
): Promise<INestApplication> => {

    let theProviders = defaultConfig?.providers;
    if (config?.providers?.length > 0) {
        theProviders = config.providers;
    }

    if (spreadConfig?.providers?.length > 0) {
        theProviders = [
            ...theProviders.filter(provider => {
                for (const prv of spreadConfig.providers) {
                    if (prv === provider || prv?.['provide'] === provider) {
                        return false;
                    }
                }
                return true;
            }),
            ...spreadConfig.providers,
        ]
    }

    let app: INestApplication = null;
    const moduleRef = await Test.createTestingModule({
        imports: [
            NestjsFormDataModule,
            MulterModule.registerAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => ({
                    // dest: configService.get<string>('UPLOAD_PATH'), 
                    storage: myMemoryStorageEngine,
                })
            }),
            ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env.test',//path.join(__dirname, '../', '.env.test')
            }),
            TypeOrmModule.forRootAsync({
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => ({
                    type: configService.get<string>('DATABASE_TYPE') as any,
                    database: configService.get<string>('DATABASE_DATABASE'),
                    entities: config?.entities ?? defaultConfig?.entities,
                    dropSchema: true,
                    synchronize: true,
                    // logging: true,
                }),
                inject: [ConfigService],
            }),
            TypeOrmModule.forFeature(config?.entities ?? defaultConfig?.entities),
            /* MulterModule.register({
                // storage: memoryStorage(),
                storage: myMemoryStorageEngine,
            }) */
        ],
        controllers: config?.controllers ?? defaultConfig?.controllers,
        providers: theProviders,
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
        exceptionFactory: (errors: ValidationError[]) => new ValidationException(errors)
    }));
    app.useGlobalFilters(new HttpValidationExceptionFilter());
    app.useGlobalFilters(new HttpInternalServerErrorException());
    await app.init();

    return app;
}




