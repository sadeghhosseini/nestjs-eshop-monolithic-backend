import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/eshop/products/product.entity';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from "../../users/user.entity";
import { CommentUseCase, CommentUseCaseType } from './ports/comment.usecase';
import { CommentProvider } from './ports/comment.provider';

@Injectable()
export class CommentsService implements CommentUseCase {
    constructor(
        private commentProvider: CommentProvider,
    ) {

    }

    create(product: Product, body: CommentUseCaseType.createComment) {
        if (body?.parent_id) {//comment is a reply
            const comment = {
                content: body?.content,
                parentComment: {
                    id: body?.parent_id,
                }
            }
            return this.commentProvider.createRecord(comment);
        } else {
            const comment = {
                content: body?.content,
                product: {
                    id: product.id,
                }
            }
            return this.commentProvider.createRecord(comment);
        }
    }

    getAll(product: Product) {
        return this.commentProvider.getRecords(product.id);
    }

    delete(user: User, comment: Comment) {
        const permissions = user.permissions.map(p => p.title);
        const canDeleteAnyComment = permissions.includes('delete-comment-any');
        const canDeleteOwnComment = permissions.includes('delete-comment-own');
        const isOwnComment = user.id == comment?.commenter?.id;
        const permitted = canDeleteAnyComment || (canDeleteOwnComment && isOwnComment);
        if (!permitted) {
            throw new ForbiddenException();
        }
        return this.commentProvider.deleteRecord(comment);
    }

    update(user: User, comment: Comment, data: CommentUseCaseType.updateComment) {
        const isOwnComment = comment?.commenter?.id == user.id;
        if (isOwnComment) {
            return this.commentProvider.updateRecord(comment, { content: data.content });
        }
        throw new ForbiddenException();
    }
}
