import { Component, OnInit } from '@angular/core';
import { FestivalService } from '../festival/festival.service';
import { IFestival } from '../shared';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {

  constructor(
    public festivalService: FestivalService,
  ) { }

  getFestivalLink(festival: IFestival): string {
    return `/festival/update/${encodeURIComponent(festival.name)}`;
  }

  ngOnInit() {
    this.festivalService.getArtists();
    this.festivalService.getFestivals();
  }

}
