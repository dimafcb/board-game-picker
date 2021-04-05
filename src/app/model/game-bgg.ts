interface ValueWrapper<T = string> {
  value: T;
}

export interface GameBgg {
  id: string;
  name: ValueWrapper;
  yearpublished?: ValueWrapper;
}

export interface GameBggFull extends GameBgg {
  image: string;
  minplayers: ValueWrapper;
  maxplayers: ValueWrapper;
  playingtime: ValueWrapper;
  description: string;
}
