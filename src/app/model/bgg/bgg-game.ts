import { BggValueWrapper } from './bgg-value-wrapper';

export interface BggGame {
  id: number;
  name: BggValueWrapper;
  yearpublished?: BggValueWrapper;
}

export interface BggGameFull extends BggGame {
  image: string;
  minplayers: BggValueWrapper<number>;
  maxplayers: BggValueWrapper<number>;
  playingtime: BggValueWrapper<number>;
  description: string;
  statistics?: {
    ratings?: {
      average?: BggValueWrapper<number>;
    };
  };
}

export interface BggGameCollection {
  image: string;
  name?: {
    '#text': string;
  };
  objectid: number;
  stats?: {
    maxplayers: number;
    minplayers: number;
    playingtime: number;
    rating?: {
      average?: BggValueWrapper<number>;
      value?: number;
    };
  };
}
