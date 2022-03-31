import { Product } from "src/eshop/products/product.entity";
import { Comment } from "../comment.entity";
import { CommentUseCaseType } from "./comment.usecase";


export abstract class CommentProvider {
    abstract createRecord(data: CommentProviderType.CreateComment);
    abstract getRecords(product_id: number);
    abstract deleteRecord(data: Comment);
    abstract updateRecord(comment: Comment, data: CommentProviderType.UpdateComment);
}


export namespace CommentProviderType {
    export interface CreateComment {
        content: string;
        parentComment?: {
            id: number
        };
        product?: {
            id: number;
        }
    }
    export interface UpdateComment {
        content: string;
    }
}