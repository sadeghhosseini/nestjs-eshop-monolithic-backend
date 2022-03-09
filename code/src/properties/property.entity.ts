import {ManyToOne, ManyToMany, JoinTable, Column, PrimaryGeneratedColumn, Entity} from 'typeorm';
import { Category } from '../categories/category.entity';
import { Product } from '../products/product.entity';

@Entity({name: 'properties'})
export class Property {
    @PrimaryGeneratedColumn()
    id: number;


    @Column()
    title: string;

    @Column({name: 'is_visible'})
    isVisible: boolean;

    @ManyToOne(() => Category)
    category: Category;

    @ManyToMany(() => Product, product => product.properties)
    @JoinTable({name: 'products_properties'})
    products: Product[];
}