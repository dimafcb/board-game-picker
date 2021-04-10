import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { parse } from 'fast-xml-parser';
import { SNACKBAR_CONFIG } from '../const/snackbar-config';
import { BggGame, BggGameFull } from '../model/bgg/bgg-game';
import { BggUser } from '../model/bgg/bgg-user';

export type BggApiMethod = 'GET' | 'POST';

const BGG_API_ENDPOINT = 'https://www.boardgamegeek.com/xmlapi2/';

@Injectable({ providedIn: 'root' })
export class BggApiService {
  constructor(private matSnackBar: MatSnackBar) {}

  private makeRequest(url: string, method: BggApiMethod = 'GET'): Promise<any> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          const parsedResult = parse(xhr.response, {
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
          console.log('parsedResult', parsedResult);
          resolve(parsedResult);
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText,
          });
        }
      };
      xhr.onerror = function () {
        reject({
          status: this.status,
          statusText: xhr.statusText,
        });
      };
      xhr.send();
    }).catch((err) => {
      console.log('ERROR', err);
      const message = err.statusText || 'Network error or BoardGameGeek.com is unavailable, try again later';
      this.matSnackBar.open(message, 'OK', SNACKBAR_CONFIG(true));
      throw err;
    });
  }

  private getUrlWithParams(api: string, params: any): string {
    const url = new URL(api);
    Object.entries<any>(params || {}).forEach(([k, v]) => {
      url.searchParams.set(k, v);
    });
    return url.toString();
  }

  searchGames(params: any): Promise<BggGame[]> {
    const url = this.getUrlWithParams(BGG_API_ENDPOINT + 'search', params);
    return this.makeRequest(url).then((resp) => resp?.items?.item);
  }

  getGameDetails(params: any): Promise<BggGameFull> {
    const url = this.getUrlWithParams(BGG_API_ENDPOINT + 'things', params);
    return this.makeRequest(url).then((resp) => resp?.items?.item?.[0]);
  }

  getUserByName(params: any): Promise<BggUser> {
    const url = this.getUrlWithParams(BGG_API_ENDPOINT + 'users', params);
    return this.makeRequest(url).then((resp) => resp?.user);
  }

  getUserCollection(params: any): Promise<BggGameFull> {
    const url = this.getUrlWithParams(BGG_API_ENDPOINT + 'collection', params);
    return this.makeRequest(url).then((resp) => resp?.items?.item?.[0]);
  }
}
