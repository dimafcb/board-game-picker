import { Injectable } from '@angular/core';
import { parse } from 'fast-xml-parser';
import { GameBgg, GameBggFull } from '../model/game-bgg';

export type BggApiMethod = 'GET' | 'POST';

const BGG_API_ENDPOINT = 'https://www.boardgamegeek.com/xmlapi2/';

@Injectable({ providedIn: 'root' })
export class BggApiService {
  constructor() {}

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
    });
  }

  private getUrlWithParams(api: string, params: any): string {
    const url = new URL(api);
    Object.entries<any>(params || {}).forEach(([k, v]) => {
      url.searchParams.set(k, v);
    });
    return url.toString();
  }

  searchGames(params: any): Promise<GameBgg[]> {
    const url = this.getUrlWithParams(BGG_API_ENDPOINT + 'search', params);
    return this.makeRequest(url).then((resp) => resp?.items?.item);
  }

  getGameDetails(params: any): Promise<GameBggFull> {
    const url = this.getUrlWithParams(BGG_API_ENDPOINT + 'things', params);
    return this.makeRequest(url).then((resp) => resp?.items?.item?.[0]);
  }
}
