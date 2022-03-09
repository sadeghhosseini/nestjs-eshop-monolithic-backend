import { INestApplication, ValidationError, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as request from 'supertest';
import { getConnection } from "typeorm";
import { CartFactory, CartItemsFactory, CategoryFactory, ProductFactory } from "./factories.helper";
import { ValidationException } from "./validation.exception";
import { NestjsFormDataModule } from "nestjs-form-data";
import { EShopModule } from "../src/eshop.module";
import { Address } from "../src/addresses/address.entity";
import { Cart } from "../src/carts/cart.entity";
import { Category } from "../src/categories/category.entity";
import { Comment } from "../src/comments/comment.entity";
import { Image } from "../src/images/image.entity";
import { Order } from "../src/orders/order.entity";
import { OrderAddress } from "../src/orders/orderAddress.entity";
import { Payment } from "../src/payments/payment.entity";
import { Product } from "../src/products/product.entity";
import { Property } from "../src/properties/property.entity";
import { User } from "../src/users/user.entity";
import { OrderItems } from "../src/orders/orderItems.entity";
import { CartItems } from "../src/carts/cartItems.entity";
import { HttpValidationExceptionFilter } from "./http-validation-exception.filter";


export const setupTestModule = async (): Promise<INestApplication> => {
    let app: INestApplication = null;
    const moduleRef = await Test.createTestingModule({
        imports: [
            NestjsFormDataModule,
            EShopModule,
            TypeOrmModule.forRoot({
                type: 'better-sqlite3',
                // keepConnectionAlive: true,
                database: ':memory:',
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
                dropSchema: true,
                // logging: true,
                synchronize: true,
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
                User,
                OrderItems,
                CartItems,
            ])
        ],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
        exceptionFactory: (errors: ValidationError[]) => new ValidationException(errors)
    }));
    app.useGlobalFilters(new HttpValidationExceptionFilter());
    await app.init();

    return app;
}