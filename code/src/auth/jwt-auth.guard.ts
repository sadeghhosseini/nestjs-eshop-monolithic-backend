import { AuthGuard } from "@nestjs/passport";



export class JwtAuthGuard extends AuthGuard('jwt-strategy') {//jwt-strategy is alias for JwtStrategy class => jwt.strategy.ts

} 