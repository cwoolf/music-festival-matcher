import { Pipe, PipeTransform } from '@angular/core';
import { IArtist, IFilterOptions, IFestival } from '../shared';

@Pipe({
  name: 'tableFilter'
})
export class TablePipe implements PipeTransform {

  transform(artists: IArtist[], festivals: IFestival[], text: string, mustSeeArtists: IArtist[], options: IFilterOptions): IArtist[] {
    const hasOptions = options && Object.values(options).find(v => (v));
    if (text) {
      text = text.toLowerCase().trim();
    }

    const filtered = artists.filter((artist => {

      // Filter by text input
      if (text && text.length > 0) {

        // Find artists with partial or perfect matching names
        if (artist.name.toLowerCase().trim().indexOf(text) > -1) {
          return true;
        }

        // Find artists playing matching festivals
        const isArtistPlayingFestival = artist.festivalIds.find(id => {
          const festival = festivals.find(f => f.id === id);
          return festival && festival.name.toLowerCase().trim().indexOf(text) > -1;
        });
        if (isArtistPlayingFestival) {
          return true;
        }

      } else if (!hasOptions) {
        return true;
      }

      // if (mustSeeArtists && mustSeeArtists.length > 0) {
      //   const mustSees = mustSeeArtists.filter(ms => {
      //     return artist.festivals.filter(fest => {
      //       return artists.find(ar => ar.name === ms.name);
      //     });
      //   });
      //   visible = (mustSees && mustSees.length === mustSeeArtists.length);
      // }

      return false;
    }));
    return filtered;
  }

}
