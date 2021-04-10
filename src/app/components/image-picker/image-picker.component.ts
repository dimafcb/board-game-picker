import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent {
  @Input() image?: string;
  @Input() icon?: string;
  @Output() selected = new EventEmitter();

  imageSelected(element: HTMLInputElement): void {
    const imageFile = element.files?.[0];

    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        console.log(reader.result);
        this.selected.emit(reader.result as string);
      },
      false
    );

    if (imageFile) {
      reader.readAsDataURL(imageFile);
    }
  }

  deleteImage(): void {
    this.selected.emit();
  }
}
