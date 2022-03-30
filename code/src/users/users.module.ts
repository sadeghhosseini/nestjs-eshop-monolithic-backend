import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, Reflector } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PermissionsGuard } from "./permissions.guard";
import { User } from "./user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";




@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
        ])
    ],
    controllers: [
        UsersController,
    ],
    providers: [
        UsersService,
        /* {
            provide: APP_GUARD,
            useClass: PermissionsGuard,
        } */
    ],
    exports: [
        UsersService,
    ],
})
export class UsersModule {}