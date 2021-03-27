import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { PlayerEditorComponent } from './components/player-editor/player-editor.component';

@NgModule({
  declarations: [AppComponent, PlayerEditorComponent],
  imports: [
    // angular
    BrowserModule,
    BrowserAnimationsModule,
    // material
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    OverlayModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
