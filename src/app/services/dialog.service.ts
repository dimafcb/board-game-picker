import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DialogResult } from '../model/dialog-result';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  open<T>(component: ComponentType<T>, config?: MatDialogConfig, callback?: (dialogRef: MatDialogRef<T>) => void): Promise<DialogResult> {
    const dialogRef = this.dialog.open(component, config);
    if (callback) {
      callback(dialogRef);
    }
    return dialogRef.afterClosed().toPromise();
  }
}
