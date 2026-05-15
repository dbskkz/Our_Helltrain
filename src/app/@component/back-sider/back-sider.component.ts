import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LucideAngularModule, Home, Users, Handbag, Bell, ZodiacLibra,} from 'lucide-angular';
@Component({
  selector: 'app-back-sider',
  imports: [LucideAngularModule],
  templateUrl: './back-sider.component.html',
  styleUrl: './back-sider.component.scss'
})
export class BackSiderComponent {
    constructor(private router: Router){}

  // Declare icon
  readonly HomeIcon = Home;
  readonly UserIcon=Users;
  readonly HandbagIcon = Handbag;
  readonly BellIcon=Bell;
  readonly LibraIcon=ZodiacLibra;

  goToHome(){
    this.router.navigate(['/back_index'])
  }

  goToUser(){
    this.router.navigate(['/back_user']);
  }

  goToProduct(){
    this.router.navigate(['/back_product']);
  }

  goToReport(){
    this.router.navigate(['/report']);
  }

  goToAnnouncement(){
    this.router.navigate(['/announcement'])
  }
}
