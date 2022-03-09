import {ManyToMany, PrimaryGeneratedColumn, Column, OneToMany, JoinTable, Entity, ManyToOne, JoinColumn} from 'typeorm';
import { Category } from '../categories/category.entity';
import { Comment } from '../comments/comment.entity';
import { Image } from '../images/image.entity';
import { Order } from '../orders/order.entity';
import { OrderItems } from '../orders/orderItems.entity';
import { Property } from '../properties/property.entity';

@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn()
    id: number;


    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    quantity: number;

    @Column()
    price: number;

    @ManyToOne(() => Category)
    @JoinColumn({name: 'category_id'})
    category: Category;

    @ManyToMany(() => Property, property => property.products)
    properties: Property[];

    @OneToMany(() => OrderItems, order => order.product)
    orders: Order[]; //all the orders which container this product

    @OneToMany(() => Comment, comment => comment.product)
    comments: Comment[];

    @ManyToMany(() => Image, image => image.products)
    @JoinTable({ name: "products_images" })
    images: Image[];
}