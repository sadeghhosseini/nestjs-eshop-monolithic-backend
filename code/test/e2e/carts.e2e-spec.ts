import {
    INestApplication,
} from '@nestjs/common';
import {Cart} from 'src/eshop/carts/cart.entity';
import * as request from 'supertest';
import {
    CartFactory,
    ProductFactory,
} from 'test/factories.helper';
import { setupTestModule } from '../test-helpers/setup-test-module.helper';
import { CartsController } from 'src/eshop/carts/carts.controller';
import { CartsService } from 'src/eshop/carts/carts.service';
import { User } from 'src/users/user.entity';
import { CartItems } from 'src/eshop/carts/cartItems.entity';
import { Order } from 'src/eshop/orders/order.entity';
import { Address } from 'src/eshop/addresses/address.entity';

describe('PATCH /carts/items/:id - validation tests', () => {
    let app: INestApplication;
    beforeEach(async () => {
        app = await setupTestModule({
            controllers: [CartsController],
            providers: [CartsService],
        });
    });
    afterEach(async () => {
        await app.close();
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
