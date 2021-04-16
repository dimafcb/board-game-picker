import { Component } from '@angular/core';
import { Player } from '../../../model/player';
import { BasicTileComponent } from '../basic-tile.component';

@Component({
  selector: 'player-tile',
  templateUrl: './player-tile.component.html',
  styleUrls: ['./player-tile.component.scss'],
})
export class PlayerTileComponent extends BasicTileComponent<Player> {}
