import { Product } from "src/eshop/products/product.entity";
import { User } from "src/users/user.entity";
import { Comment } from "../comment.entity";


export abstract class CommentUseCase {
    abstract create(product: Product, comment: CommentUseCaseType.createComment);
    abstract getAll(product: Product);
    abstract delete(user: User, comment: Comment);
    abstract update(user: User, comment: Comment, data: CommentUseCaseType.updateComment);

}

export namespace CommentUseCaseType {
    export interface createComment {
        content: string;
        parent_id: number;
    }
    export interface updateComment {
        content: string;
    }
}