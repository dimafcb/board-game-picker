export interface GameDisabledStatus {
  text: string;
  cssClass?: string;
}

export interface Game {
  id: string;
  name: string;
  minPlayers: number; // min players to play
  maxPlayers: number; // max players to play
  averageTimeToPlay: number; // average time to play in minutes
  dateCreated: number;
  rating?: number; // combined rating
  image?: string;
  minAge?: number;

  // bgg
  bggId?: number;
  bggRating?: number;

  // temporary
  disabled?: boolean;
  disabledStatus?: GameDisabledStatus;
}
