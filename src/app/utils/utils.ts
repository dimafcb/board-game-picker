export class Utils {
  static randomId(prefix: string, length: number = 5): string {
    const randomId = Math.random().toString(36).substr(2, length).toUpperCase();
    return `${prefix}_${randomId}_${Date.now()}`;
  }

  static fixNumber(value?: number | string, defaultNumber: number = 0): number | undefined {
    console.log('fixNumber..', value, typeof value);
    if (typeof value === 'string') {
      return value.toUpperCase() === 'N/A' ? defaultNumber : parseFloat(value);
    } else {
      return value;
    }
  }

  static sort<T>(array: T[], args: string[]): T[] {
    if (!array?.length) {
      return array;
    }

    args.forEach((arg) => {
      let ascending = true;

      if (arg.startsWith('-')) {
        arg = arg.substring(1);
        ascending = false;
      }

      array.sort((a: any, b: any) => {
        // obsluga nullowych/pustych wartosci
        if (a[arg] == null && b[arg] == null) {
          return 0;
        }

        if (a[arg] == null) {
          return -1;
        }
        if (b[arg] == null) {
          return 1;
        }
        if (ascending) {
          if (a[arg] < b[arg]) {
            return -1;
          } else if (a[arg] > b[arg]) {
            return 1;
          } else {
            return 0;
          }
        } else {
          if (a[arg] < b[arg]) {
            return 1;
          } else if (a[arg] > b[arg]) {
            return -1;
          } else {
            return 0;
          }
        }
      });
      return array;
    });
    return array;
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
