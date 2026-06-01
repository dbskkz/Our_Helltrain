import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackSiderComponent } from '../back-sider/back-sider.component';

@Component({
  selector: 'app-back-layout',
  imports: [RouterOutlet,BackSiderComponent],
  templateUrl: './back-layout.component.html',
  styleUrl: './back-layout.component.scss'
})
export class BackLayoutComponent {

}
