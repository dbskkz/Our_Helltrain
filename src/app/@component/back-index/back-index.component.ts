import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-back-index',
  imports: [ MatDividerModule, MatIconModule],
  templateUrl: './back-index.component.html',
  styleUrl: './back-index.component.scss'
})
export class BackIndexComponent {
newuser: number = 12;
dispute: number = 5;
disputeCount: number = 5;
pendingCount: number = 3;
}
