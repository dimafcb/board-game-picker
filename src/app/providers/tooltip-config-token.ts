import { Provider } from '@angular/core';
import { MatTooltipDefaultOptions, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';

export const MAT_TOOLTIP_CONFIG: Provider = {
  provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
  useValue: {
    position: 'below',
    showDelay: 1000,
  } as MatTooltipDefaultOptions,
};
