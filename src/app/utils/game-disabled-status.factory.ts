import { Game, GameDisabledStatus } from '../model/game';

const factory = (text: string, cssClass?: string): GameDisabledStatus => ({ text, cssClass });

export const GameDisabledFactory: { [key: string]: (game: Game) => GameDisabledStatus } = {
  MinPlayers: (game: Game) => factory(`Min. ${game.minPlayers} players`, 'min-players'),
  MaxPlayers: (game: Game) => factory(`Max. ${game.maxPlayers} players`, 'max-players'),
  MinTime: (game: Game) => factory(`Min. ${game.averageTimeToPlay} minutes`, 'min-time'),
  MinAge: (game: Game) => factory(`Min. ${game.minAge} years old`, 'min-age'),
};
