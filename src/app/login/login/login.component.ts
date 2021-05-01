import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { PageTitleService } from '../../services/pageTitle.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [PageTitleService]
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthenticationService, private router: Router, private pageTitle: PageTitleService) {
    this.userName = null;
    this.password = null;
  }

  userName: string;
  password: string;
  errorMessage: string;

  ngOnInit() {
    this.pageTitle.setTitle('Католицька Школа - Вхід');
  }
  Login() {
    this.authService.login(this.userName, this.password)
      .subscribe((result) => {
        this.errorMessage = null;
        if (this.authService.getRole()) {
          this.router.navigate([this.authService.defaultRoute()]);
        }
      },
        error => {
          if (error.error.status.message) {
            this.errorMessage = 'Ви ввели невірні дані';
          }
        });
  }
}
