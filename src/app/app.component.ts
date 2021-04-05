import { Component, OnInit } from '@angular/core';
import { from, Subscription } from 'rxjs';
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  players: Player[] = [];
  playersSort: keyof Player = 'dateCreated';
  private playersSubscription?: Subscription;

  games: Game[] = [];
  gamesSort: keyof Game = 'rating';
  private gamesSubscription?: Subscription;

  timeToPlayList: TimeToPlay[] = TIME_TO_PLAY_LIST;
  timeToPlay: TimeToPlay = this.timeToPlayList[0];

  stat: Stat = { activeGames: 0, activePlayers: 0, allGames: 0, allPlayers: 0 };

  result?: Game;
  inProgress = false;

  private gameDexie = new GameDexie();

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {
    this.fetchPlayers();
    this.fetchGames();
  }

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
          this.fetchPlayers();
        }
      });
  }

  togglePlayer(player: Player): void {
    this.gameDexie.players
      .update(player.id, {
        disabled: !player.disabled,
      })
      .then(() => this.fetchPlayers());
  }

  private fetchPlayers(): void {
    this.playersSubscription?.unsubscribe();
    this.playersSubscription = from(this.gameDexie.players.toCollection().sortBy(this.playersSort)).subscribe({
      next: (players) => {
        this.players = players;
        this.stat.allPlayers = this.players.length;
        this.stat.activePlayers = this.players.filter((p) => !p.disabled).length;
      },
    });
  }

  // games

  private fetchGames(): void {
    this.gamesSubscription?.unsubscribe();
    this.gamesSubscription = from(this.gameDexie.games.toCollection().sortBy(this.gamesSort))
      // .pipe(delay(1000))
      .subscribe({
        next: (games) => {
          this.games = games;
          this.stat.allGames = this.games.length;
          this.stat.activeGames = this.games.filter((p) => !p.disabled).length;
        },
      });
  }

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
          this.fetchGames();
        }
      });
  }

  toggleGame(game: Game): void {
    this.gameDexie.games
      .update(game.id, {
        disabled: !game.disabled,
      })
      .then(() => this.fetchGames());
  }

  async start(el: HTMLDivElement): Promise<void> {
    this.inProgress = true;
    this.result = undefined;

    const scrabble = new TextScramble(el);

    const activePlayersCount = await this.gameDexie.players.filter((p) => !p.disabled).count();
    const games = await this.gameDexie.games
      .filter((g) => {
        if (this.timeToPlay.min && g.averageTimeToPlay < this.timeToPlay.min) {
          return false;
        }
        if (this.timeToPlay.max && g.averageTimeToPlay > this.timeToPlay.max) {
          return false;
        }
        if (g.disabled) {
          return false;
        }
        if (g.playersMin > activePlayersCount || g.playersMax < activePlayersCount) {
          return false;
        }
        return true;
      })
      .toArray();
    const result = Utils.randomItem(games);

    scrabble.setText(result.name).then((res) => {
      this.inProgress = false;
      this.result = result;
    });
  }

  trackById = (i: number, item: Game | Player): string => item.id;

  selectTime(timeToPlay: TimeToPlay): void {
    this.timeToPlay = timeToPlay;
  }
}
