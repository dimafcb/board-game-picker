import { Component, ComponentFactoryResolver, OnInit, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { BasicTileComponent } from '../../tile/basic-tile.component';

@Component({
  selector: 'list-editor',
  templateUrl: './list-editor.component.html',
  styleUrls: ['./list-editor.component.scss'],
})
export class ListEditorComponent<T, C extends BasicTileComponent<T>> implements OnInit {
  items$!: Observable<T[]>;
  itemFactory!: Type<C>;

  constructor(private resolver: ComponentFactoryResolver) {}

  ngOnInit(): void {}

  update(): void {
    console.log('ListEditorComponent..', this.itemFactory);
    const cmp = this.resolver.resolveComponentFactory(this.itemFactory);
    console.log('ListEditorComponent..', cmp);
  }
}
