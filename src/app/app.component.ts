import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, TemplateRef } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, combineLatest, defer, of, Subject } from 'rxjs';
import { debounceTime, map, shareReplay, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { firstBy } from 'thenby';
import { GameEditorComponent } from './components/editor/game-editor/game-editor.component';
import { PlayerEditorComponent } from './components/editor/player-editor/player-editor.component';
import { ResultDialogComponent } from './components/result-dialog/result-dialog.component';
import { SNACKBAR_CONFIG } from './const/snackbar-config';
import { TIME_TO_PLAY_LIST } from './const/time-to-play';
import { DialogResult } from './model/dialog-result';
import { Game } from './model/game';
import { Player } from './model/player';
import { Stat } from './model/stat';
import { TimeToPlay } from './model/time-to-play';
import { DialogService } from './services/dialog.service';
import { GamesService } from './services/games.service';
import { GameDexie } from './storage/game-dexie';

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
  playersSort: keyof Player = 'order';

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
    shareReplay()
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
          this.gamesService.setDisabledStatus(games, players, timeToPlay);
          this.gamesService.updateGamesStat(games, this.stat);
        }),
        map((games) => games.sort(firstBy('disabledStatus', 'asc').thenBy('disabled', 'asc').thenBy('rating', 'desc').thenBy('name')))
      );
    }),
    shareReplay()
  );
  gamesAll$ = this.games$.pipe(
    map((games) => {
      return games.slice().sort(firstBy('name', 'asc'));
    })
  );

  startGame = new Subject<void>();

  stat: Stat = { activeGames: 0, activePlayers: 0, allGames: 0, allPlayers: 0 };

  inProgress = false;

  private gameDexie = new GameDexie();

  constructor(
    private dialogService: DialogService,
    private matSnackBar: MatSnackBar,
    private bottomSheet: MatBottomSheet,
    private gamesService: GamesService
  ) {
    this.startGame.pipe(withLatestFrom(this.games$)).subscribe(([s, games]) => {
      console.log('startGame', games);
      this.dialogService
        .open(
          ResultDialogComponent,
          {
            minHeight: '500px',
            minWidth: '500px',
          },
          (dialogRef) => {
            dialogRef.componentInstance.pickRandom(games);
          }
        )
        .then((res) => {
          this.inProgress = false;
        });
    });
  }

  // players

  async editPlayer(player?: Player): Promise<void> {
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

  async deletePlayer(player: Player): Promise<void> {
    await this.gameDexie.players.delete(player.id);
    this.playersChange$.next();
  }

  async playerAction(player: Player): Promise<void> {
    await this.gameDexie.players.update(player.id, {
      disabled: !player.disabled,
    });
    this.playersChange$.next();
  }

  async editGame(game?: Game): Promise<void> {
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

  async deleteGame(game: Game): Promise<void> {
    await this.gameDexie.games.delete(game.id);
    this.gamesChange$.next();
  }

  async gameAction(game: Game): Promise<void> {
    if (game.disabledStatus) {
      this.matSnackBar.open(game.disabledStatus, 'OK', SNACKBAR_CONFIG(true));
      return;
    }
    await this.gameDexie.games.update(game.id, {
      disabled: !game.disabled,
    });
    this.gamesChange$.next();
  }

  start(): void {
    this.startGame.next();
  }

  trackById = (i: number, item: Game | Player): string => item.id;

  selectTime(timeToPlay: TimeToPlay): void {
    this.timeToPlayChange$.next(timeToPlay);
  }

  openPanel(panel: TemplateRef<any>): void {
    const ref = this.bottomSheet.open(panel, {
      hasBackdrop: true,
    });
    console.log(panel);
  }

  drop<T>(event: CdkDragDrop<T>, items: T[]): void {
    console.log('moveItemInArray..', event.container);
    moveItemInArray(items, event.previousIndex, event.currentIndex);
  }
}
