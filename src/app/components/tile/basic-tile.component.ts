import { Component } from '@angular/core';
import { EventEmitter, Input, Output } from '@angular/core';

@Component({ template: '' })
export class BasicTileComponent<T> {
  @Input() item!: T;
  @Input() editMode = false;
  @Output() action = new EventEmitter<T>();

  constructor() {}

  click(): void {
    this.action.emit(this.item);
  }
}
