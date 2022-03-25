import { Module } from '@nestjs/common';
import { AddressesController } from 'src/addresses/addresses.controller';
import { AuthController } from 'src/auth/auth.controller';
import { CartsController } from 'src/carts/carts.controller';
import { CategoriesController } from 'src/categories/categories.controller';
import { CommentsController } from 'src/comments/comments.controller';
import { ImagesController } from 'src/images/images.controller';
import { OrdersController } from 'src/orders/orders.controller';
import { PaymentsController } from 'src/payments/payments.controller';
import { ProductsController } from 'src/products/products.controller';
import { PropertiesController } from 'src/properties/properties.controller';
import { UsersController } from 'src/users/users.controller';
import { AddressesService } from 'src/addresses/addresses.service';
import { AuthService } from 'src/auth/auth.service';
import { CartsService } from 'src/carts/carts.service';
import { CategoriesService } from 'src/categories/categories.service';
import { CommentsService } from 'src/comments/comments.service';
import { ImagesService } from 'src/images/images.service';
import { OrdersService } from 'src/orders/orders.service';
import { PaymentsService } from 'src/payments/payments.service';
import { ProductsService } from 'src/products/products.service';
import { PropertiesService } from 'src/properties/properties.service';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from 'src/addresses/address.entity';
import { Cart } from 'src/carts/cart.entity';
import { Category } from 'src/categories/category.entity';
import { Order } from 'src/orders/order.entity';
import { Payment } from 'src/payments/payment.entity';
import { Product } from 'src/products/product.entity';
import { Property } from 'src/properties/property.entity';
import { User } from 'src/users/user.entity';
import { OrderItems } from 'src/orders/orderItems.entity';
import { CartItems } from 'src/carts/cartItems.entity';
import { Comment } from 'src/comments/comment.entity';
import { Image } from 'src/images/image.entity';
import { OrderAddress } from 'src/orders/orderAddress.entity';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileFacade } from './common/file-facade.utils';
import { IdToEntity } from './common/pipes/id-to-entity.pipe';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

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
        AddressesService,
        CartsService,
        CategoriesService,
        CommentsService,
        ImagesService,
        OrdersService,
        PaymentsService,
        ProductsService,
        PropertiesService,
        FileFacade,
    ],
})
export class EShopModule { }
