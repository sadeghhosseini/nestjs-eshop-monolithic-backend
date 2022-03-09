import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "../orders/order.entity";

@Entity({ name: 'payments' })
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Order)
    @JoinColumn()
    order: Order;
}