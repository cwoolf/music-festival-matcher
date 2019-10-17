import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FestivalService } from './festival/festival.service';
import { FestivalComponent } from './festival/festival.component';
import { BrowseComponent } from './browse/browse.component';
import { TableComponent } from './table/table.component';
import { ArtistFilterPipe } from './table/artist-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FestivalComponent,
    BrowseComponent,
    TableComponent,
    ArtistFilterPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    FestivalService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
