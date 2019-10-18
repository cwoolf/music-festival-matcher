import { Component, OnInit } from '@angular/core';
import { FestivalService } from './festival.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IFestival, IArtist } from '../shared';
import { CONTINENTS, COUNTRIES, REGIONS, STATES, LOCATION_TYPES } from '../shared';
import * as uuid from 'uuidv4';

@Component({
  selector: 'app-festival',
  templateUrl: './festival.component.html',
  styleUrls: ['./festival.component.scss']
})
export class FestivalComponent implements OnInit {

  artistsTable: IArtist[] = [];
  artistNames: string[] = [];
  artist1 = '';
  artist2 = '';
  newArtist = '';
  festival: IFestival;
  mode: 'Add' | 'Update' = 'Add';
  continents = CONTINENTS;
  countries = COUNTRIES;
  regions = REGIONS;
  states = STATES;
  locationTypes = LOCATION_TYPES;

  constructor(
    public festivalService: FestivalService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
  ) {
    this.resetFestival();
    this.festivalService.getArtists();
    this.festivalService.getFestivals();
    this.activatedRoute.params.subscribe(params => {
      this.mode = params.mode;
      if (params.name) {
        const festival = this.festivalService.getFestivalByName(decodeURIComponent(params.name));
        if (festival) {
          this.festival = festival;
          this.artistNames = this.festivalService.artists
            .filter(artist => {
              return artist.festivalIds.indexOf(this.festival.id) > -1;
            })
            .map(a => a.name);
        }
      }
    });
  }

  getArtistNamesFromWebPage() {
    this.festivalService.getArtistNamesFromWebPage(this.festival.url, this.artist1, this.artist2)
      .then((artists: string[]) => this.artistNames = artists);
  }

  addFestival() {
    if (typeof this.festival.generalAdmissionTicketPriceInDollars === 'string') {
      this.festival.generalAdmissionTicketPriceInDollars = parseInt(this.festival.generalAdmissionTicketPriceInDollars, 10);
    }
    const success = this.festivalService.addFestival(this.festival, this.artistNames);
    if (success) {
      this.router.navigate(['/']);
    }
  }

  resetFestival() {
    this.festival = {
      id: uuid.default(),
      name: '',
      url: '',
      location: {
        continent: 'North America',
        country: 'United States',
        usRegion: null,
        state: null,
        city: null,
        type: 'Camping',
        timeZone: '',
      },
      dateRange: {
        start: null,
        stop: null,
      },
      generalAdmissionTicketPriceInDollars: 0,
    };
  }

  addArtist() {
    this.artistNames.push(this.newArtist);
    this.artistNames.sort();
    this.newArtist = '';
  }

  removeArtist(index: number) {
    this.artistNames.splice(index, 1);
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }


  ngOnInit() {
  }

}
