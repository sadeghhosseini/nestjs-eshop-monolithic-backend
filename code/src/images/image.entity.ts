import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../products/product.entity";

@Entity({ name: 'images' })
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    path: string;

    @ManyToMany(() => Product, product => product.images)
    products: Product[];
}