import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-back-index',
  imports: [MatButtonModule, MatDividerModule, MatIconModule],
  templateUrl: './back-index.component.html',
  styleUrl: './back-index.component.scss'
})
export class BackIndexComponent {
newuser: number = 0;
dispute: number = 0;
disputeCount: number = 0;
pendingCount: number = 0;
}
