import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlbumDTO } from '../dtos/album.dto';
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
    return this.http.get<AlbumDTO[]>(`${this.apiUrl}/recently_played`, { 
      headers: {
        Authorization: code
      }
    });
  }

}
