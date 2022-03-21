import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/product.entity';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private repository: Repository<Comment>
    ) { }
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

    delete(comment: Comment) {
        return this.repository.delete(comment);
    }

    update(comment: Comment, data: { content: string }) {
        return this.repository.update(comment, { content: data.content });
    }
}
