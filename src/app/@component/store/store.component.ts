import { Component } from '@angular/core';
import {
  LucideAngularModule,
  User,
  BookText,
  MapPin,
  School,
  MessageCircleMore,
  HeartPlus,
  Pencil,
  ArrowRight,
} from 'lucide-angular';

@Component({
  selector: 'app-store',
  imports: [LucideAngularModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss',
})
export class StoreComponent {
  // Declare icon
  readonly User = User;
  readonly BookText = BookText;
  readonly MapPin = MapPin;
  readonly School = School;
  readonly MessageCircleMore = MessageCircleMore;
  readonly HeartPlus = HeartPlus;
  readonly Pencil = Pencil;
  readonly ArrowRight = ArrowRight;

  isOwner: boolean = false;
}
