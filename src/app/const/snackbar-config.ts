import { MatSnackBarConfig } from '@angular/material/snack-bar';

export const SNACKBAR_CONFIG = (error?: boolean): MatSnackBarConfig => ({
  duration: 3000,
  panelClass: error ? 'message-error' : 'message-ok',
  verticalPosition: 'top',
  horizontalPosition: 'center',
});
