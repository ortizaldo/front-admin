import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private tokenService: TokenStorageService, private router: Router) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    console.log("🚀 ~ file: auth.guard.ts:17 ~ AuthGuard ~ url:", url)

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    console.log("🚀 ~ file: auth.guard.ts:22 ~ AuthGuard ~ checkLogin ~ url:", url)
    if (this.tokenService.getToken()) {
      return true;
    }

    this.authService.redirectUrl = url;

    this.router.navigate(['/auth/login']).then(() => console.log('Redirect to login'));

    return false;
  }
}
