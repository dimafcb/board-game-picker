import { Provider } from '@angular/core';
import { MatDateFormats, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';

const DATE_FORMAT: MatDateFormats = {
  ...MAT_NATIVE_DATE_FORMATS,
  display: {
    ...MAT_NATIVE_DATE_FORMATS.display,
    dateInput: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    } as Intl.DateTimeFormatOptions,
  },
};

export const DATE_PROVIDER: Provider = { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT };
