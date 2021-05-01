import { Injectable } from '@angular/core';
import { CanLoad, CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AdminGuard implements CanLoad, CanActivate {

  constructor(private _authService: AuthenticationService,
    private router: Router) { }

  canLoad(): boolean {
    return this.canActivateInternal();
  }

  canActivate(): boolean {
    return this.canActivateInternal();
  }

  private canActivateInternal(): boolean {
    if (this._authService.isAdmin()) {
      return true;
    }
    this.router.navigate([this._authService.defaultRoute()]);
    return false;
  }
}
