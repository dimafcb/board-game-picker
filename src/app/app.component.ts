import { Component, OnInit } from '@angular/core';
import { from, Subscription } from 'rxjs';
import { Game } from './model/game';
import { Player } from './model/player';
import { Stat } from './model/stat';
import { GameDexie } from './storage/game-dexie';
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

  stat: Stat = { activeGames: 0, activePlayers: 0, allGames: 0, allPlayers: 0 };

  private gameDexie = new GameDexie();

  ngOnInit(): void {
    this.fetchPlayers();
    this.fetchGames();
  }

  // players

  addPlayer(): void {
    const random = Math.random() > 0.5;
    const newPlayer: Player = {
      id: `player${Utils.randomId()}`,
      // name: `New player ${this.players.length + 1}`,
      name: random ? 'Dima' : 'Tania',
      photo: random ? '../assets/players/dima.jpg' : '../assets/players/tania.jpg',
      dateCreated: Date.now(),
    };
    this.gameDexie.players.put(newPlayer).then(() => this.fetchPlayers());
  }

  deletePlayer(player: Player): void {
    this.gameDexie.players.delete(player.id).then(() => this.fetchPlayers());
  }

  editPlayer(player: Player): void {}

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
      },
    });
  }

  addGame(): void {
    const newGame: Game = {
      id: `game${Utils.randomId()}`,
      // name: `New player ${this.players.length + 1}`,
      name: 'Board game',
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
}
