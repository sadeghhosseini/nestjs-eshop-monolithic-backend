import { INestApplication } from '@nestjs/common';
import { Address } from 'src/addresses/address.entity';
import { AddressFactory, CommentFactory, ProductFactory } from 'test/factories.helper';
import { assertIsEqualObject } from 'test/test-helpers/assertion.helper';
import { getManager } from 'typeorm';
import { setupTestModule } from '../test-helpers/setup-test-module.helper';
import { request } from '../test-helpers/request.helper';
import { queries } from 'test/test-helpers/query.helper';
import { Product } from 'src/products/product.entity';
import { Comment } from 'src/comments/comment.entity';
describe('PropertiesController - e2e', () => {
    let app: INestApplication;
    beforeEach(async () => {
        app = await setupTestModule();
    });
    afterEach(async () => {
        await app.close();
    });

    describe('POST /products/:id/comments', () => {
        it('creates a comment on a product', async () => {
            const product = await ProductFactory.get().create();
            const comment = await CommentFactory.get().make();
            const response = await request.post(app, `/products/${product.id}/comments`, {
                content: comment.content,
            });
            expect(response.status).toEqual(201);
            const foundProduct = await queries.findOne(Product, product.id, { relations: ['comments'] });
            expect(foundProduct.comments).toHaveLength(1);
            assertIsEqualObject(foundProduct.comments[0], comment, ['content']);
        });
        it('replies to a comment', async () => {
            const product = await ProductFactory.get().create();
            const parentComment = await CommentFactory.get().create();
            const comment = await CommentFactory.get().make();
            const response = await request.post(app, `/products/${product.id}/comments`, {
                content: comment.content,
                parent_id: parentComment.id,
            });
            expect(response.status).toEqual(201)
        });
    });

    describe('GET /products/:id/comments', () => {
        it('gets all comments of a product', async () => {
            const product = await ProductFactory.get().create();
            const comments = await CommentFactory.get().count(30).create({ product });
            const response = await request.get(app, `/products/${product.id}/comments`);
            expect(response.status).toEqual(200);
            expect(response.body).toHaveLength(comments.length);
        });
    });

    describe('DELETE /comments/:id', () => {
        it('deletes a comment without any reply', async () => {
            const product = await ProductFactory.get().create();
            const comment = await CommentFactory.get().create({ product });
            const comment2 = await CommentFactory.get().create();
            const response = await request.delete(app, `/comments/${comment.id}`);
            expect(response.status).toEqual(200);
            const foundComment = await queries.findOne(Comment, { product: { id: product.id } });
            expect(foundComment).toBeUndefined();
        });

        it(`deletes a comments and all it's replies`, async () => {
            const product = await ProductFactory.get().create();
            const parentComment = await CommentFactory.get().create({ product });
            const child1Comment = await CommentFactory.get().create({ parentComment });
            const child2Comment = await CommentFactory.get().create({ parentComment });
            const grandChildComment = await CommentFactory.get().create({ parentComment: child2Comment });
            const response = await request.delete(app, `/comments/${parentComment.id}`);
            expect(response.status).toEqual(200);
            const allComments = await queries.find(Comment);
            expect(allComments).toHaveLength(0);
        });
    });
    describe('UPDATE /comments/:id', () => {
        it(`updates the content of a comment`, async () => {
            const product = await ProductFactory.get().create();
            const comment = await CommentFactory.get().create({ product });
            const changedContent = (await CommentFactory.get().create()).content;
            const response = await request.patch(app, `/comments/${comment.id}`, {
                content: changedContent,
            });
            expect(response.status).toEqual(200);
            const foundComment = await queries.findOne(Comment, { product: { id: product.id } });
            expect(foundComment.content).toEqual(changedContent);
        });
    });


});