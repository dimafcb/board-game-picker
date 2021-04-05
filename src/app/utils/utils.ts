export class Utils {
  static randomId(length: number = 5): string {
    return Math.random().toString(36).substr(2, length).toUpperCase() + '_' + Date.now();
  }

  static randomName(length: number = 6): string {
    return Math.random().toString(36).substr(2, length).toUpperCase();
  }

  // static getWheelColor(index: number): string {
  //   return WHEEL_COLORS[index % WHEEL_COLORS.length];
  // }

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

  static randomItem<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
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
