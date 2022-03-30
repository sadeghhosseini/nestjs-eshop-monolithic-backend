import { EntityRepository, getManager, Repository } from "typeorm";
import { Permission } from "./permission.entity";
import { User } from "./user.entity";


@EntityRepository(User)
export class UserRepository extends Repository<User>{
    async addPermission(permissionTitle: string, userId: number) {
        const user = await this.findOne(userId, { relations: ['permissions'] });
        const permission = await getManager().findOne(Permission, { title: permissionTitle });

        if (!user.permissions.find(perm => perm.title === permission.title)) {
            user.permissions.push(permission);
        }
        return await this.save(user);
    }
    async addPermissions(permissionTitles: string[], userId: number) {
        const user = await this.findOne(userId, { relations: ['permissions'] });
        const permissions = await getManager().createQueryBuilder()
            .from(Permission, 'perm')
            .where('perm.title IN (:...titles)', { titles: permissionTitles })
            .getMany();

        for(const perm of permissions) {
            if(!user.permissions.find(p => p.title === perm.title)) {
                user.permissions.push(perm);
            }
        }
        return this.save(user);
    }
}