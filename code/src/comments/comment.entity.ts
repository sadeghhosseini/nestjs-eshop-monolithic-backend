import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../products/product.entity";
import { User } from "../users/user.entity";

@Entity({ name: 'comments' })
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @ManyToOne(() => Product)
    product: Product;

    @ManyToOne(() => Comment)
    replies: Comment[];

    @OneToMany(() => Comment, comment => comment.replies)
    parentComment: Comment;

    @ManyToOne(() => User)
    commenter: User;
}