import { Order } from "src/orders/order.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'payments' })
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Order)
    @JoinColumn()
    order: Order;
}