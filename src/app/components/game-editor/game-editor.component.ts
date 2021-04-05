import { Component, OnInit, Optional } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { defer, Observable } from 'rxjs';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';
import { DialogResult } from '../../model/dialog-result';
import { Game } from '../../model/game';
import { GameBgg, GameBggFull } from '../../model/game-bgg';
import { BggApiService } from '../../services/bgg-api.service';
import { GameDexie } from '../../storage/game-dexie';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'game-editor',
  templateUrl: './game-editor.component.html',
  styleUrls: ['./game-editor.component.scss'],
})
export class GameEditorComponent implements OnInit {
  game: Partial<Game> = {
    name: 'New game',
  };
  gameBgg!: GameBggFull;
  private gameDexie = new GameDexie();

  autocompleteControl = new FormControl();
  autocompleteItems!: Observable<GameBgg[]>;

  constructor(@Optional() private dialogRef: MatDialogRef<GameEditorComponent>, private bggApiService: BggApiService) {}

  ngOnInit(): void {
    this.autocompleteItems = this.autocompleteControl.valueChanges.pipe(
      debounceTime(500),
      filter((value) => value?.length > 3),
      switchMap((value) =>
        defer(() =>
          this.bggApiService.searchGames({
            query: typeof value === 'string' ? value.trim() : value.name.value,
            type: 'boardgame',
          })
        )
      )
    );
    this.autocompleteControl.valueChanges
      .pipe(
        filter((value) => typeof value !== 'string'),
        tap((game: GameBgg) => {
          this.game.name = game.name.value;
        }),
        switchMap((game: GameBgg) => defer(() => this.bggApiService.getGameDetails({ id: game.id, type: ['boardgame', 'boardgameexpansion'] })))
      )
      .subscribe((gameFull) => {
        this.gameBgg = gameFull;
        console.log('gameFull..', gameFull);
        this.game.idBgg = parseInt(gameFull.id, 0);
        this.game.photo = gameFull.image;
        this.game.playersMin = parseInt(gameFull.minplayers.value, 0);
        this.game.playersMax = parseInt(gameFull.maxplayers.value, 0);
        this.game.averageTimeToPlay = parseInt(gameFull.playingtime.value, 0);
      });
  }

  save(): void {
    if (this.game.id) {
      this.gameDexie.games.update(this.game.id, this.game).then(() => this.dialogRef?.close(DialogResult.Ok));
    } else {
      const newGame = { ...this.game, id: `game_${Utils.randomId()}`, dateCreated: Date.now() } as Game;
      this.gameDexie.games.put(newGame).then(() => this.dialogRef?.close(DialogResult.Ok));
    }
  }

  cancel(): void {
    this.dialogRef?.close(DialogResult.Cancel);
  }

  onFileSelected(element: HTMLInputElement): void {
    console.log('onFileSelected..', element.files);
    const imageFile = element.files?.[0];

    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        console.log(reader.result);
        this.game.photo = reader.result as string;
      },
      false
    );

    if (imageFile) {
      reader.readAsDataURL(imageFile);
    }
  }

  displayFn(game: any): string {
    return game?.name?.value || '';
  }
}
