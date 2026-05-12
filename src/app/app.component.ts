import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// nav bar
import { SideNavComponent } from "./@TheSideBar/side-nav/side-nav.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'our_helltrain';
}
