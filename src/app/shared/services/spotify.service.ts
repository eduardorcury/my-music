import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AlbumDTO } from '../dtos/album.dto';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(private http: HttpClient) { }

  login() {
    console.log("teste2");
    return this.http.get("http://ec2-15-229-69-255.sa-east-1.compute.amazonaws.com:8080/login");
  }

  search(query: string) {
    return this.http.get<AlbumDTO[]>("http://ec2-15-229-69-255.sa-east-1.compute.amazonaws.com:8080/pesquisa", { 
      params: { 
        album: query 
      } 
    });
  }
}
