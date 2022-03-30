import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


@Entity({ name: 'permissions' })
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    title: string;

    @ManyToMany(() => User, user => user.permissions)
    users: User[];

}