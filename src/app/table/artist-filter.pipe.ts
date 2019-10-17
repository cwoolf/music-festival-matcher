import { Pipe, PipeTransform } from '@angular/core';
import { IArtist } from '../festival/festival.service';

@Pipe({
  name: 'artistFilter'
})
export class ArtistFilterPipe implements PipeTransform {

  transform(artists: IArtist[], text: string, mustSeeArtists: IArtist[]): any {
    const filtered = artists.filter((artist => {
      let visible = true;
      if (text && text.length > 0) {
        if (artist.name.toLowerCase().indexOf(text.toLowerCase()) === -1 &&
          artist.festivals.filter(f => f.name.toLowerCase().indexOf(text.toLowerCase()) > -1).length > 0) {
          visible = false;
        }
      }
      if (mustSeeArtists && mustSeeArtists.length > 0) {
        const mustSees = mustSeeArtists.filter(ms => {
          return artist.festivals.filter(fest => {
            return artists.find(ar => ar.name === ms.name);
          });
        });
        visible = (mustSees && mustSees.length === mustSeeArtists.length);
      }
      return visible;
    }));
    return filtered;
  }

}
