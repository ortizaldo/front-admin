import { inject, Injectable } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { TokenStorageService } from "../_services/token-storage.service";

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenStorage = inject(TokenStorageService);

  const allowedRoles = route.data["roles"] as string[];
  console.log("🚀 ~ roleGuard ~ allowedRoles:", allowedRoles);
  const user = tokenStorage.getUser();
  console.log("🚀 ~ roleGuard ~ user:", user);

  if (user && allowedRoles.includes(user.typeUser)) {
    return true;
  }

  return router.createUrlTree(["/login"]);
};
