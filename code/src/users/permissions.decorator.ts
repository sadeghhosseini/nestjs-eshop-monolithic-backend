import { SetMetadata } from "@nestjs/common";
import { permissions } from './permission.seed';


export const PERMISSIONS_KEY = 'PERMISSIONS_KEY';
/**
 * 
 * @param permissions more than one permission is considered to be ORed 
 * @returns 
 */
export const RequirePermissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions)