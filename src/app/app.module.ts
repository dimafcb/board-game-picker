import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { DynamicDialogComponent } from './components/dynamic-dialog/dynamic-dialog.component';
import { GameEditorComponent } from './components/editor/game-editor/game-editor.component';
import { ListEditorComponent } from './components/editor/list-editor/list-editor.component';
import { PlayerEditorComponent } from './components/editor/player-editor/player-editor.component';
import { ImagePickerComponent } from './components/image-picker/image-picker.component';
import { ImageWrapperComponent } from './components/image-wrapper/image-wrapper.component';
import { RatingBadgeComponent } from './components/rating-badge/rating-badge.component';
import { RatingEditComponent } from './components/rating-edit/rating-edit.component';
import { ResultDialogComponent } from './components/result-dialog/result-dialog.component';
import { GameTileComponent } from './components/tile/game-tile/game-tile.component';
import { PlayerTileComponent } from './components/tile/player-tile/player-tile.component';
import { SVG_ICONS } from './const/svg-icons';
import { DATE_PROVIDER } from './providers/date-format.provider';
import { MAT_TOOLTIP_CONFIG } from './providers/tooltip-config-token';

@NgModule({
  declarations: [
    AppComponent,
    PlayerEditorComponent,
    GameEditorComponent,
    ImagePickerComponent,
    RatingEditComponent,
    RatingBadgeComponent,
    PlayerTileComponent,
    GameTileComponent,
    ImageWrapperComponent,
    ListEditorComponent,
    ResultDialogComponent,
    DynamicDialogComponent,
  ],
  imports: [
    // angular
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    // material
    MatAutocompleteModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule,
    // material cdk
    DragDropModule,
    OverlayModule,
    // 3rd party
  ],
  providers: [DATE_PROVIDER, MAT_TOOLTIP_CONFIG, MatIconRegistry],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    SVG_ICONS.forEach((icon) => {
      this.iconRegistry.addSvgIcon(icon, this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/images/${icon}.svg`));
    });
  }
}
