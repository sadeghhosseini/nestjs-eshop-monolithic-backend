import { Category } from "src/categories/category.entity";
import { Comment } from "src/comments/comment.entity";
import { Image } from "src/images/image.entity";
import { Order } from "src/orders/order.entity";
import { OrderItems } from "src/orders/orderItems.entity";
import { Property } from "src/properties/property.entity";
import { ManyToMany, PrimaryGeneratedColumn, Column, OneToMany, JoinTable, Entity, ManyToOne, JoinColumn } from 'typeorm';

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
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @ManyToMany(
        () => Property,
        property => property.products,
        { onDelete: "CASCADE" }
    )
    @JoinTable({ name: 'products_properties', joinColumn: { name: 'product_id' }, inverseJoinColumn: { name: 'property_id' } })
    properties: Property[];

    @OneToMany(() => OrderItems, order => order.product)
    orders: Order[]; //all the orders which container this product

    @OneToMany(() => Comment, comment => comment.product)
    comments: Comment[];

    @ManyToMany(() => Image, image => image.products)
    @JoinTable({ name: "products_images", joinColumn: { name: 'product_id' }, inverseJoinColumn: { name: 'image_id' } })
    images: Image[];
}