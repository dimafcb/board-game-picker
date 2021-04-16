import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'image-wrapper, [image-wrapper]',
  templateUrl: './image-wrapper.component.html',
  styleUrls: ['./image-wrapper.component.scss'],
})
export class ImageWrapperComponent implements OnInit {
  @Input() image?: string;
  @Input() class?: string;
  @Input() icon?: string;

  constructor() {}

  ngOnInit(): void {}
}
