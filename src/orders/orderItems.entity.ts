import { Product } from "src/products/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()
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