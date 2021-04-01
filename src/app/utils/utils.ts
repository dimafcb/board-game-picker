export class Utils {
  static randomId(length: number = 5): string {
    return Math.random().toString(36).substr(2, length).toUpperCase() + '_' + Date.now();
  }

  static randomName(length: number = 6): string {
    return Math.random().toString(36).substr(2, length).toUpperCase();
  }
}
