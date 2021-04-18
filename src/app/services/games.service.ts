import { Injectable } from '@angular/core';
import { Game } from '../model/game';
import { Player } from '../model/player';
import { Stat } from '../model/stat';
import { TimeToPlay } from '../model/time-to-play';
import { Utils } from '../utils/utils';

@Injectable({ providedIn: 'root' })
export class GamesService {
  constructor() {}

  setDisabledStatus(games: Game[], players: Player[], timeToPlay: TimeToPlay): void {
    const activePlayers = players.filter((p) => !p.disabled).length;
    games.forEach((g) => {
      if (g.playersMin && g.playersMin > activePlayers) {
        g.disabledStatus = `Min. ${g.playersMin} players`;
      } else if (g.playersMax && g.playersMax < activePlayers) {
        g.disabledStatus = `Max. ${g.playersMax} players`;
      } else if (timeToPlay.min && g.averageTimeToPlay < timeToPlay.min) {
        g.disabledStatus = `Too fast`;
      } else if (timeToPlay.max && g.averageTimeToPlay > timeToPlay.max) {
        g.disabledStatus = `Too long`;
      } else {
        g.disabledStatus = undefined;
      }
    });
    // console.log(
    //   'UPDATE_STAT.. games',
    //   games.map((g) => g.disabled + '--------------' + g.disabledStatus + '-----------------' + g.name)
    // );
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
