import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AddressesController } from './addresses/addresses.controller';
import { AuthController } from './auth/auth.controller';
import { CartsController } from './carts/carts.controller';
import { CategoriesController } from './categories/categories.controller';
import { CommentsController } from './comments/comments.controller';
import { ImagesController } from './images/images.controller';
import { OrdersController } from './orders/orders.controller';
import { PaymentsController } from './payments/payments.controller';
import { ProductsController } from './products/products.controller';
import { PropertiesController } from './properties/properties.controller';
import { UsersController } from './users/users.controller';
import { AddressesService } from './addresses/addresses.service';
import { AuthService } from './auth/auth.service';
import { CartsService } from './carts/carts.service';
import { CategoriesService } from './categories/categories.service';
import { CommentsService } from './comments/comments.service';
import { ImagesService } from './images/images.service';
import { OrdersService } from './orders/orders.service';
import { PaymentsService } from './payments/payments.service';
import { ProductsService } from './products/products.service';
import { PropertiesService } from './properties/properties.service';
import { UsersService } from './users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './addresses/address.entity';
import { Cart } from './carts/cart.entity';
import { Category } from './categories/category.entity';
import { Order } from './orders/order.entity';
import { Payment } from './payments/payment.entity';
import { Product } from './products/product.entity';
import { Property } from './properties/property.entity';
import { User } from './users/user.entity';
import { OrderItems } from './orders/orderItems.entity';
import { CartItems } from './carts/cartItems.entity';
import { Comment } from './comments/comment.entity';
import { Image } from './images/image.entity';
import { OrderAddress } from './orders/orderAddress.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql-db',//container name for mysql docker container
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'eshop_db',
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
  ],
  controllers: [
    AppController,
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
    AppService,
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
  ],
})
export class AppModule { }
