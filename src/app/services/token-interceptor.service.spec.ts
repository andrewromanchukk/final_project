import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TokenInterceptorService } from './token-interceptor.service';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Router } from '@angular/router';


describe('TokenInterceptorService', () => {
  let service: TokenInterceptorService;
  let http: HttpClient;
  let backend: HttpTestingController;
  let authservice: AuthenticationService;
  beforeEach(() => {
    const router = {
      navigate: jasmine.createSpy('navigate'),
      url: 'test'
    };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        RouterTestingModule.withRoutes([])],
      providers: [TokenInterceptorService, HttpClient, {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptorService,
        multi: true,
      },
        { provide: AuthenticationService, useClass: MockAuthService }, { provide: Router, useValue: router }]
    });
    service = TestBed.get(TokenInterceptorService);
    backend = TestBed.get(HttpTestingController);
    http = TestBed.get(HttpClient);
    authservice = TestBed.get(AuthenticationService);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should append Auth header',
    () => {
      authservice.login('test', 'test1');
      http.get('test').subscribe((response) => { });
      const httpRequest = backend.expectOne(() => true);
      expect(httpRequest.request.headers.get('Authorization')).toEqual('MockToken');
    });

  it('baseUrl is appended',
    () => {
      authservice.login('test', 'test1');
      http.get('test').subscribe((response) => { });
      const httpRequest = backend.expectOne(() => true);
      expect(httpRequest.request.url).toEqual(service.baseUrl + '/test');
    });

  it('baseUrl is not appended for absolute url',
    () => {
      authservice.login('test', 'test1');
      http.get('http://test').subscribe((response) => { });
      const httpRequest = backend.expectOne(() => true);
      expect(httpRequest.request.url).toEqual('http://test');
    });

  it('redirects to login if not aunteticated', inject(
    [Router],
    (router) => {

      http.get('test').subscribe((response) => { });
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    }));

});
class MockAuthService {
  isLoggedIn = false;

  login(userName: string, password: string) {
    this.isLoggedIn = true;
    return Observable.of({});
  }

  changePassword(password, resetToken) {
    return Observable.of({});
  }

  public requestPasswordReset(query: string): Observable<any> {
    return Observable.of({});
  }

  get idUser(): number {
    return 0;
  }

  getToken() {
    if (this.loggedIn()) {
      return 'MockToken';
    }
    return null;
  }

  logOut() {
    this.isLoggedIn = false;
  }

  loggedIn() {
    return this.isLoggedIn;
  }

  getRole(): string {
    return '';
  }

  getRoleLocalizedName(): string {
    return '';
  }

  defaultRoute() {
    return '';
  }

  isAdmin() {
    return true;
  }

  refreshToken() {
    return Observable.of({});
  }

  getDecodedToken(): any {
    return {};
  }

  getCurrentUserId(): string {
    return '';
  }
}
