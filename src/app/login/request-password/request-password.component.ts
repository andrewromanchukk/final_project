import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PageTitleService } from '../../services/pageTitle.service';

@Component({
  selector: 'app-password',
  templateUrl: './request-password.component.html',
  styleUrls: ['./request-password.component.scss'],
  providers: [PageTitleService]
})

export class RequestPasswordComponent implements OnInit {

  constructor(private authService: AuthenticationService, private pageTitle: PageTitleService) {
    this.userName = '';
  }
  userName: string;
  succsess: boolean;

  ngOnInit() {
    this.pageTitle.setTitle('Католицька Школа - Відновлення Паролю');
  }

  Submit() {
    this.authService.requestPasswordReset(this.userName)
      .subscribe((response) => {
        if (response.status.code === 200) {
          this.succsess = true;
        }
      });
  }
}

