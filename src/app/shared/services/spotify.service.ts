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

  apiUrl = "http://ec2-18-228-175-23.sa-east-1.compute.amazonaws.com:8080"

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
