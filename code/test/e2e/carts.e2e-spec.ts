import {
    INestApplication,
    ValidationError,
    ValidationPipe,
} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Address} from 'src/addresses/address.entity';
import {AppModule} from 'src/app.module';
import {Cart} from 'src/carts/cart.entity';
import {CartItems} from 'src/carts/cartItems.entity';
import {Category} from 'src/categories/category.entity';
import {Comment} from 'src/comments/comment.entity';
import {EShopModule} from 'src/eshop.module';
import {HttpValidationExceptionFilter} from 'test/http-validation-exception.filter';
import {Image} from 'src/images/image.entity';
import {Order} from 'src/orders/order.entity';
import {OrderAddress} from 'src/orders/orderAddress.entity';
import {OrderItems} from 'src/orders/orderItems.entity';
import {Payment} from 'src/payments/payment.entity';
import {Product} from 'src/products/product.entity';
import {Property} from 'src/properties/property.entity';
import {User} from 'src/users/user.entity';
import * as request from 'supertest';
import {getConnection} from 'typeorm';
import {
    CartFactory,
    CartItemsFactory,
    CategoryFactory,
    ProductFactory,
} from 'test/factories.helper';
import {ValidationException} from 'test/validation.exception';

describe('PATCH /carts/items/:id - validation tests', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                EShopModule,
                TypeOrmModule.forRoot({
                    type: 'better-sqlite3',
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
                ]),
            ],
        }).compile();
        app = moduleRef.createNestApplication();
        // app.useGlobalPipes(new ValidationPipe());
        app.useGlobalPipes(
            new ValidationPipe({
                exceptionFactory: (errors: ValidationError[]) =>
                    new ValidationException(errors),
            }),
        );
        app.useGlobalFilters(new HttpValidationExceptionFilter());
        await app.init();
    });

    describe('validation tests', () => {
        it(`returns 400 and product_id.cannotBeForeignKey`, async () => {
            const response = await request(app.getHttpServer())
                .patch(`/carts/items/3`)
                .send({quantity: 1, product_id: 3});
            expect(response.status).toEqual(400);
            expect(response.body.errorCodes).toContain(
                'product_id.cannotBeForeignKey',
            );
        });

        it(`returns 400 and product_id.notDefined`, async () => {
            const response = await request(app.getHttpServer())
                .patch(`/carts/items/3`)
                .send({quantity: 1});
            expect(response.status).toEqual(400);
            expect(response.body.errorCodes).toContain('product_id.notDefined');
        });

        it(`returns 400 quantity.notDefined`, async () => {
            const cart = await CartFactory.get().create();
            const product = await ProductFactory.get().create();
            const response = await request(app.getHttpServer())
                .patch(`/carts/items/${cart.id}`)
                .send({product_id: product.id});
            expect(response.status).toEqual(400);
            expect(response.body.errorCodes).toContain('quantity.notDefined');
            expect(response.body.errorCodes).not.toContain(
                'product_id.cannotBeForeignKey',
            );
            expect(response.body.errorCodes).not.toContain('product_id.notDefined');
        });

        it(`returns 400 quantity.lessThanMin`, async () => {
            const cart = await CartFactory.get().create();
            const product = await ProductFactory.get().create();
            const response = await request(app.getHttpServer())
                .patch(`/carts/items/${cart.id}`)
                .send({product_id: product.id, quantity: 0});
            expect(response.status).toEqual(400);
            expect(response.body.errorCodes).toHaveLength(1);
            expect(response.body.errorCodes).toContain('quantity.lessThanMin');
        });
    });
});
