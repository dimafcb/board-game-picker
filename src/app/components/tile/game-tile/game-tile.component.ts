import { Component } from '@angular/core';
import { Game } from '../../../model/game';
import { BasicTileComponent } from '../basic-tile.component';

@Component({
  selector: 'game-tile',
  templateUrl: './game-tile.component.html',
  styleUrls: ['./game-tile.component.scss'],
})
export class GameTileComponent extends BasicTileComponent<Game> {}
