import { INestApplication } from '@nestjs/common';
import { Address } from 'src/addresses/address.entity';
import { AddressFactory } from 'test/factories.helper';
import { assertIsEqualObject } from 'test/test-helpers/assertion.helper';
import { getManager } from 'typeorm';
import { setupTestModule } from '../test-helpers/setup-test-module.helper';
import { request } from '../test-helpers/request.helper';
describe('AddressController - e2e', () => {

    describe('GET /addresses', () => {
        let app: INestApplication;
        beforeEach(async () => {
            app = await setupTestModule();
        });
        afterEach(async () => {
            await app.close();
        });

        it('returns 201 - gets addresseses', async () => {
            const addresses = await AddressFactory.get().count(5).create();
            const response = await request.get(app, '/addresses');
            expect(response.status).toEqual(200);
            expect(response.body.length).toEqual(addresses.length);
        });

    });
    describe('GET /addresses/{id}', () => {
        let app: INestApplication;
        beforeEach(async () => {
            app = await setupTestModule();
        });
        afterEach(async () => {
            await app.close();
        });

        it('returns 201 - gets addresses', async () => {
            const address = await AddressFactory.get().create();
            const response = await request.get(app, `/addresses/${address.id}`);
            expect(response.status).toEqual(200);
            assertIsEqualObject(address, response.body, ['province', 'city', 'id']);
        });

    });
    describe('POST /addresses', () => {
        let app: INestApplication;
        beforeEach(async () => {
            app = await setupTestModule();
        });
        afterEach(async () => {
            await app.close();
        });

        it('returns 201 - creates an address', async () => {
            const address = await AddressFactory.get().make();
            const response = await request.post(app, '/addresses', address);
            expect(response.status).toBe(201);
            const records = await getManager().find(Address, { relations: ['customer'] });
            expect(records.length).toBe(1);
            console.log(records);
        });

    });
    describe('PATCH /addresses', () => {
        let app: INestApplication;
        beforeEach(async () => {
            app = await setupTestModule();
        });
        afterEach(async () => {
            await app.close();
        });

        it('returns 200 - updates an address', async () => {
            const address = await AddressFactory.get().create();
            const anotherAddress = await AddressFactory.get().make();
            const response = await request.patch(app, `/addresses/${address.id}`, { province: anotherAddress.province, city: anotherAddress.city });
            expect(response.status).toBe(200);
            const addressRecord = await getManager().findOne(Address, address.id);
            expect(addressRecord.province).toEqual(anotherAddress.province)
            expect(addressRecord.city).toEqual(anotherAddress.city);
        });

    });


    describe('DELETE /addresses', () => {
        let app: INestApplication;
        beforeEach(async () => {
            app = await setupTestModule();
        });
        afterEach(async () => {
            await app.close();
        });

        it('returns 200 - updates an address', async () => {
            const address = await AddressFactory.get().create();
            const response = await request.delete(app, `/addresses/${address.id}`);
            expect(response.status).toBe(200);
            const addressRecord = await getManager().findOne(Address, address.id);
            expect(addressRecord).toBeUndefined();
        });

    });


});