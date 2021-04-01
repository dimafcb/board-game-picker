import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DialogResult } from '../model/dialog-result';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  open<T>(component: ComponentType<T>, config: MatDialogConfig, callback: (dialogRef: MatDialogRef<T>) => void): Observable<DialogResult> {
    const dialogRef = this.dialog.open(component, config);
    callback(dialogRef);
    return dialogRef.afterClosed();
  }
}
