import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { parse } from 'fast-xml-parser';
import { timer } from 'rxjs';
import { SNACKBAR_CONFIG } from '../const/snackbar-config';
import { BggGame, BggGameCollection, BggGameFull } from '../model/bgg/bgg-game';
import { BggUser } from '../model/bgg/bgg-user';

export type BggApiMethod = 'GET' | 'POST';

export enum BggThingType {
  Game = 'boardgame',
  Expansion = 'boardgameexpansion',
}

const BGG_API_ENDPOINT = 'https://www.boardgamegeek.com/xmlapi2/';

@Injectable({ providedIn: 'root' })
export class BggApiService {
  constructor(private matSnackBar: MatSnackBar) {}

  private getUrlWithParams(api: string, params: any): string {
    const url = new URL(api);
    Object.entries<any>(params || {}).forEach(([k, v]) => {
      url.searchParams.set(k, v);
    });
    return url.toString();
  }

  private async bggFetch(url: string, params: any, method: BggApiMethod = 'GET'): Promise<any> {
    try {
      const response = await fetch(this.getUrlWithParams(BGG_API_ENDPOINT + url, params), { method });
      const xmlData = await response.text();
      const result = await this.parse(xmlData);
      console.log('bggFetch..', url, params, result);
      return result;
    } catch (err) {
      const message = 'Network issue or BoardGameGeek.com is unavailable, try again later';
      this.matSnackBar.open(message, 'OK', SNACKBAR_CONFIG(true));
      throw err;
    }
  }

  private async parse(response: string): Promise<any> {
    return parse(response, {
      parseAttributeValue: true,
      ignoreAttributes: false,
      arrayMode: (tagName, parentTagName) => {
        // console.log('makeRequest.. arrayMode', tagName, parentTagName);
        return tagName === 'item' && parentTagName === 'items';
      },
      attributeNamePrefix: '',
      attrValueProcessor: (val, attrName) => {
        // console.log('makeRequest.. attrValueProcessor', attrName, ' ----> ', val);
        return val;
      },
      tagValueProcessor: (val, tagName) => {
        // console.log('makeRequest.. tagValueProcessor', tagName, ' ----> ', val);
        return val;
      },
    });
  }

  async getGames(params: any): Promise<BggGame[]> {
    const result = await this.bggFetch('search', { ...params, type: BggThingType.Game });
    return result?.items?.item;
  }

  async getGameDetails(params: any): Promise<BggGameFull> {
    const result = await this.bggFetch('things', { ...params, type: [BggThingType.Game, BggThingType.Expansion], stats: 1 });
    return result?.items?.item?.[0];
  }

  async getUserByName(params: any): Promise<BggUser> {
    const result = await this.bggFetch('users', params);
    return result?.user;
  }

  async getUserCollection(params: any): Promise<BggGameCollection[]> {
    const fetchPromise = this.bggFetch('collection', { ...params, subtype: [BggThingType.Game], stats: 1 });
    let result = await fetchPromise;
    console.log('getUserCollection...', result);
    if (result?.message) {
      await timer(3000).toPromise();
      result = await fetchPromise;
    }
    return result?.items?.item;
  }
}
