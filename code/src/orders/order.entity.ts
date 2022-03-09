import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Payment } from "../payments/payment.entity";
import { Product } from "../products/product.entity";
import { User } from "../users/user.entity";
import { OrderAddress } from "./orderAddress.entity";
import { OrderItems } from "./orderItems.entity";

enum Status {
    processing = 'processing',
    processed = 'processed',
    shipped = 'shipped',
}

@Entity({ name: 'orders' })
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: Status;

    @ManyToOne(() => User, user => user.orders)
    customer: User;

    @OneToOne(() => OrderAddress)
    address: OrderAddress;

    @OneToMany(() => OrderItems, otp => otp.order)
    items: Product[];

    @OneToOne(() => Payment)
    payment: Payment;
}