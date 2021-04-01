import { AfterViewInit, Component, OnInit } from '@angular/core';
// import { TweenMax } from 'gsap';
import { from, Subscription } from 'rxjs';
import { PlayerEditorComponent } from './components/player-editor/player-editor.component';
import { DialogResult } from './model/dialog-result';
import { Game } from './model/game';
import { Player } from './model/player';
import { Stat } from './model/stat';
import { DialogService } from './services/dialog.service';
import { GameDexie } from './storage/game-dexie';
import { Utils } from './utils/utils';

// declare let TweenMax: any;
declare let Winwheel: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  players: Player[] = [];
  playersSort: keyof Player = 'dateCreated';
  private playersSubscription?: Subscription;

  games: Game[] = [];
  gamesSort: keyof Game = 'rating';
  private gamesSubscription?: Subscription;

  stat: Stat = { activeGames: 0, activePlayers: 0, allGames: 0, allPlayers: 0 };

  private gameDexie = new GameDexie();

  // segments = [];
  innerRadius = 10;
  height = 400;
  spinDuration = 10;
  spinAmount = 5;

  wheel!: any;

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {
    this.fetchPlayers();
    this.fetchGames();
  }

  ngAfterViewInit(): void {
    this.wheel = new Winwheel({
      canvasId: 'spinningWheel',
      numSegments: 0,
      segments: [],
      innerRadius: this.innerRadius || 0,
      outerRadius: this.height / 2 - 20,
      // pointerAngle: 45,
      centerY: this.height / 2 + 20,
      // textOrientation : this.textOrientation,
      // textAligment : this.textAlignment,
      animation: {
        type: 'spinToStop', // Type of animation.
        duration: this.spinDuration, // How long the animation is to take in seconds.
        spins: this.spinAmount, // The number of complete 360 degree rotations the wheel is to do.
      },
      // Specify pointer guide properties.
      // pointerGuide: {
      //   display: true,
      //   strokeStyle: 'red',
      //   lineWidth: 3,
      // },
      pins: {
        fillStyle: '#4e38f3',
        outerRadius: 3,
        margin: -3,
      },
    });
    console.log('Winwheel', this.wheel);
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

  trackPlayers(i: number, player: Player): string {
    return player.id;
  }

  // games

  private fetchGames(): void {
    this.gamesSubscription?.unsubscribe();
    this.gamesSubscription = from(this.gameDexie.games.toCollection().sortBy(this.gamesSort)).subscribe({
      next: (games) => {
        this.games = games;
        this.stat.allGames = this.games.length;
        this.stat.activeGames = this.games.filter((p) => !p.disabled).length;
        console.log('SEGMENTS', this.wheel.segments);
        let segmentsCount = this.wheel.segments?.length || 0;
        while (segmentsCount-- >= 0) {
          this.wheel.deleteSegment();
        }
        this.games.forEach((g) => {
          this.wheel.addSegment({
            fillStyle: '#eae56f',
            text: g.name,
          });
        });
        // while (this.wheel?.segments?.length) {
        //   // this.wheel.deleteSegment();
        // }
        this.wheel.draw();
      },
    });
  }

  addGame(): void {
    const newGame: Game = {
      id: `game${Utils.randomId()}`,
      // name: `New player ${this.p.length + 1}`,
      name: `game${Utils.randomName()}`,
      photo: 'https://cf.geekdo-images.com/0K1AOciqlMVUWFPLTJSiww__opengraph_left/img/_2lmRrBuHxOVB4rhF9_9MArsYUQ=/fit-in/445x445/filters:strip_icc()/pic66668.jpg',
      dateCreated: Date.now(),
      playersMin: 2,
      playersMax: 5,
      averageTimeToPlay: 45,
    };
    this.gameDexie.games.put(newGame).then(() => this.fetchGames());
  }

  toggleGame(game: Game): void {
    this.gameDexie.games
      .update(game.id, {
        disabled: !game.disabled,
      })
      .then(() => this.fetchGames());
  }

  trackGames(i: number, game: Game): string {
    return game.id;
  }

  spin(): void {
    this.wheel.startAnimation();
  }
}
