import { Component, OnInit, Input } from '@angular/core';
import { FestivalService, IFestival, IArtist } from '../festival/festival.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  text = '';

  constructor(
    public festivalService: FestivalService,
  ) { }

  getFestivalLink(festival: IFestival): string {
    return `/festival/update/${encodeURIComponent(festival.name)}`;
  }

  addToMustSee(artist: IArtist) {
    this.festivalService.addToMustSee(artist);
  }

  ngOnInit() {
  }

}
