import { Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { from, Subscription } from 'rxjs';
import { SNACKBAR_CONFIG } from '../../const/snackbar-config';
import { DialogResult } from '../../model/dialog-result';
import { Player } from '../../model/player';
import { BggApiService } from '../../services/bgg-api.service';
import { GameDexie } from '../../storage/game-dexie';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'player-editor',
  templateUrl: './player-editor.component.html',
  styleUrls: ['./player-editor.component.scss'],
})
export class PlayerEditorComponent implements OnInit, OnDestroy {
  // @ViewChild('image', { static: true }) public imageElRef!: ElementRef<HTMLImageElement>;
  // cropper!: Cropper;

  playerBggControl = new FormControl('');

  subscription!: Subscription;

  player: Partial<Player> = {
    name: 'New player',
  };
  private gameDexie = new GameDexie();

  constructor(@Optional() private dialogRef: MatDialogRef<PlayerEditorComponent>, private bggApiService: BggApiService, private matSnackBar: MatSnackBar) {}

  ngOnInit(): void {}

  async save(): Promise<void> {
    if (this.player.id) {
      await this.gameDexie.players.update(this.player.id, this.player);
    } else {
      const newPlayer = { ...this.player, id: `player_${Utils.randomId()}`, dateCreated: Date.now() } as Player;
      await this.gameDexie.players.put(newPlayer);
    }
    this.dialogRef?.close(DialogResult.Ok);
  }

  async deletePlayer(): Promise<void> {
    if (this.player.id) {
      await this.gameDexie.players.delete(this.player.id);
    }
    this.dialogRef?.close(DialogResult.Ok);
  }

  cancel(): void {
    this.dialogRef?.close(DialogResult.Cancel);

    // https://www.boardgamegeek.com/xmlapi2/collection?username=samort7&subtype=boardgame&own=1

    // https://www.boardgamegeek.com/xmlapi2/users?name=
  }

  imageSelected(image: string): void {
    this.player.image = image;
  }

  search(): void {
    this.subscription?.unsubscribe();
    const name = (this.playerBggControl?.value as string).trim();
    this.subscription = from(this.bggApiService.getUserByName({ name })).subscribe((bggUser) => {
      console.log('USER..', bggUser);
      if (bggUser?.id) {
        this.player.bggId = bggUser.id;
        this.player.name = bggUser.name;
        if (bggUser.avatarlink?.value?.length > 3) {
          this.player.image = bggUser.avatarlink.value;
        } else {
          this.player.image = undefined;
        }
      } else {
        this.matSnackBar.open(`user "${name.trim().toLowerCase()}" was not found`, 'OK', SNACKBAR_CONFIG());
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
