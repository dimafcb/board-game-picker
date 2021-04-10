import { BggValueWrapper } from './bgg-value-wrapper';

export interface BggGame {
  id: string;
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
