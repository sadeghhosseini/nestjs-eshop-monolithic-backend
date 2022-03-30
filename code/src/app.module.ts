import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { EShopModule } from 'src/eshop/eshop.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Address } from 'src/eshop/addresses/address.entity';
import * as path from 'path';
import { Permission } from './users/permission.entity';

@Module({
  imports: [
    EShopModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<any>('DATABASE_TYPE'),
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<string>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_DATABASE'),
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
          Permission,
        ],
        synchronize: true,//remove in production (applies changes to entity classes -migrations files- to database on each application start)
      }),
    }),
  ],
  controllers: [
  ],
  providers: [
  ],
})
export class AppModule {
  
}
