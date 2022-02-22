import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, TableForeignKey } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class OrderAddress {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    province: string;

    @Column()
    city: string;

    @Column()
    restOfAddress: string;

    @Column()
    postalcode: string;

    @OneToOne(() => Order)
    @JoinColumn()
    order: Order;

}