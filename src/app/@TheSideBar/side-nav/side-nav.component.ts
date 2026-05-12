import { Component } from '@angular/core';
// 素材庫
import { LucideAngularModule, Home, Book, Box,
  Smartphone, Handbag, Lamp, List, ChevronDown} from 'lucide-angular';

@Component({
  selector: 'app-side-nav',
  imports: [LucideAngularModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {
  // Declare icon
  readonly HomeIcon =Home;
  readonly BookIcon = Book;
  readonly BoxIcon = Box;
  readonly HandbagIcon = Handbag;
  readonly SmartphoneIcon = Smartphone;
  readonly LampIcon = Lamp;
  readonly ListIcon = List;
  readonly ChevronDownIcon = ChevronDown;

  // Switch
  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
