import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {Observable} from "rxjs";
import {PERMISSIONS_KEY,} from "./permissions.decorator";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredPermissionTitles = this.reflector.getAllAndOverride(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredPermissionTitles) {
            return true;
        }

        const {user} = context.switchToHttp().getRequest();
        // const jwt = context.switchToHttp().getRequest().headers['authorization'].split('Bearer ')[1];

        if (!user) {
            return false;
        }
        return requiredPermissionTitles.some(title => {
            return user.permissions.map(p => p.title).includes(title);
        });
    }

}