import { Component, OnInit, Input } from '@angular/core';
import { FestivalService } from '../festival/festival.service';
import { IFestival, IArtist } from '../shared';

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
