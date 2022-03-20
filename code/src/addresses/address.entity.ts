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

    @Column({ name: 'rest_of_address' })
    rest_of_address: string;

    @Column({ name: 'postal_code' })
    postal_code: string;

    @ManyToOne(() => User, user => user.addresses)
    customer: User;
}