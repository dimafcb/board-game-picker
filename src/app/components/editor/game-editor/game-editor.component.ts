import { Component, OnInit, Optional } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { defer, Observable } from 'rxjs';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';
import { SNACKBAR_CONFIG } from '../../../const/snackbar-config';
import { BggGame, BggGameFull } from '../../../model/bgg/bgg-game';
import { DialogResult } from '../../../model/dialog-result';
import { Game } from '../../../model/game';
import { BggApiService } from '../../../services/bgg-api.service';
import { GameDexie } from '../../../storage/game-dexie';
import { Utils } from '../../../utils/utils';

@Component({
  selector: 'game-editor',
  templateUrl: './game-editor.component.html',
  styleUrls: ['./game-editor.component.scss'],
})
export class GameEditorComponent implements OnInit {
  game: Partial<Game> = {
    name: 'New game',
  };
  gameBgg!: BggGameFull;
  private gameDexie = new GameDexie();

  autocompleteControl = new FormControl();
  autocompleteItems!: Observable<BggGame[]>;

  constructor(
    @Optional() private dialogRef: MatDialogRef<GameEditorComponent>,
    private bggApiService: BggApiService,
    private matSnackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.game.bggId) {
      const game: BggGame = {
        id: this.game.bggId,
        name: {
          value: this.game.name || '',
        },
      };
      console.log('GAME', this.game, game);
      this.autocompleteControl.setValue(game, {
        emitEvent: true,
      });
      this.autocompleteControl.updateValueAndValidity();
    }
    this.autocompleteItems = this.autocompleteControl.valueChanges.pipe(
      debounceTime(500),
      filter((value) => value?.length > 3),
      tap((value) => {
        this.matSnackBar.dismiss();
      }),
      switchMap((value) =>
        defer(() =>
          this.bggApiService.getGames({
            query: typeof value === 'string' ? value.trim() : value.name.value,
          })
        ).pipe(
          tap((games) => {
            !games?.length && this.matSnackBar.open('No games found', 'OK', SNACKBAR_CONFIG());
          })
        )
      )
    );
    this.autocompleteControl.valueChanges
      .pipe(
        filter((value) => typeof value !== 'string'),
        tap((game: BggGame) => {
          this.game.name = game.name.value;
        }),
        switchMap((game: BggGame) => defer(() => this.bggApiService.getGameDetails({ id: game.id })))
      )
      .subscribe((gameFull) => {
        this.gameBgg = gameFull;
        console.log('gameFull..', gameFull);
        this.game.bggId = gameFull.id;
        this.game.image = gameFull.image;
        this.game.minPlayers = gameFull.minplayers.value;
        this.game.maxPlayers = gameFull.maxplayers.value;
        this.game.averageTimeToPlay = gameFull.playingtime.value;
        this.game.bggRating = Utils.fixNumber(gameFull.statistics?.ratings?.average?.value);
      });
  }

  save(): void {
    if (this.game.id) {
      this.gameDexie.games.update(this.game.id, this.game).then(() => this.dialogRef?.close(DialogResult.Ok));
    } else {
      const newGame = { ...this.game, id: Utils.randomId('game'), dateCreated: Date.now() } as Game;
      this.gameDexie.games.put(newGame).then(() => this.dialogRef?.close(DialogResult.Ok));
    }
  }

  cancel(): void {
    this.dialogRef?.close(DialogResult.Cancel);
  }

  imageSelected(image: string): void {
    this.game.image = image;
  }

  displayFn(game: BggGame): string {
    return game?.name?.value || '';
  }
}
