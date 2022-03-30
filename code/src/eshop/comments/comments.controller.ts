import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IdToEntity } from 'src/common/pipes/id-to-entity.pipe';
import { Product } from 'src/eshop/products/product.entity';
import { ProductsService } from 'src/eshop/products/products.service';
import { RequirePermissions } from 'src/users/permissions.decorator';
import { PermissionsGuard } from 'src/users/permissions.guard';
import { Comment } from './comment.entity';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller()
export class CommentsController {
    constructor(private service: CommentsService) {

    }
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('add-comment')
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

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('delete-comment-own', 'delete-comment-any')
    @Delete('/comments/:id')
    async delete(@Request() request, @Param('id', new IdToEntity(Comment, ['commenter'])) comment: Comment) {
        try {
            return await this.service.delete(request.user, comment);
        } catch(e) {
            Logger.error(e);
            throw e;
        }
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('edit-comment-own')
    @Patch('/comments/:id')
    async update(@Request() request, @Param('id', new IdToEntity(Comment, ['commenter'])) comment: Comment, @Body() body: UpdateCommentDto) {
        try {
            return await this.service.update(request.user, comment, body);
        } catch(e) {
            Logger.error(e);
            throw e;
        }
    }
}
