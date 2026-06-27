import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

export const roleGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const tokenStorage = inject(TokenStorageService);

  const allowedRoles = route.data['roles'] as string[];
  const user = tokenStorage.getUser();

  if (user && allowedRoles.includes(user.role)) {
    return true;
  }

  return router.createUrlTree(['/login']);
};