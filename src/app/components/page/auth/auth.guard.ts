import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map, take } from "rxjs";
import { AuthService } from "../../../services/auth.service";


@Injectable({providedIn: "root"})
export class AuthGuard implements CanActivate{
    constructor(
        private authService: AuthService,
        private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.authService.user.pipe(
            take(1),
            map(user => {
                if (user) {
                    // If user is logged in 
                    if (route.routeConfig?.path === 'auth/login' || route.routeConfig?.path === 'auth/register') {
                        return this.router.createUrlTree(['/account/profile']); 
                    }
                    return true; 
                }   //if user is not logged in but want to visit login and register
                else if(route.routeConfig?.path === 'auth/login' || route.routeConfig?.path === 'auth/register') {
                    return true;
                }
            //If user is not authenticated for protected pages
            return this.router.createUrlTree(["/auth/login"]);
        }));
    }
}