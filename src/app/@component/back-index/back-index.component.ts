import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-index',
  imports: [MatDividerModule, MatIconModule],
  templateUrl: './back-index.component.html',
  styleUrl: './back-index.component.scss',
})
export class BackIndexComponent {
  constructor(public router: Router) {}
  newuser: number = 12;
  dispute: number = 5;
  disputeCount: number = 5;
  pendingCount: number = 3;

  goReport(){
    this.router.navigate(['/report']);
  }

  goUser(){
    this.router.navigate(['/back_user'],
      {queryParams:{verifyStatus:"待審查"}});
  }
}
