import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Game } from '../../model/game';
import { GamesService } from '../../services/games.service';
import { TextScramble } from '../../utils/text-scramble';

@Component({
  selector: '[result-dialog]',
  templateUrl: './result-dialog.component.html',
  styleUrls: ['./result-dialog.component.scss'],
})
export class ResultDialogComponent implements OnInit {
  @ViewChild('resultText', {
    static: true,
  })
  resultText!: ElementRef<HTMLDivElement>;
  result: Game | undefined;

  constructor(private gamesService: GamesService) {}

  ngOnInit(): void {}

  async pickRandom(games: Game[]): Promise<void> {
    const el = this.resultText.nativeElement;
    this.result = undefined;
    const result = this.gamesService.pickRandom(games);
    console.log('START..', this.resultText, result);

    if (result) {
      const scrabble = new TextScramble(el);
      await scrabble.setText(result.name);
      this.result = result;
    } else {
      el.innerHTML = 'No games';
    }
  }
}
