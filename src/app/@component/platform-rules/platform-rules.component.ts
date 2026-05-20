import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MatDialogContent, MatDialogActions, MatDialogClose, MatDialogTitle } from "@angular/material/dialog";

@Component({
  selector: 'app-platform-rules',
  imports: [MatIcon, MatDialogContent, MatDialogActions,MatDialogTitle, MatDialogClose],
  templateUrl: './platform-rules.component.html',
  styleUrl: './platform-rules.component.scss'
})
export class PlatformRulesComponent {

}
