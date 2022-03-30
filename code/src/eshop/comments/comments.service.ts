import {ForbiddenException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Product} from 'src/eshop/products/product.entity';
import {Repository} from 'typeorm';
import {Comment} from './comment.entity';
import {CreateCommentDto} from './dto/create-comment.dto';
import {User} from "../../users/user.entity";

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private repository: Repository<Comment>
    ) {
    }

    create(product: Product, body: CreateCommentDto) {
        if (body?.parent_id) {//comment is a reply
            const comment = {
                content: body?.content,
                parentComment: {
                    id: body?.parent_id,
                }
            }
            return this.repository.save(comment);
        } else {
            const comment = {
                content: body?.content,
                product: {
                    id: product.id,
                }
            }
            return this.repository.save(comment);
        }
    }

    getAll(product: Product) {
        return this.repository.find({
            product: {
                id: product.id,
            }
        });
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
        return this.repository.delete(comment);
    }

    update(user: User, comment: Comment, data: { content: string }) {
        const isOwnComment = comment?.commenter?.id == user.id;
        if (isOwnComment) {
            return this.repository.update(comment, {content: data.content});
        }
        throw new ForbiddenException();
    }
}
