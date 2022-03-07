import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

@Controller()
export class CommentsController {
    @Post('/products/:id/comments')
    create(@Param('id') productId: string) {

    }

    @Get('/products/:id/comments')
    getAll(@Param('id') productId: string) {

    }

    @Get('/comments/:id')
    get(@Param('id') commentId: string) {

    }

    @Delete('/comments/:id')
    delete(@Param('id') commentId: string) {

    }

    @Patch('/comments/:id')
    update(@Param('id') $commentId: string) {

    }
}
