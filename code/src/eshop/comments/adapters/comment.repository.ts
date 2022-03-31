import { getManager } from "typeorm";
import { Comment } from "../comment.entity";
import { CommentProvider, CommentProviderType } from "../ports/comment.provider";



export class CommentRepository implements CommentProvider {
    createRecord(data: CommentProviderType.CreateComment) {
        return getManager().save(Comment, data);
    }
    getRecords(product_id: number) {
        return getManager().find(Comment, {
            product: {
                id: product_id,
            }
        });
    }
    deleteRecord(data: Comment) {
        return getManager().delete(Comment, data);
    }
    updateRecord(comment: Comment, data: CommentProviderType.UpdateComment) {
        return getManager().update(Comment, comment, { content: data.content });
    }

}