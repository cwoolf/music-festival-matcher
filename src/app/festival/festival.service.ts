import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import * as uuid from 'uuidv4';
import * as FuzzySearch from 'fuzzy-search';
import { IFestival, IArtist } from '../shared';

@Injectable({
  providedIn: 'root'
})
export class FestivalService {

  // Global http request options
  requestOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'text/plain; charset=utf-8',
    }),
    responseType: 'text' as 'json',
  };
  festivals: IFestival[] = [];
  artists: IArtist[] = [];
  mustSeeArtists: IArtist[] = [];
  bestFestivalMatches: IFestival[] = [];

  constructor(
    public http: HttpClient,
  ) { }

  getWebPage(url: string): Promise<any> {
    const requestUrl = `https://peaceful-harbor-72801.herokuapp.com/${url}`;

    return this.http.get(requestUrl, this.requestOptions)
      .toPromise()
      .catch(this.handleError);
  }

  /**
   * Attempt to scrape artists from HTML string (No JavaScript executed on webpage)
   * @param url music festival interactive lineup url
   * @param artist1 an artist name that appears in lineup
   * @param artist2 another artist name that appears in lineup
   */
  async getArtistNamesFromWebPage(url: string, artist1: string, artist2: string): Promise<string[]> {
    try {
      const htmlString = await this.getWebPage(url);

      const artists: string[] = [];
      const dom = new DOMParser().parseFromString(htmlString, 'text/html');

      // tslint:disable-next-line:max-line-length
      const artist1XPath = `//*[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${artist1.toLowerCase()}')]`;
      let artist1Elements = document.evaluate(artist1XPath, dom, null, XPathResult.ANY_TYPE, null);

      // tslint:disable-next-line:max-line-length
      const artist2XPath = `//*[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${artist2.toLowerCase()}')]`;
      let artist2Elements = document.evaluate(artist2XPath, dom, null, XPathResult.ANY_TYPE, null);

      let artist1Element = null;
      let artist2Element = null;
      let artist1ClassList: string[] = [];
      let artist2ClassList: string[] = [];
      let classListMatches = [];
      let isElementClassMatch = false;

      // Find two elements from artist elements with at least one matching class
      // tslint:disable-next-line:no-conditional-assignment
      while (!isElementClassMatch && (artist1Element = artist1Elements.iterateNext())) {
        artist1ClassList = Array.from((artist1Element as HTMLElement).classList);

        // tslint:disable-next-line:no-conditional-assignment
        while (!isElementClassMatch && (artist2Element = artist2Elements.iterateNext())) {
          artist2ClassList = Array.from((artist2Element as HTMLElement).classList);
          classListMatches = artist1ClassList.filter(className => artist2ClassList.includes(className));
          if (classListMatches.length > 0) {
            isElementClassMatch = true;
          }
        }
      }

      // If still no match, invert above search
      if (!isElementClassMatch) {

        artist1Elements = document.evaluate(artist1XPath, dom, null, XPathResult.ANY_TYPE, null);
        artist2Elements = document.evaluate(artist2XPath, dom, null, XPathResult.ANY_TYPE, null);

        // Find two elements from artist elements with at least one matching class
        // tslint:disable-next-line:no-conditional-assignment
        while (!isElementClassMatch && (artist2Element = artist2Elements.iterateNext())) {
          artist2ClassList = Array.from((artist2Element as HTMLElement).classList);

          // tslint:disable-next-line:no-conditional-assignment
          while (!isElementClassMatch && (artist1Element = artist1Elements.iterateNext())) {
            artist1ClassList = Array.from((artist1Element as HTMLElement).classList);
            classListMatches = artist2ClassList.filter(className => artist1ClassList.includes(className));
            if (classListMatches.length > 0) {
              isElementClassMatch = true;
            }
          }
        }
      }

      if (classListMatches && classListMatches.length > 0) {
        const selector = `.${classListMatches.join('.')}`;
        const artistElements = Array.from(dom.querySelectorAll(selector));
        (artistElements as HTMLElement[]).forEach((el) => artists.push(el.innerText.trim()));
      } else {
        return Promise.resolve([]);
      }
      return Promise.resolve(Array.from(new Set(artists)));
    } catch (err) {
      console.log(err);
      return Promise.resolve([]);
    }
  }

  getArtists() {
    // tslint:disable-next-line:no-string-literal
    if (localStorage['artists']) {
      // tslint:disable-next-line:no-string-literal
      this.artists = JSON.parse(localStorage['artists']);
    }
  }

  getFestivals() {
    // tslint:disable-next-line:no-string-literal
    if (localStorage['festivals']) {
      // tslint:disable-next-line:no-string-literal
      this.festivals = JSON.parse(localStorage['festivals']);
    }
  }

  getFestivalByName(name: string) {
    return this.festivals.find(festival => festival.name === name);
  }

  getBestFestivalMatches() {
    const festivals = [];
    let maxMatches = 0;

    this.festivals.forEach((festival, index) => {
      let mustSeeMatchCount = 0;
      const artists = this.artists.filter(artist => {
        if (artist.festivalIds.indexOf(festival.id) > -1) {
          const hasMustSee = this.mustSeeArtists.some(a => a.id === artist.id);
          if (hasMustSee) {
            mustSeeMatchCount++;
          }
        }
      });

      // ToDo: Improve sorting
      if (mustSeeMatchCount >= maxMatches) {
        festivals.unshift(festival);
        maxMatches = mustSeeMatchCount;
      } else {
        festivals.push(festival);
      }
    });

    this.bestFestivalMatches = (festivals.length > 3) ? festivals.slice(0, 3) : festivals;
  }

  addFestival(festival: IFestival, artistNames: string[]): boolean {
    try {
      let artistsTable: IArtist[] = [];
      let festivalsTable: IFestival[] = [];

      // tslint:disable-next-line:no-string-literal
      if (localStorage['artists']) {
        // tslint:disable-next-line:no-string-literal
        artistsTable = JSON.parse(localStorage['artists']);
        artistNames.forEach(artistName => {
          const searcher = new FuzzySearch(artistsTable, ['name']);
          const result = searcher.search(artistName);
          // Artist with similar name exists, might not match verbatim
          if (result.length > 0) {
            // Artist already exists, verbatim match
            if (result[0].name.toLowerCase().trim() === artistName.toLowerCase().trim()) {
              const i = artistsTable.findIndex(a => a.name.toLowerCase().trim() === artistName.toLowerCase().trim());
              if (i > 0) {
                artistsTable[i].festivalIds.push(festival.id);
              }
            } else {
              // ToDo: Add artist to conflict array, prompt user to decide whether to mark as match or add new
              artistsTable.push(...[{ id: uuid.default(), name: artistName, festivalIds: [festival.id] }]);
            }
          } else {
            artistsTable.push(...[{ id: uuid.default(), name: artistName, festivalIds: [festival.id] }]);
          }
        });
      } else {
        artistNames.forEach(artistName => {
          artistsTable.push(...[{ id: uuid.default(), name: artistName, festivalIds: [festival.id] }]);
        });
      }

      // tslint:disable-next-line:no-string-literal
      if (localStorage['festivals']) {
        // tslint:disable-next-line:no-string-literal
        festivalsTable = JSON.parse(localStorage['festivals']);
        const searcher = new FuzzySearch(festivalsTable, ['name']);
        const result = searcher.search(festival.name);
        if (result.length > 0) {
          if (result[0].name === festival.name) {
            // Replace expired festival lineups
            if (festival.dateRange.start < new Date().getTime()) {
              const i = festivalsTable.findIndex(fest => fest.name === festival.name);
              festivalsTable.splice(i, 1);
            } else {
              // ToDo: Add artist to conflict array, prompt user to decide whether to mark as match or add new
            }
          }
        }
      }
      festivalsTable.push(festival);

      // Sort arrays
      artistsTable.sort(this.sortByName);
      festivalsTable.sort(this.sortByName);

      // tslint:disable-next-line:no-string-literal
      localStorage['artists'] = JSON.stringify(artistsTable);
      // tslint:disable-next-line:no-string-literal
      localStorage['festivals'] = JSON.stringify(festivalsTable);

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  addToMustSee(artist: IArtist) {
    this.mustSeeArtists.push(artist);
  }

  sortByName(a, b) {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    } else {
      return 0;
    }
  }

  handleError(response: HttpErrorResponse): Promise<any> {
    let errMsg: any = null;
    if (response instanceof HttpErrorResponse && response && response.error) {
      errMsg = response.error;
    }
    return Promise.reject(errMsg);
  }

}
