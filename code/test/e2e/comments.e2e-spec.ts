import {INestApplication} from '@nestjs/common';
import {CommentFactory, ProductFactory, UserFactory} from 'test/factories.helper';
import {assertIsEqualObject} from 'test/test-helpers/assertion.helper';
import {setupTestModule} from '../test-helpers/setup-test-module.helper';
import {request} from '../test-helpers/request.helper';
import {queries} from 'test/test-helpers/query.helper';
import {Product} from 'src/eshop/products/product.entity';
import {Comment} from 'src/eshop/comments/comment.entity';

describe('CommentsController - e2e', () => {
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
            const response = await request.authenticate(app, {permissions: ['add-comment']}).post(app, `/products/${product.id}/comments`, {
                content: comment.content,
            });
            expect(response.status).toEqual(201);
            const foundProduct = await queries.findOne(Product, product.id, {relations: ['comments']});
            expect(foundProduct.comments).toHaveLength(1);
            assertIsEqualObject(foundProduct.comments[0], comment, ['content']);
        });
        it('replies to a comment', async () => {
            const product = await ProductFactory.get().create();
            const parentComment = await CommentFactory.get().create();
            const comment = await CommentFactory.get().make();
            const response = await request.authenticate(app, {permissions: ['add-comment']}).post(app, `/products/${product.id}/comments`, {
                content: comment.content,
                parent_id: parentComment.id,
            });
            expect(response.status).toEqual(201)
        });
    });
    describe('GET /products/:id/comments', () => {
        it('gets all comments of a product', async () => {
            const product = await ProductFactory.get().create();
            const comments = await CommentFactory.get().count(30).create({product});
            const response = await request.get(app, `/products/${product.id}/comments`);
            expect(response.status).toEqual(200);
            expect(response.body).toHaveLength(comments.length);
        });
    });
    describe('DELETE /comments/:id', () => {
        it('deletes own comment without any reply', async () => {
            const user = await UserFactory.get().create();
            const product = await ProductFactory.get().create();
            const comment = await CommentFactory.get().create({product, commenter: {id: user.id}});
            const comment2 = await CommentFactory.get().create();
            const response = await request.authenticate(app, {
                user,
                permissions: ['delete-comment-own']
            }).delete(app, `/comments/${comment.id}`);
            expect(response.status).toEqual(200);
            const foundComment = await queries.findOne(Comment, {product: {id: product.id}});
            expect(foundComment).toBeUndefined();
        });
        it(`deletes a comment and all it's replies`, async () => {
            const currentUser = await UserFactory.get().create();
            const product = await ProductFactory.get().create();
            const parentComment = await CommentFactory.get().create({product, commenter: {id: currentUser.id}});
            const child1Comment = await CommentFactory.get().create({parentComment});
            const child2Comment = await CommentFactory.get().create({parentComment});
            const grandChildComment = await CommentFactory.get().create({parentComment: child2Comment});
            const response = await request.authenticate(app, {
                user: currentUser,
                permissions: ['delete-comment-own']
            }).delete(app, `/comments/${parentComment.id}`);
            expect(response.status).toEqual(200);
            const allComments = await queries.find(Comment);
            expect(allComments).toHaveLength(0);
        });
        it(`deletes any comment`, async () => {
            const comment = await CommentFactory.get().create();
            const product = await ProductFactory.get().create({comments: [comment]});
            const response = await request.authenticate(app, {permissions: ['delete-comment-any']})
                .delete(app, `/comments/${comment.id}`);
            expect(response.status).toEqual(200);
            expect(await queries.findOne(Comment, comment.id)).toBeUndefined();
        });
        it(`delete another user's comment with delete-comment-own permission`, async() => {
            const commenter = await UserFactory.get().create();
            const comment = await CommentFactory.get().create({commenter});
            const response = await request.authenticate(app, {permissions: ['delete-comment-own']})
                .delete(app, `/comments/${comment.id}`);
            expect(response.status).toEqual(403);
        });
    });
    describe('UPDATE /comments/:id', () => {
        it(`updates the content of own comment`, async () => {
            const commenter = await UserFactory.get().create();
            const product = await ProductFactory.get().create();
            const comment = await CommentFactory.get().create({product, commenter});
            const changedContent = (await CommentFactory.get().create()).content;
            const response = await request.authenticate(app, {
                user: commenter,
                permissions: ['edit-comment-own']
            }).patch(app, `/comments/${comment.id}`, {
                content: changedContent,
            });
            expect(response.status).toEqual(200);
            const foundComment = await queries.findOne(Comment, {product: {id: product.id}});
            expect(foundComment.content).toEqual(changedContent);
        });
    });
});