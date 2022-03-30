import { INestApplication } from "@nestjs/common";
import { Property } from "src/eshop/properties/property.entity";
import { CategoryFactory, PropertyFactory } from "test/factories.helper";
import { assertIsEqualObject } from "test/test-helpers/assertion.helper";
import { queries } from "test/test-helpers/query.helper";
import { request } from "test/test-helpers/request.helper";
import { setupTestModule } from "test/test-helpers/setup-test-module.helper";


describe('PropertiesController - e2e', () => {
    let app: INestApplication;
    beforeEach(async () => {
        app = await setupTestModule();
    });
    afterEach(async () => {
        await app.close();
    });
    describe('POST /properties', () => {
        it('returns 201 - creates a property', async () => {
            const property = await PropertyFactory.get().make();
            const response = await request.authenticate(app, {permissions: ['add-property']})
                .post(app, '/properties', {
                    title: property.title,
                    is_visible: property.is_visible,
                    category_id: property.category.id,
                });
            expect(response.status).toEqual(201);
            const foundProperty = await queries.findOne(Property, property.id, { relations: ['category'] });
            expect(foundProperty).toBeDefined();
            assertIsEqualObject(property, foundProperty, ['title'], {
                category_id: (actual, expected) => [actual.category.id, expected.category.id],
            })
        });
    });
    describe('GET /properties', () => {
        it('returns 200 - get list of all properties', async () => {
            const properties = await PropertyFactory.get().count(10).create();
            const response = await request.authenticate(app).get(app, '/properties');
            expect(response.status).toEqual(200);
            expect(response.body).toHaveLength(properties.length);
        })
    });
    describe('GET /properties/:id', () => {
        it('returns 200 - get a property by id', async () => {
            const property = await PropertyFactory.get().create();
            const response = await request.authenticate(app).get(app, `/properties/${property.id}`);
            expect(response.status).toEqual(200);
            assertIsEqualObject(response.body, property, ['id', 'title']);
        })
    });
    describe('PATCH /properties/:id', () => {
        it("returns 200 - updates a property's title", async () => {
            const property = await PropertyFactory.get().create();
            const newPropertyInfo = await PropertyFactory.get().make();
            const response = await request.authenticate(app, {permissions: ['edit-property-any']}).patch(app, `/properties/${property.id}`, {
                title: newPropertyInfo.title,
            });

            expect(response.status).toEqual(200);
            const foundProperty = await queries.findOne(Property, property.id);
            expect(foundProperty.title).toEqual(newPropertyInfo.title);
        });
        it("returns 200 - updates a property's category", async () => {
            const property = await PropertyFactory.get().create();
            const category = await CategoryFactory.get().create();
            const response = await request.authenticate(app, {permissions: ['edit-property-any']}).patch(app, `/properties/${property.id}`, {
                category_id: category.id,
            });
            expect(response.status).toEqual(200);
            const foundProperty = await queries.findOne(Property, property.id, { relations: ['category'] });
            expect(foundProperty.category.id).toEqual(category.id);
        });
    });
    describe('DELETE /properties/:id', () => {
        it('returns 200 - deletes a property', async () => {
            const property = await PropertyFactory.get().create();
            const response = await request.authenticate(app, {permissions: ['delete-property-any']}).delete(app, `/properties/${property.id}`);
            expect(response.status).toEqual(200);
            const foundProperty = await queries.findOne(Property, property.id);
            expect(foundProperty).toBeUndefined();
        });
    });
});