import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})

export class PasswordComponent implements OnInit {
  password: string;
  resetToken: null;
  confirmPassword: string;

  constructor(private authService: AuthenticationService,
    private route: ActivatedRoute,
    private notificationToasts: DataSharingService,
    private router: Router,
    private messageService: MessageService) {
    route.queryParams.subscribe(params => {
      this.resetToken = params['token'];
      this.password = '';
    });
  }

  ngOnInit() { }

  savePassword() {
    this.authService.changePassword(this.password, this.resetToken).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  handleResponse(data) {
    this.messageService.add({ severity: 'success', summary: 'Успішно виконано', detail: 'Пароль оновлено' });
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);
  }

  handleError(error) {
    this.notificationToasts.notify('error', 'Відхилено', 'Невдалось зберегти пароль');
  }
}


