import {INestApplication} from '@nestjs/common';
import {Address} from 'src/eshop/addresses/address.entity';
import {AddressFactory, UserFactory} from 'test/factories.helper';
import {assertIsEqualArrayOfObjects, assertIsEqualObject} from 'test/test-helpers/assertion.helper';
import {getManager} from 'typeorm';
import {setupTestModule} from '../test-helpers/setup-test-module.helper';
import {request} from '../test-helpers/request.helper';
import {queries} from "../test-helpers/query.helper";

describe('AddressController - e2e', () => {
    describe('GET /addresses', () => {
        let app: INestApplication;
        beforeEach(async () => {
            app = await setupTestModule();
        });
        afterEach(async () => {
            await app.close();
        });

        it('returns 200 - gets all addresses for view-address-any', async () => {
            const addresses = await AddressFactory.get().count(5).create();
            const response = await request.authenticate(app, {permissions: ['view-address-any']}).get(app, '/addresses');
            expect(response.status).toEqual(200);
            expect(response.body.length).toEqual(addresses.length);
        });

        it('returns 200 - gets all addresses for view-address-own', async () => {
            const currentUser = await UserFactory.get().create();
            const addresses = await AddressFactory.get().count(5).create();
            const ownAddresses = await AddressFactory.get().count(3).create({customer: {id: currentUser.id}});
            const response = await request.authenticate(app, {
                user: currentUser,
                permissions: ['view-address-own']
            }).get(app, '/addresses');
            expect(response.status).toEqual(200);
            expect(response.body.length).toEqual(ownAddresses.length);
            assertIsEqualArrayOfObjects(ownAddresses, response.body, 'id', ['id', 'province', 'city'])
        });

        it('returns 403 - no required permissions', async () => {
            const addresses = await AddressFactory.get().count(5).create();
            const response = await request.authenticate(app).get(app, '/addresses');
            expect(response.status).toEqual(403);
        });

        it('returns 401 - unauthenticated', async () => {
            const addresses = await AddressFactory.get().count(5).create();
            const response = await request.get(app, '/addresses');
            expect(response.status).toEqual(401);
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

        it('returns 201 - gets any addresses', async () => {
            const address = await AddressFactory.get().create();
            const response = await request.authenticate(app, {permissions: ['view-address-any']}).get(app, `/addresses/${address.id}`);
            expect(response.status).toEqual(200);
            assertIsEqualObject(address, response.body, ['province', 'city', 'id']);
        });

        it('returns 201 - gets own addresses', async () => {
            const currentUser = await UserFactory.get().create();
            const address = await AddressFactory.get().create({customer: {id: currentUser.id}});
            const response = await request.authenticate(app, {
                user: currentUser,
                permissions: ['view-address-own']
            }).get(app, `/addresses/${address.id}`);
            expect(response.status).toEqual(200);
            assertIsEqualObject(address, response.body, ['province', 'city', 'id']);
        });

        it('returns 403 - no permission', async () => {
            const currentUser = await UserFactory.get().create();
            const address = await AddressFactory.get().create({customer: {id: currentUser.id}});
            const response = await request.authenticate(app, {
                user: currentUser,
                permissions: []
            }).get(app, `/addresses/${address.id}`);
            expect(response.status).toEqual(403);
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
            const user = await UserFactory.get().create();
            const address = await AddressFactory.get().make();
            const response = await request.authenticate(app, {
                user,
                permissions: ['add-address-own']
            }).post(app, '/addresses', address);
            expect(response.status).toBe(201);
            const records = await getManager().find(Address, {relations: ['customer']});
            expect(records.length).toBe(1);
            expect(records.pop().customer.id).toEqual(user.id);
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

        it("returns 200 - updates own address", async () => {
            const user = await UserFactory.get().create();
            const address = await AddressFactory.get().create({customer: {id: user.id}});
            const anotherAddress = await AddressFactory.get().make();
            const response = await request.authenticate(app, {
                user,
                permissions: ['edit-address-own']
            }).patch(app, `/addresses/${address.id}`, {
                province: anotherAddress.province,
                city: anotherAddress.city
            });
            expect(response.status).toBe(200);
            const addressRecord = await getManager().findOne(Address, address.id);
            expect(addressRecord.province).toEqual(anotherAddress.province)
            expect(addressRecord.city).toEqual(anotherAddress.city);
        });

        it("returns 403 - updates other user's address", async () => {
            const address = await AddressFactory.get().create();
            const anotherAddress = await AddressFactory.get().make();
            const response = await request.authenticate(app, {permissions: ['edit-address-own']}).patch(app, `/addresses/${address.id}`, {
                province: anotherAddress.province,
                city: anotherAddress.city
            });
            expect(response.status).toBe(403);
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
            const user = await UserFactory.get().create();
            const address = await AddressFactory.get().create({customer: {id: user.id}});
            const response = await request.authenticate(app, {user, permissions: ['delete-address-own']}).delete(app, `/addresses/${address.id}`);
            expect(response.status).toBe(200);
            const addressRecord = await getManager().findOne(Address, address.id);
            expect(addressRecord).toBeUndefined();
        });

        it("returns 403 - updates other user's address", async () => {
            const address = await AddressFactory.get().create();
            const response = await request.authenticate(app, {permissions: ['delete-address-own']}).delete(app, `/addresses/${address.id}`);
            expect(response.status).toBe(403);
        });

    });
});