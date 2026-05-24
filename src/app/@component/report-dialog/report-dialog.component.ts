import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AnnounDialogComponent } from '../announcement-dialog/announcement-dialog.component';

@Component({
  selector: 'app-report-dialog',
  imports: [MatDialogModule, MatButtonModule,FormsModule],
  templateUrl: './report-dialog.component.html',
  styleUrl: './report-dialog.component.scss',
})
export class ReportDialogComponent {
    constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ReportDialogComponent>
  ) {}
  data = inject(MAT_DIALOG_DATA);

  adminNote='';

  confirm(action: 'approve' | 'reject'){
    const confirmRef=this.dialog.open(AnnounDialogComponent);
    confirmRef.afterClosed().subscribe((confirmed)=>{
      if(confirmed==true)
      {
        this.dialogRef.close({ action, note: this.adminNote });
      }
    })
  }
}
