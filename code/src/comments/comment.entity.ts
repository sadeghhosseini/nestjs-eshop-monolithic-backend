import { Product } from "src/products/product.entity";
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

    @ManyToOne(() => Comment)
    replies: Comment[];

    @OneToMany(() => Comment, comment => comment.replies)
    parentComment: Comment;

    @ManyToOne(() => User)
    commenter: User;
}