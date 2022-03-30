import { Product } from "src/eshop/products/product.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'comments' })
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @ManyToOne(() => Product)
    product: Product;

    @OneToMany(() => Comment, comment => comment.parentComment)
    replies: Comment[];

    @ManyToOne(() => Comment, comment => comment.replies, { onDelete: 'CASCADE' })
    parentComment: Comment;

    @ManyToOne(() => User)
    commenter: User;
}