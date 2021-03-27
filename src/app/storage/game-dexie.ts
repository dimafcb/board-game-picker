import { Dexie } from 'dexie';
import { Game } from '../model/game';
import { Player } from '../model/player';

export class GameDexie extends Dexie {
  players!: Dexie.Table<Player, string>;
  games!: Dexie.Table<Game, string>;

  constructor() {
    super('GameDexie');
    this.version(1).stores({
      players: 'id, dateCreated',
      games: 'id, dateCreated, rating',
    });

    this.players = this.table('players');
    this.games = this.table('games');
  }
}
