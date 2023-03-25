import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AlbumDTO } from '../dtos/album.dto';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(private http: HttpClient) { }

  search(query: string) {
    return this.http.get<AlbumDTO[]>("http://ec2-18-231-30-11.sa-east-1.compute.amazonaws.com:8080/pesquisa", { 
      params: { 
        album: query 
      } 
    });
  }
}
