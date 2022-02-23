import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'addresses' })
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    province: string;

    @Column()
    city: string;

    @Column()
    restOfAddress: string;

    @Column()
    postalCode: string;

    @ManyToOne(() => User, user => user.addresses)
    customer: User;
}