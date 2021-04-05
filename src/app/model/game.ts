export interface Game {
  id: string;
  name: string;
  playersMin: number; // min players to play
  playersMax: number; // max players to play
  averageTimeToPlay: number; // average time to play in minutes
  dateCreated: number;
  rating?: number; // combined rating
  photo?: string;
  description?: string;

  // bgg
  idBgg?: number;
  ratingBgg?: number;

  // temporary
  disabled?: boolean;
}
