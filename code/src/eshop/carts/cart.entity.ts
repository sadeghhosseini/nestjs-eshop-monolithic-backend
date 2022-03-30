import { User } from "src/users/user.entity";
import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartItems } from "./cartItems.entity";

@Entity({ name: 'carts' })
export class Cart {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    @JoinColumn()
    owner: User;

    @OneToMany(() => CartItems, ctp => ctp.cart)
    items: CartItems[];
}