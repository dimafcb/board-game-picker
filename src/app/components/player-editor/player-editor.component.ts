import { Component, OnInit, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogResult } from '../../model/dialog-result';
import { Player } from '../../model/player';
import { GameDexie } from '../../storage/game-dexie';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'player-editor',
  templateUrl: './player-editor.component.html',
  styleUrls: ['./player-editor.component.scss'],
})
export class PlayerEditorComponent implements OnInit {
  // @ViewChild('image', { static: true }) public imageElRef!: ElementRef<HTMLImageElement>;
  // cropper!: Cropper;

  player: Partial<Player> = {
    name: 'New player',
  };
  private gameDexie = new GameDexie();

  constructor(@Optional() private dialogRef: MatDialogRef<PlayerEditorComponent>) {}

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
        this.player.photo = reader.result as string;
      },
      false
    );

    if (imageFile) {
      reader.readAsDataURL(imageFile);
    }
  }
}
