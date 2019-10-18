export interface IFestival {
  id: string;
  name: string;
  url: string;
  location: ILocation;
  dateRange: IDateRange;
  generalAdmissionTicketPriceInDollars?: number;
}

export interface IArtist {
  id: string;
  name: string;
  festivalIds: string[];
  genre?: IGenre;
}

export interface IFilterOptions {
  ticketPriceRange?: IGeneralAdmissionTicketPriceRange;
  dateRange?: IDateRange;
  continent?: IContinent;
  usReqion?: IUsRegion;
  type?: ILocationType;
}

export interface IGeneralAdmissionTicketPriceRange {
  min: number;
  max: number;
}

export interface IDateRange {
  start: number;
  stop: number;
}

export interface ILocation {
  continent: IContinent;
  country: string;
  usRegion?: IUsRegion;
  state: string;
  city: string;
  timeZone: string;
  type: ILocationType;
}

export type IGenre =
  'Pop' |
  'Electronic Dance Music' |
  'Rock' |
  'Indie' |
  'Rythem and Blues' |
  'Country' |
  'Jazz' |
  'Other';

export type IContinent =
  'Asia' |
  'Africa' |
  'North America' |
  'South America' |
  'Europe' |
  'Australia';

export type IUsRegion =
  'Northeast' |
  'Midwest' |
  'South' |
  'West';

export type ILocationType =
  'City' |
  'Camping' |
  'Other';
