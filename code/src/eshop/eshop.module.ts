import { Module } from '@nestjs/common';
import { AddressesController } from 'src/eshop/addresses/adapters/addresses.controller';
import { AuthController } from 'src/auth/auth.controller';
import { CartsController } from 'src/eshop/carts/carts.controller';
import { CategoriesController } from 'src/eshop/categories/adapters/categories.controller';
import { CommentsController } from 'src/eshop/comments/adapters/comments.controller';
import { ImagesController } from 'src/eshop/images/images.controller';
import { OrdersController } from 'src/eshop/orders/orders.controller';
import { PaymentsController } from 'src/eshop/payments/payments.controller';
import { ProductsController } from 'src/eshop/products/products.controller';
import { PropertiesController } from 'src/eshop/properties/properties.controller';
import { UsersController } from 'src/users/users.controller';
import { AddressesService } from 'src/eshop/addresses/addresses.service';
import { AuthService } from 'src/auth/auth.service';
import { CartsService } from 'src/eshop/carts/carts.service';
import { CategoriesService } from 'src/eshop/categories/categories.service';
import { CommentsService } from 'src/eshop/comments/comments.service';
import { ImagesService } from 'src/eshop/images/images.service';
import { OrdersService } from 'src/eshop/orders/orders.service';
import { PaymentsService } from 'src/eshop/payments/payments.service';
import { ProductsService } from 'src/eshop/products/products.service';
import { PropertiesService } from 'src/eshop/properties/properties.service';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from 'src/eshop/addresses/address.entity';
import { Cart } from 'src/eshop/carts/cart.entity';
import { Category } from 'src/eshop/categories/category.entity';
import { Order } from 'src/eshop/orders/order.entity';
import { Payment } from 'src/eshop/payments/payment.entity';
import { Product } from 'src/eshop/products/product.entity';
import { Property } from 'src/eshop/properties/property.entity';
import { User } from 'src/users/user.entity';
import { OrderItems } from 'src/eshop/orders/orderItems.entity';
import { CartItems } from 'src/eshop/carts/cartItems.entity';
import { Comment } from 'src/eshop/comments/comment.entity';
import { Image } from 'src/eshop/images/image.entity';
import { OrderAddress } from 'src/eshop/orders/orderAddress.entity';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileFacade } from '../common/file-facade.utils';
import { IdToEntity } from '../common/pipes/id-to-entity.pipe';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { Permission } from 'src/users/permission.entity';
import { UserRepository } from 'src/users/users.repository';
import { AddressRepository } from './addresses/adapters/address.repository';
import { AddressProvider } from './addresses/ports/address.provider';
import { AddressUseCase } from './addresses/ports/address.usecase';
import { CategoryProvider } from './categories/ports/category.provider';
import { CategoryUseCase } from './categories/ports/category.usecase';
import { CategoryRepository } from './categories/adapters/category.repository';
import { CommentProvider } from './comments/ports/comment.provider';
import { CommentUseCase } from './comments/ports/comment.usecase';
import { CommentRepository } from './comments/adapters/comment.repository';
import { PropertyProvider } from './properties/prots/property.provider';
import { PropertyRepository } from './properties/adapters/property.repository';
import { ImageProvider } from './images/ports/image.provider';
import { ImageRepository } from './images/adapters/image.repository';

@Module({
    imports: [
        NestjsFormDataModule,
        AuthModule,
        UsersModule,
        MulterModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                dest: configService.get<string>('UPLOAD_PATH'),
            })
        }),
        TypeOrmModule.forFeature([
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
            Permission,
            UserRepository,
        ])
    ],
    controllers: [
        AddressesController,
        CartsController,
        CategoriesController,
        CommentsController,
        ImagesController,
        OrdersController,
        PaymentsController,
        ProductsController,
        PropertiesController,
    ],
    providers: [
        CartsService,
        ImagesService,
        OrdersService,
        PaymentsService,
        ProductsService,
        PropertiesService,
        FileFacade,
        {
            provide: AddressProvider,
            useClass: AddressRepository,
        },
        {
            provide: AddressUseCase,
            useClass: AddressesService,
        },
        {
            provide: CategoryProvider,
            useClass: CategoryRepository,
        },
        {
            provide: CategoryUseCase,
            useClass: CategoriesService,
        },
        {
            provide: CommentProvider,
            useClass: CommentRepository,
        },
        {
            provide: CommentUseCase,
            useClass: CommentsService,
        },
        {
            provide: PropertyProvider,
            useClass: PropertyRepository,
        },
        {
            provide: ImageProvider,
            useClass: ImageRepository,
        },
    ],
})
export class EShopModule { }
