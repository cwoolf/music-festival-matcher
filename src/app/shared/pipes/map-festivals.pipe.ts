import { Pipe, PipeTransform } from '@angular/core';
import { IFestival, IArtist } from '../shared.interfaces';

@Pipe({
  name: 'mapFestivals'
})
export class MapFestivalsPipe implements PipeTransform {
  transform(artist: IArtist, festivals: IFestival[]) {
    const matchingFestivals = artist.festivalIds.map(id => festivals.find(f => f.id === id));
    return matchingFestivals;
  }
}
