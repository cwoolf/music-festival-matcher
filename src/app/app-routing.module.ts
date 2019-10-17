import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowseComponent } from './browse/browse.component';
import { FestivalComponent } from './festival/festival.component';

const routes: Routes = [
  {
    path: '',
    component: BrowseComponent,
  },
  {
    path: 'festival',
    redirectTo: 'festival/add',
    pathMatch: 'full',
  },
  {
    path: 'festival/:mode',
    component: FestivalComponent,
  },
  {
    path: 'festival/:mode/:name',
    component: FestivalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
