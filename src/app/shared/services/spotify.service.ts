import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlbumDTO } from '../dtos/album.dto';
import { TokenDTO } from '../dtos/token.dto';
import { SaveAlbumDTO } from '../dtos/save.album.dto';
import { DatabaseAlbum } from '../database/database';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  apiUrl = "https://akq51p7417.execute-api.sa-east-1.amazonaws.com/default"

  constructor(private http: HttpClient) { }

  login() {
    return this.http.get<string>(`${this.apiUrl}/login`);
  }

  exchangeCode(code: string) {
    return this.http.get<TokenDTO>(`${this.apiUrl}/token`, {
      params: {
        code: code
      }
    })
  }

  search(query: string) {
    return this.http.get<AlbumDTO[]>(`${this.apiUrl}/pesquisa`, { 
      params: { 
        album: query 
      } 
    });
  }

  getRecentAlbums(code: string) {
    return this.http.get<AlbumDTO[]>(`${this.apiUrl}/albums/recently_played`, { 
      headers: {
        Authorization: "Bearer " + code
      }
    });
  }

  getAlbums(code: string) {
    return this.http.get<AlbumDTO[]>(`${this.apiUrl}/albums`, {
      headers: {
        Authorization: "Bearer " + code
      }
    });
  }

  saveAlbum(album: SaveAlbumDTO, code: string) {
    return this.http.post(`${this.apiUrl}/albums`, album, {
      headers: {
        Authorization: "Bearer " + code
      }
    });
  }

}
