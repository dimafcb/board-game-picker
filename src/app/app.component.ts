import { Component, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, combineLatest, defer, of, Subject } from 'rxjs';
import { debounceTime, map, share, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { firstBy } from 'thenby';
import { GameEditorComponent } from './components/editor/game-editor/game-editor.component';
import { PlayerEditorComponent } from './components/editor/player-editor/player-editor.component';
import { TIME_TO_PLAY_LIST } from './const/time-to-play';
import { DialogResult } from './model/dialog-result';
import { Game } from './model/game';
import { Player } from './model/player';
import { Stat } from './model/stat';
import { TimeToPlay } from './model/time-to-play';
import { DialogService } from './services/dialog.service';
import { GameDexie } from './storage/game-dexie';
import { TextScramble } from './utils/text-scramble';
import { Utils } from './utils/utils';

const GAMES_DELAY = 100;

const DEXIE_PLAYERS_QUERY_LOG = <T>(value: T) => {
  console.log(`DEXIE..........................................PLAYERS`, value);
};

const GAMES_LOG_QUERY_LOG = <T>(value: T) => {
  console.log(`DEXIE..........................................GAMES`, value);
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // players
  playersSort: keyof Player = 'dateCreated';

  private getPlayersFromDexie$ = defer(() => this.gameDexie.players.toCollection().toArray()).pipe(
    tap(DEXIE_PLAYERS_QUERY_LOG),
    tap((players) => {
      this.stat.allPlayers = players.length;
      this.stat.activePlayers = players.filter((p) => !p.disabled).length;
      console.log('UPDATE_STAT.. players', this.stat.activePlayers, this.stat.allPlayers);
    })
  );
  private playersChange$ = new BehaviorSubject<void>(undefined as void);

  players$ = this.playersChange$.pipe(
    // players change - ADD/EDIT/DELETE
    switchMap(() => this.getPlayersFromDexie$),
    share()
  );

  // timeToPlay
  timeToPlayList$ = of(TIME_TO_PLAY_LIST);
  timeToPlayChange$ = new BehaviorSubject<TimeToPlay>(TIME_TO_PLAY_LIST[0]);

  // games

  private getGamesFromDexie$ = defer(() => this.gameDexie.games.toCollection().reverse().toArray()).pipe(tap(GAMES_LOG_QUERY_LOG));
  private gamesChange$ = new BehaviorSubject<void>(undefined as void);

  games$ = combineLatest([
    // players change
    this.players$,
    // games change - ADD/EDIT/DELETE/SORT
    this.gamesChange$,
    // time to play change
    this.timeToPlayChange$,
  ]).pipe(
    debounceTime(GAMES_DELAY),
    switchMap(([players, gamesChange, timeToPlay]) => {
      return this.getGamesFromDexie$.pipe(
        tap((games) => {
          const activePlayers = players.filter((p) => !p.disabled).length;
          games.forEach((g) => {
            if (g.playersMin && g.playersMin > activePlayers) {
              g.disabledStatus = `min. ${g.playersMin} players`;
            } else if (g.playersMax && g.playersMax < activePlayers) {
              g.disabledStatus = `max. ${g.playersMax} players`;
            } else if (timeToPlay.min && g.averageTimeToPlay < timeToPlay.min) {
              g.disabledStatus = `too fast`;
            } else if (timeToPlay.max && g.averageTimeToPlay > timeToPlay.max) {
              g.disabledStatus = `too long`;
            } else {
              g.disabledStatus = undefined;
            }
          });
          this.stat.allGames = games.length;
          this.stat.activeGames = games.filter((p) => !p.disabled && !p.disabledStatus).length;
          console.log(
            'UPDATE_STAT.. games',
            this.stat.activeGames,
            this.stat.allGames,
            games.map((g) => g.disabled + '--------------' + g.disabledStatus + '-----------------' + g.name)
          );
        }),
        map((games) => games.sort(firstBy('disabledStatus', 'asc').thenBy('disabled', 'asc').thenBy('rating', 'desc').thenBy('name')))
      );
    }),
    share()
  );
  startGame = new Subject<HTMLDivElement>();

  stat: Stat = { activeGames: 0, activePlayers: 0, allGames: 0, allPlayers: 0 };

  result?: Game;
  inProgress = false;

  private gameDexie = new GameDexie();

  constructor(private dialogService: DialogService) {
    this.startGame.pipe(withLatestFrom(this.games$)).subscribe(([el, games]) => {
      console.log('startGame', el, games);
      this.pickRandom(el, games);
    });
  }

  // players

  // deletePlayer(player: Player): void {
  //   this.gameDexie.players.delete(player.id).then(() => this.fetchPlayers());
  // }

  async editPlayer(event: Event, player?: Player): Promise<void> {
    event.stopPropagation();
    const result = await this.dialogService.open<PlayerEditorComponent>(PlayerEditorComponent, {}, (dialogRef) => {
      if (player?.id) {
        dialogRef.componentInstance.player = Object.assign({}, player);
      }
    });
    console.log('editPlayer', result);
    if (result === DialogResult.Ok) {
      this.playersChange$.next();
    }
  }

  async playerAction(player: Player): Promise<void> {
    await this.gameDexie.players.update(player.id, {
      disabled: !player.disabled,
    });
    this.playersChange$.next();
  }

  async editGame(event: Event, game?: Game): Promise<void> {
    event.stopPropagation();
    const result = await this.dialogService.open<GameEditorComponent>(GameEditorComponent, {}, (dialogRef) => {
      if (game?.id) {
        dialogRef.componentInstance.game = Object.assign({}, game);
      }
    });
    console.log('editPlayer', result);
    if (result === DialogResult.Ok) {
      this.gamesChange$.next();
    }
  }

  async gameAction(game: Game): Promise<void> {
    if (game.disabledStatus) {
      return;
    }
    await this.gameDexie.games.update(game.id, {
      disabled: !game.disabled,
    });
    this.gamesChange$.next();
  }

  private async pickRandom(el: HTMLDivElement, games: Game[]): Promise<void> {
    this.inProgress = true;
    this.result = undefined;
    const activeGames = games.filter((g) => !g.disabled && !g.disabledStatus);
    const result = Utils.randomItem(activeGames);
    console.log('START..', result);

    if (result) {
      const scrabble = new TextScramble(el);
      await scrabble.setText(result.name);
      this.result = result;
    } else {
      el.innerHTML = 'No games';
    }
    this.inProgress = false;
  }

  start(el: HTMLDivElement): void {
    this.startGame.next(el);
  }

  trackById = (i: number, item: Game | Player): string => item.id;

  selectTime(timeToPlay: TimeToPlay): void {
    this.timeToPlayChange$.next(timeToPlay);
  }

  editModeChange(editMode: boolean): void {}
}
