import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-back-header',
  imports: [LucideAngularModule,],
  templateUrl: './back-header.component.html',
  styleUrl: './back-header.component.scss'
})
export class BackHeaderComponent {
  constructor(private router:Router){}
  // Declare
  userName = "小明";

  logout(){
    this.router.navigate(['/login_register']);//連接到登入頁面
  }

  goTohome(){
    this.router.navigate(['/home']);
  }

}
