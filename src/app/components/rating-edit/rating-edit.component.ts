import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'rating-edit',
  templateUrl: './rating-edit.component.html',
  styleUrls: ['./rating-edit.component.scss'],
})
export class RatingEditComponent implements OnChanges {
  @Input() value: number | undefined = 0;
  @Output() valueChange = new EventEmitter<number>();

  rating!: number;
  editMode = false;
  items: number[] = [...Array(10)].map((v, i) => i + 1);

  constructor() {}

  ngOnChanges(): void {
    this.rating = Math.round(Math.min(this.value || 0, this.items.length));
  }

  select(rating: number): void {
    this.rating = rating;
    this.editMode = false;
    this.valueChange.next(this.rating);
  }

  toggle(): void {
    this.editMode = !this.editMode;
  }
}
