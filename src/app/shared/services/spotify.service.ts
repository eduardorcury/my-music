import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlbumDTO } from '../dtos/album.dto';
import { SaveAlbumDTO } from '../dtos/save.album.dto';
import { TokenDTO } from '../dtos/token.dto';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  apiUrl = "http://localhost:8080"

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
