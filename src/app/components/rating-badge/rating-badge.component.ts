import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'rating-badge, [rating-badge]',
  templateUrl: './rating-badge.component.html',
  styleUrls: ['./rating-badge.component.scss'],
})
export class RatingBadgeComponent implements OnChanges {
  @Input() value: number | undefined;
  @Input() ratingBgg = false;
  @Input() ratingHoverable = false;
  @Input() tooltip?: string;

  @Output() action = new EventEmitter();

  valueRounded = 0;

  constructor() {}

  onClick(): void {
    this.action.emit();
  }

  ngOnChanges(): void {
    this.valueRounded = Math.floor(this.value || 0);
  }
}
