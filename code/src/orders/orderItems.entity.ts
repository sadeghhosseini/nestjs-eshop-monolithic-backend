import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../products/product.entity";
import { Order } from "./order.entity";

@Entity({ name: 'order_items' })
export class OrderItems {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    quantity: number;

    @OneToMany(() => Order, order => order.items)
    order: Order;

    @OneToMany(() => Product, product => product.orders)
    product: Product;
}