import { Body, Controller, Delete, Get, Logger, Param, Patch, Post } from '@nestjs/common';
import { IdToEntity } from 'src/common/pipes/id-to-entity.pipe';
import { Product } from 'src/products/product.entity';
import { ProductsService } from 'src/products/products.service';
import { Comment } from './comment.entity';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller()
export class CommentsController {
    constructor(private service: CommentsService) {

    }
    @Post('/products/:id/comments')
    async create(@Param('id', new IdToEntity(Product, ['category'])) product: Product, @Body() body: CreateCommentDto) {
        try {
            await this.service.create(product, body);
            return;
        } catch(e) {
            Logger.error(e);
            throw e;
        }

    }

    @Get('/products/:id/comments')
    async getAll(@Param('id', new IdToEntity(Product)) product: Product) {
        try {
            return await this.service.getAll(product);
        } catch(e) {
            Logger.error(e);
            throw e;
        }
    }

    @Get('/comments/:id')
    get(@Param('id', new IdToEntity(Comment)) comment: Comment) {

    }

    @Delete('/comments/:id')
    async delete(@Param('id', new IdToEntity(Comment)) comment: Comment) {
        try {
            return await this.service.delete(comment);
        } catch(e) {
            Logger.error(e);
            throw e;
        }
    }

    @Patch('/comments/:id')
    async update(@Param('id', new IdToEntity(Comment)) comment: Comment, @Body() body: UpdateCommentDto) {
        try {
            return await this.service.update(comment, body);
        } catch(e) {
            Logger.error(e);
            throw e;
        }
    }
}
