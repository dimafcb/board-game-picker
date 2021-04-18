export type TimeToPlayName = 'Quick' | 'Normal' | 'Long' | 'Any';

export class TimeToPlay {
  constructor(public name: TimeToPlayName, public min: number, public max: number, public text?: string) {}
}
