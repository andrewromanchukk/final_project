import { Injectable } from '@angular/core';
import { CanLoad, Router, CanActivate, Route } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ShellGuard implements CanLoad, CanActivate {

  constructor(private authService: AuthenticationService,
    private router: Router) { }

  canLoad() {
    return this.isAllowed();
  }

  canActivate() {
    return this.isAllowed();
  }

  isAllowed(): boolean {
    if (this.authService.loggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
