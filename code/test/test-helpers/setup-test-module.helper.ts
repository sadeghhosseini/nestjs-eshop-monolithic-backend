import { INestApplication, ModuleMetadata, ValidationError, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Address } from "src/eshop/addresses/address.entity";
import { Cart } from "src/eshop/carts/cart.entity";
import { CartItems } from "src/eshop/carts/cartItems.entity";
import { Category } from "src/eshop/categories/category.entity";
import { Comment } from "src/eshop/comments/comment.entity";
import { HttpValidationExceptionFilter } from "test/test-filters/http-validation-exception.filter";
import { Image } from "src/eshop/images/image.entity";
import { Order } from "src/eshop/orders/order.entity";
import { OrderAddress } from "src/eshop/orders/orderAddress.entity";
import { OrderItems } from "src/eshop/orders/orderItems.entity";
import { Payment } from "src/eshop/payments/payment.entity";
import { Product } from "src/eshop/products/product.entity";
import { Property } from "src/eshop/properties/property.entity";
import { User } from "src/users/user.entity";
import { ValidationException } from "../test-exceptions/validation.exception";
import { NestjsFormDataModule } from "nestjs-form-data";
import { AddressesController } from "../../src/eshop/addresses/addresses.controller";
import { AddressesService } from "../../src/eshop/addresses/addresses.service";
import { AuthController } from "../../src/auth/auth.controller";
import { AuthService } from "../../src/auth/auth.service";
import { CartsController } from "../../src/eshop/carts/carts.controller";
import { CartsService } from "../../src/eshop/carts/carts.service";
import { CategoriesController } from "../../src/eshop/categories/categories.controller";
import { CategoriesService } from "../../src/eshop/categories/categories.service";
import { CommentsController } from "../../src/eshop/comments/comments.controller";
import { CommentsService } from "../../src/eshop/comments/comments.service";
import { ImagesController } from "../../src/eshop/images/images.controller";
import { ImagesService } from "../../src/eshop/images/images.service";
import { OrdersController } from "../../src/eshop/orders/orders.controller";
import { OrdersService } from "../../src/eshop/orders/orders.service";
import { PaymentsController } from "../../src/eshop/payments/payments.controller";
import { PaymentsService } from "../../src/eshop/payments/payments.service";
import { ProductsController } from "../../src/eshop/products/products.controller";
import { ProductsService } from "../../src/eshop/products/products.service";
import { PropertiesController } from "../../src/eshop/properties/properties.controller";
import { PropertiesService } from "../../src/eshop/properties/properties.service";
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
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { Permission } from "src/users/permission.entity";
import { UserRepository } from "src/users/users.repository";
import { APP_GUARD } from "@nestjs/core";
import { PermissionsGuard } from "src/users/permissions.guard";
import { JwtStrategy } from "src/auth/jwt.strategy";
import {permissionSeeder} from "../../src/users/permission.seed";


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
        OrderItems,
        CartItems,
        User,
        Permission,
    ],
    customRepository: [
        UserRepository,
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
        JwtStrategy,
        /*{
            provide: APP_GUARD,
            useClass: PermissionsGuard,
        },*/
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
    const forFeatures = [...(config?.entities ?? defaultConfig?.entities), ...defaultConfig?.customRepository];
    const moduleRef = await Test.createTestingModule({
        imports: [
            PassportModule,
            JwtModule.registerAsync({
                imports: [ConfigModule.forRoot()],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '1d' }
                })
            }),
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
            TypeOrmModule.forFeature(forFeatures),
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




