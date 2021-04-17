export class Utils {
  static randomId(prefix: string, length: number = 5): string {
    const randomId = Math.random().toString(36).substr(2, length).toUpperCase();
    return `${prefix}_${randomId}_${Date.now()}`;
  }

  static fixNumber(value?: number | string, defaultNumber: number = 0): number | undefined {
    if (typeof value === 'string') {
      return value.toUpperCase() === 'N/A' ? defaultNumber : parseFloat(value);
    } else {
      return value;
    }
  }

  // static getContrastColor(color: string): string {
  //   color = color.replace('#', '');
  //   const r = parseInt(color.substr(0, 2), 16);
  //   const g = parseInt(color.substr(2, 2), 16);
  //   const b = parseInt(color.substr(4, 2), 16);
  //   const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  //   return yiq >= WHITE_CONTRAST_TRESHOLD ? 'black' : 'white';
  // }

  static shuffle<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  static randomItem<T>(items: T[]): T | undefined {
    return (items?.length && items[Math.floor(Math.random() * items.length)]) || undefined;
  }

  static minutesToHours(value: number): string {
    if (value < 60) {
      return `${value} m`;
    } else {
      // tslint:disable-next-line: no-bitwise
      return `${(value / 60) ^ 0} h ${value % 60}`;
    }
  }
}
