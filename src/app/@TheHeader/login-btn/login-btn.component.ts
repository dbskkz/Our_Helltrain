import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-btn',
  imports: [],
  templateUrl: './login-btn.component.html',
  styleUrl: './login-btn.component.scss'
})
export class LoginBtnComponent {
  constructor(
      private router: Router
    ){}

  goToSigninPage() {
    this.router.navigate(['/login_register'], { queryParams: { mode: 'login' } });
  }

  goToRegister() {
    this.router.navigate(['/login_register'], { queryParams: { mode: 'register' } });
  }
}
