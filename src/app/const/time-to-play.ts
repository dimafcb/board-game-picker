import { TimeToPlay } from '../model/time-to-play';

export const TIME_TO_PLAY_LIST: TimeToPlay[] = [
  new TimeToPlay('Any', 0, 0),
  new TimeToPlay('Quick', 0, 30, '< 30m'),
  new TimeToPlay('Normal', 30, 90, '30m - 1.5h'),
  new TimeToPlay('Long', 90, 0, '1.5h +'),
];
