import { Component, OnInit } from '@angular/core';
import { Player } from '../../model/player';

@Component({
  selector: 'player-editor',
  templateUrl: './player-editor.component.html',
  styleUrls: ['./player-editor.component.scss'],
})
export class PlayerEditorComponent implements OnInit {
  player: Player = {} as Player;

  constructor() {}

  ngOnInit(): void {}
}
