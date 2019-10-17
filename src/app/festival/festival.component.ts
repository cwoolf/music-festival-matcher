import { Component, OnInit } from '@angular/core';
import { FestivalService, IFestival, IArtist } from './festival.service';
import { Router, ActivatedRoute } from '@angular/router';

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
  festival: IFestival;
  mode: 'Add' | 'Update' = 'Add';

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
        const festival = this.festivalService.getFestivalByName(params.name);
        if (festival) {
          this.festival = festival;
          this.artistNames = this.festivalService.artists.map(artist => {
            return artist.name;
          });
        }
      }
    });
  }

  getArtistNamesFromWebPage() {
    this.festivalService.getArtistNamesFromWebPage(this.festival.url, this.artist1, this.artist2)
      .then((artists: string[]) => this.artistNames = artists);
  }

  addFestival() {
    if (typeof this.festival.priceInDollars === 'string') {
      this.festival.priceInDollars = parseInt(this.festival.priceInDollars, 10);
    }
    const success = this.festivalService.addFestival(this.festival, this.artistNames);
    if (success) {
      this.router.navigate(['/']);
    }
  }

  resetFestival() {
    this.festival = {
      name: '',
      url: '',
      location: {
        continent: 'North America',
        country: 'United States',
        usRegion: null,
        state: '',
        city: '',
        type: 'Camping',
        timeZone: '',
      },
      dateRange: {
        startDate: '',
        stopDate: '',
      },
      priceInDollars: 0,
    };
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }


  ngOnInit() {
  }

}
