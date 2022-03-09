import {
    INestApplication,
    ValidationError,
    ValidationPipe,
} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import {TypeOrmModule} from '@nestjs/typeorm';
import * as request from 'supertest';
import {getConnection} from 'typeorm';
import {expect} from 'chai';
import {EShopModule} from '../../src/eshop.module';
import {Address} from '../../src/addresses/address.entity';
import {Cart} from '../../src/carts/cart.entity';
import {Category} from '../../src/categories/category.entity';
import {Order} from '../../src/orders/order.entity';
import {OrderAddress} from '../../src/orders/orderAddress.entity';
import {Payment} from '../../src/payments/payment.entity';
import {Product} from '../../src/products/product.entity';
import {Property} from '../../src/properties/property.entity';
import {User} from '../../src/users/user.entity';
import {OrderItems} from '../../src/orders/orderItems.entity';
import {CartItems} from '../../src/carts/cartItems.entity';
import {ValidationException} from '../validation.exception';
import {HttpValidationExceptionFilter} from '../http-validation-exception.filter';
import {CartFactory, ProductFactory} from '../factories.helper';
import {setupTestModule} from '../helpers';

describe('PATCH /carts/items/:id - validation tests', () => {
    let app: INestApplication;

    beforeEach(async () => {
        app = await setupTestModule();
    });
    afterEach(async () => {
        await app.close();
    })
    describe('validation tests', () => {
        it(`returns 400 and product_id.cannotBeForeignKey`, (done) => {
            /* const response = await request(app.getHttpServer())
                 .patch(`/carts/items/3`)
                 .send({quantity: 1, product_id: 3});
             expect(response.status).to.equal(400);
             expect(response.body.errorCodes).to.contain(
                 'product_id.cannotBeForeignKey',
             );*/

            const promise = request(app.getHttpServer())
                .patch('/carts/items/3')
                .send({quantity: 1, product_id: 3});
            promise.then(response => {
                expect(response.status).to.equal(400);
                expect(response.body.errorCodes).to.contain(
                    'product_id.cannotBeForeignKey',
                );
                done();
            }).catch(reason => done());
        });

        it(`returns 400 and product_id.notDefined`, async () => {
            const response = await request(app.getHttpServer())
                .patch(`/carts/items/3`)
                .send({quantity: 1});
            expect(response.status).to.equal(400);
            expect(response.body.errorCodes).to.contain('product_id.notDefined');
        });

        it(`returns 400 quantity.notDefined`, async () => {
            const cart = await CartFactory.get().create();
            const product = await ProductFactory.get().create();
            const response = await request(app.getHttpServer())
                .patch(`/carts/items/${cart.id}`)
                .send({product_id: product.id});
            expect(response.status).to.equal(400);
            expect(response.body.errorCodes).to.contain('quantity.notDefined');
            expect(response.body.errorCodes).not.to.contain(
                'product_id.cannotBeForeignKey',
            );
            expect(response.body.errorCodes).not.to.contain('product_id.notDefined');
        });

        it(`returns 400 quantity.lessThanMin`, async () => {
            const cart = await CartFactory.get().create();
            const product = await ProductFactory.get().create();
            const response = await request(app.getHttpServer())
                .patch(`/carts/items/${cart.id}`)
                .send({product_id: product.id, quantity: 0});
            expect(response.status).to.equal(400);
            expect(response.body.errorCodes).to.have.length(1);
            expect(response.body.errorCodes).to.contain('quantity.lessThanMin');
        });
    });
});
