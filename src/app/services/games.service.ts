import { Injectable } from '@angular/core';
import { Game } from '../model/game';
import { Player } from '../model/player';
import { Stat } from '../model/stat';
import { TimeToPlay } from '../model/time-to-play';
import { GameDisabledFactory } from '../utils/game-disabled-status.factory';
import { Utils } from '../utils/utils';

@Injectable({ providedIn: 'root' })
export class GamesService {
  constructor() {}

  setDisabledStatus(games: Game[], players: Player[], timeToPlay: TimeToPlay): void {
    const activePlayers = players.filter((p) => !p.disabled);
    const activePlayersCount = activePlayers.length;
    const activePlayersMinAge = activePlayers.reduce((age, p) => Math.min(Utils.birthdateToAge(p.birthdate), age), 0);
    games.forEach((g) => {
      if (g.minPlayers && g.minPlayers > activePlayersCount) {
        g.disabledStatus = GameDisabledFactory.MinPlayers(g);
      } else if (g.maxPlayers && g.maxPlayers < activePlayersCount) {
        g.disabledStatus = GameDisabledFactory.MaxPlayers(g);
      } else if (timeToPlay.max && g.averageTimeToPlay > timeToPlay.max) {
        g.disabledStatus = GameDisabledFactory.MinTime(g);
      } else if (activePlayersMinAge && g.minAge && g.minAge > activePlayersMinAge) {
        g.disabledStatus = GameDisabledFactory.MinAge(g);
      } else {
        g.disabledStatus = undefined;
      }
    });
  }

  updateGamesStat(games: Game[], stat: Stat): void {
    stat.allGames = games.length;
    stat.activeGames = games.filter((g) => !g.disabled && !g.disabledStatus).length;
  }

  pickRandom(games: Game[]): Game | undefined {
    const activeGames = games.filter((g) => !g.disabled && !g.disabledStatus);
    const activeGamesByRating = activeGames.reduce((acc, game: Game) => {
      const rate = Math.floor(Math.pow(Math.floor(game.rating || 1), 1.2));
      console.log('pickRandom..add', `${rate}________${game.name}`);
      return acc.concat([...Array(rate)].map((v) => game));
    }, [] as Game[]);
    Utils.shuffle(activeGamesByRating);
    console.log(
      'pickRandom..result',
      activeGamesByRating.map((g) => `${g.name}`)
    );
    return Utils.randomItem(activeGamesByRating);
  }
}
