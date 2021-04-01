import { Component, OnInit, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogResult } from '../../model/dialog-result';
import { Player } from '../../model/player';
import { GameDexie } from '../../storage/game-dexie';

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

  save(): void {
    // Crop
    // const croppedCanvas = this.cropper.getCroppedCanvas();
    // Round
    // const roundedCanvas = this.getRoundedCanvas(croppedCanvas);
    // Show
    // roundedCanvas.toDataURL();
    // if (this.player.id) {
    //   this.gameDexie.players.update(this.player.id, this.player).then(() => this.dialogRef?.close(DialogResult.Ok));
    // } else {
    //   const newPlayer = { ...this.player, id: `player_${Utils.randomId()}`, dateCreated: Date.now() } as Player;
    //   this.gameDexie.players.put(newPlayer).then(() => this.dialogRef?.close(DialogResult.Ok));
    // }
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
        let croppable = false;

        // setTimeout(() => {
        //   console.log('imageElRef', this.imageElRef.nativeElement);
        //   this.cropper = new Cropper(this.imageElRef.nativeElement, {
        //     aspectRatio: 1,
        //     viewMode: 1,
        //     ready: () => {
        //       croppable = true;
        //       console.log(croppable);
        //     },
        //   });
        // }, 1000);
      },
      false
    );

    if (imageFile) {
      reader.readAsDataURL(imageFile);
    }
  }

  getRoundedCanvas(sourceCanvas: HTMLCanvasElement) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d')!;
    var width = sourceCanvas.width;
    var height = sourceCanvas.height;

    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.beginPath();
    context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
    context.fill();
    return canvas;
  }

  // test() {
  //   window.addEventListener('DOMContentLoaded', function () {
  //     var image = document.getElementById('image');
  //     var button = document.getElementById('button');
  //     var result = document.getElementById('result');

  //     button.onclick = function () {
  //       var croppedCanvas;
  //       var roundedCanvas;
  //       var roundedImage;

  //       if (!croppable) {
  //         return;
  //       }

  //       // Crop
  //       croppedCanvas = cropper.getCroppedCanvas();

  //       // Round
  //       roundedCanvas = getRoundedCanvas(croppedCanvas);

  //       // Show
  //       roundedImage = document.createElement('img');
  //       roundedImage.src = roundedCanvas.toDataURL();
  //       result.innerHTML = '';
  //       result.appendChild(roundedImage);
  //     };
  //   });
  // }
}
