import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// nav bar
import { TopNavComponent } from "./@TheHeader/top-nav/top-nav.component";
import { SideNavComponent } from "./@TheSideBar/side-nav/side-nav.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopNavComponent, SideNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'our_helltrain';
}
