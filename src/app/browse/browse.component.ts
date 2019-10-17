import { Component, OnInit } from '@angular/core';
import { FestivalService } from '../festival/festival.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {

  constructor(
    public festivalService: FestivalService,
  ) { }

  ngOnInit() {
    this.festivalService.getArtists();
    this.festivalService.getFestivals();
  }

}
