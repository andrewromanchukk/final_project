import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RefreshTokenInterceptorService } from './refresh-token-interceptor.service';
import { AuthenticationService } from './authentication.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';


fdescribe('RefreshTokenInterceptorService', () => {
  let service: RefreshTokenInterceptorService;
  let http: HttpClient;
  let authserviceMock: any;
  beforeEach(() => {
    authserviceMock = {
      refreshToken: jasmine.createSpy('refreshToken'),
    };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RefreshTokenInterceptorService, {
        provide: HTTP_INTERCEPTORS,
        useClass: RefreshTokenInterceptorService,
        multi: true,
      }, { provide: AuthenticationService, useValue: authserviceMock }]
    });
    service = TestBed.get(RefreshTokenInterceptorService);
    http = TestBed.get(HttpClient);
  });

  fit('should be created', () => {
    expect(service).toBeTruthy();
  });

  fit('should call refreshToken() if url is not ended with refresh;',
    () => {
      http.get('test').subscribe((response) => { });
      expect(authserviceMock.refreshToken).
        toHaveBeenCalledWith();
    });

  fit('should not call refreshToken() if url is ended with refresh;',
    () => {
      http.get('refresh').subscribe((response) => { });
      expect(authserviceMock.refreshToken).not.
        toHaveBeenCalledWith();
    });
});

