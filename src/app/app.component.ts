import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest, defer, of } from 'rxjs';
import { debounceTime, sampleTime, share, switchMap, take, tap } from 'rxjs/operators';
import { GameEditorComponent } from './components/game-editor/game-editor.component';
import { PlayerEditorComponent } from './components/player-editor/player-editor.component';
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

let playersDexieQuery = 0;

const DEXIE_PLAYERS_QUERY_LOG = <T>(value: T) => {
  console.log(`DEXIE..........................................PLAYERS_${++playersDexieQuery}`, value);
};

let gamesDexieQuery = 0;

const GAMES_LOG_QUERY_LOG = <T>(value: T) => {
  console.log(`DEXIE..........................................GAMES_${++gamesDexieQuery}`, value);
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // players
  playersSort: keyof Player = 'dateCreated';

  private getPlayersFromDexie$ = defer(() => this.gameDexie.players.toCollection().sortBy(this.playersSort)).pipe(
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
  timeToPlayChange$ = new BehaviorSubject<void>(undefined as void);
  timeToPlay: TimeToPlay = TIME_TO_PLAY_LIST[0];

  // games
  gamesSort: keyof Game = 'bggRating';

  private getGamesFromDexie$ = defer(() => this.gameDexie.games.toCollection().reverse().sortBy(this.gamesSort)).pipe(tap(GAMES_LOG_QUERY_LOG));
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
    switchMap(([players]) => {
      return this.getGamesFromDexie$.pipe(
        tap((games) => {
          const activePlayers = players.filter((p) => !p.disabled).length;
          games.forEach((g) => {
            if (g.playersMin && g.playersMin > activePlayers) {
              g.disabledStatus = `min. ${g.playersMin} players`;
            } else if (g.playersMax && g.playersMax < activePlayers) {
              g.disabledStatus = `max. ${g.playersMin} players`;
            } else if (this.timeToPlay.min && g.averageTimeToPlay < this.timeToPlay.min) {
              g.disabledStatus = `too fast`;
            } else if (this.timeToPlay.max && g.averageTimeToPlay > this.timeToPlay.max) {
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
        })
      );
    }),
    share()
  );

  stat: Stat = { activeGames: 0, activePlayers: 0, allGames: 0, allPlayers: 0 };
  editMode = false;

  result?: Game;
  inProgress = false;

  private gameDexie = new GameDexie();

  constructor(private dialogService: DialogService) {}

  // players

  // deletePlayer(player: Player): void {
  //   this.gameDexie.players.delete(player.id).then(() => this.fetchPlayers());
  // }

  editPlayer(player?: Player): void {
    this.dialogService
      .open<PlayerEditorComponent>(PlayerEditorComponent, {}, (dialogRef) => {
        if (player?.id) {
          dialogRef.componentInstance.player = Object.assign({}, player);
        }
      })
      .subscribe((result) => {
        console.log('editPlayer', result);
        if (result === DialogResult.Ok) {
          this.playersChange$.next();
        }
      });
  }

  clickPlayer(player: Player): void {
    if (this.editMode) {
      this.editPlayer(player);
    } else {
      this.gameDexie.players.update(player.id, {
        disabled: !player.disabled,
      });
      this.playersChange$.next();
    }
  }

  // private fetchGames(): void {
  //   this.gamesSubscription = from(this.gameDexie.games.toCollection().sortBy(this.gamesSort))
  //     // .pipe(delay(1000))
  //     .subscribe({
  //       next: (games) => {
  //         this.games = games;
  //         const activePlayers = 1; // this.players.filter((p) => !p.disabled).length;
  //         this.games.forEach((g) => {
  //           if ((g.playersMin && g.playersMin > activePlayers) || (g.playersMax && g.playersMax < activePlayers)) {
  //             g.disabledStatus = `${g.playersMin} - ${g.playersMax} players`;
  //           } else if (this.timeToPlay.min && g.averageTimeToPlay < this.timeToPlay.min) {
  //             g.disabledStatus = `too fast`;
  //           } else if (this.timeToPlay.max && g.averageTimeToPlay > this.timeToPlay.max) {
  //             g.disabledStatus = `too long`;
  //           }
  //         });
  //         this.stat.allGames = this.games.length;
  //         this.stat.activeGames = this.games.filter((p) => !p.disabled).length;
  //       },
  //     });
  // }

  editGame(game?: Game): void {
    this.dialogService
      .open<GameEditorComponent>(GameEditorComponent, {}, (dialogRef) => {
        if (game?.id) {
          dialogRef.componentInstance.game = Object.assign({}, game);
        }
      })
      .subscribe((result) => {
        console.log('editPlayer', result);
        if (result === DialogResult.Ok) {
          this.gamesChange$.next();
        }
      });
  }

  clickGame(game: Game): void {
    if (this.editMode) {
      this.editGame(game);
    } else {
      if (game.disabledStatus) {
        return;
      }
      this.gameDexie.games
        .update(game.id, {
          disabled: !game.disabled,
        })
        .then(() => this.gamesChange$.next());
    }
  }

  async start(el: HTMLDivElement): Promise<void> {
    this.inProgress = true;
    this.result = undefined;

    const scrabble = new TextScramble(el);

    console.log('START..');

    const games_full = await this.games$
      .pipe(
        sampleTime(0),
        take(1),
        tap((g) => console.log('START..toPromise1', g.length, g))
      )
      .toPromise();

    console.log('START.. games_full', games_full.length, games_full);

    const games = games_full.filter((g) => !g.disabled && !g.disabledStatus);

    console.log('START.. games', games.length, games);

    const result = Utils.randomItem(games);
    console.log('START..', result);

    if (result) {
      await scrabble.setText(result.name);
      this.result = result;
    } else {
      el.innerHTML = 'NO GAMES';
    }
    this.inProgress = false;
  }

  trackById = (i: number, item: Game | Player): string => item.id;

  selectTime(timeToPlay: TimeToPlay): void {
    this.timeToPlay = timeToPlay;

    this.timeToPlayChange$.next();
  }

  editModeChange(editMode: boolean): void {}
}
