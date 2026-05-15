import { Component } from '@angular/core';
import { BackHeaderComponent } from '../back-header/back-header.component';
import { RouterOutlet } from '@angular/router';
import { BackSiderComponent } from '../back-sider/back-sider.component';

@Component({
  selector: 'app-back-layout',
  imports: [BackHeaderComponent,RouterOutlet,BackSiderComponent],
  templateUrl: './back-layout.component.html',
  styleUrl: './back-layout.component.scss'
})
export class BackLayoutComponent {

}
