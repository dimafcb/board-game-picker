export type TimeToPlayName = 'Quick' | 'Normal' | 'Long' | 'Any';

export class TimeToPlay {
  name: TimeToPlayName;
  min: number;
  max: number;
  text?: string;

  constructor(name: TimeToPlayName, min: number, max: number, text?: string) {
    this.name = name;
    this.min = min;
    this.max = max;
    this.text = text;
  }
}
