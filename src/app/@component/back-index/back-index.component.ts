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
newuser=0;
dispute=0;
}
