import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-announcement-dialog',
  imports: [MatDialogModule,MatButtonModule,],
  templateUrl: './announcement-dialog.component.html',
  styleUrl: './announcement-dialog.component.scss',
})
export class AnnounDialogComponent {
}
