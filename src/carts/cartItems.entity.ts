import { Product } from "src/products/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";

@Entity()
export class CartItems {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @ManyToOne(() => Cart)
    cart: Cart;

    @ManyToOne(() => Product)
    item: Product
    
}