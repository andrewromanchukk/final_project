import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public Url = 'signin';
  private refreshUrl = 'refresh';
  private tokenRefreshMinPeriod: number;
  private tokenRefreshTimestamp: number;
  private _idUser: number;

  private tokenExpireTimerId: any;

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) {
    this.tokenRefreshMinPeriod = 1000 * 60 * 5;
  }

  login(userName: string, password: string) {
    const userData = { username: userName, password: password };
    return this.httpClient
      .post(this.Url, userData, { observe: 'response' })
      .map((response: any) => {
        if (response.status === 204) {
          this.setToken(response.headers.get('Authorization'));
        }
        return response;
      });
  }

  changePassword(password, resetToken) {
    return this.httpClient.put('resetPassword', { password: password, token: resetToken });
  }

  public requestPasswordReset(query: string): Observable<any> {
    return this.httpClient.get(`requestPasswordReset?query=${query}`);
  }

  get idUser(): number {
    if (this._idUser) {
      return this._idUser;
    } else {
      const token = localStorage.getItem('authToken');
      if (token) {
        const jwtHelper = new JwtHelperService();
        const decodedToken = jwtHelper.decodeToken(token);
        this._idUser = decodedToken.jti;
        return this._idUser;
      } else {
        console.error('Token not found!!!');
      }
    }
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  logOut() {
    this.tokenRefreshTimestamp = null;
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);


    if (this.tokenExpireTimerId) {
      clearTimeout(this.tokenExpireTimerId);
    }
  }

  loggedIn() {
    return !!localStorage.getItem('authToken');
  }

  getRole(): string {
    return this.getDecodedToken().Roles.authority;
  }

  getRoleLocalizedName(): string {
    switch (this.getRole()) {
      case 'ROLE_ADMIN':
        return 'Адміністратор';
      case 'ROLE_TEACHER':
        return 'Вчитель';
      case 'ROLE_USER':
        return 'Користувач';
    }
  }

  defaultRoute() {
    let route: string;
    const role = this.getRole();
    switch (role) {
      case 'ROLE_ADMIN':
        route = '/shell/admin-panel/';
        break;
      case 'ROLE_TEACHER':
        route = '/shell/journal';
        break;
      case 'ROLE_USER':
        route = '/shell/student-book';
        break;
    }
    return route;
  }

  isAdmin() {
    return this.getRole() === 'ROLE_ADMIN';
  }

  refreshToken() {
    if (!this.loggedIn()) {
      return;
    }
    const curTime = new Date().getTime();
    if (this.tokenRefreshTimestamp) {
      const timeFromlastRefresh = curTime - this.tokenRefreshTimestamp;
      if (timeFromlastRefresh < this.tokenRefreshMinPeriod) {
        return;
      }
    }
    this.httpClient.get(this.refreshUrl, { observe: 'response' })
      .subscribe(
        (response) => {
          this.setToken(response.headers.get('Authorization'));
        },
        (err) => {
          // ---
          // problem: backend should return 401 "Token Expired" if token is expired but returns 400 "Bad Token"
          // hack: if response code is 400 call onTokenExpired
          if (err.status === 400) {
            this.onTokenExpired();
          }
          // ---
          console.warn('failed to refresh token with error: ' + JSON.stringify(err));
        });
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const jwtHelper = new JwtHelperService();
    const decodedToken = jwtHelper.decodeToken(token);
    return decodedToken;
  }

  getCurrentUserId(): string {
    return this.getDecodedToken().jti;
  }

  private setToken(token) {
    const curTime = new Date().getTime();
    this.tokenRefreshTimestamp = curTime;
    localStorage.setItem('authToken', token);
    this.setTokenExpireTimeout();
  }
  private setTokenExpireTimeout() {
    if (this.tokenExpireTimerId) {
      clearTimeout(this.tokenExpireTimerId);
    }
    const token = this.getDecodedToken();
    const timeoutSeconds = token.exp - token.iat;

    const thisRef = this;
    this.tokenExpireTimerId = setTimeout(() => { thisRef.onTokenExpired(); }, timeoutSeconds * 1000);
  }

  private onTokenExpired() {
    this.logOut();
  }

}
