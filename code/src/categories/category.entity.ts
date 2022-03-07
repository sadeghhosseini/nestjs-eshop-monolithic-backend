import { Product } from 'src/products/product.entity';
import { Property } from 'src/properties/property.entity';
import { OneToMany, ManyToOne, JoinTable, Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @ManyToOne(() => Category, category => category.children)
    parent: Category;

    @OneToMany(() => Category, category => category.parent)
    children: Category[];

    @OneToMany(() => Property, property => property.category)
    properties: Property[];

    @OneToMany(() => Product, product => product.category)
    products: Product[];
}