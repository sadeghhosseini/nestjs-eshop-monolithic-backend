import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { EShopModule } from 'src/eshop.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Address } from 'src/addresses/address.entity';
import * as path from 'path';

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
  constructor(config: ConfigService) {
    console.log('config', config)
  }
}
