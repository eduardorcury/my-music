import { Component, OnInit } from '@angular/core';
import { liveQuery, Observable } from 'dexie';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { database, DatabaseAlbum } from 'src/app/shared/database/database';
import { Album } from 'src/app/shared/dominio/album.model';
import { SpotifyService } from 'src/app/shared/services/spotify.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  debounceTime: number = 1000;
  searchControl: FormControl;
  albuns: Album[] = [];
  databaseAlbuns$: Observable<DatabaseAlbum[]>;

  constructor(private spotifyService: SpotifyService) {
    this.searchControl = new FormControl('');
    this.searchControl.valueChanges
      .pipe(debounceTime(this.debounceTime))
      .subscribe(query => spotifyService.search(query)
        .subscribe(resposta => this.albuns = resposta.map(album => {
          return {
            nome: album.nome,
            uriSpotify: album.uriSpotify,
            urlImagem: album.urlImagem,
            id: album.id,
            artistas: album.artistas,
            dataDeLancamento: album.dataDeLancamento
          } as Album
        })));
    this.databaseAlbuns$ = liveQuery(() => database.albuns.toArray());
  }

  ngOnInit(): void {
  }

  salvarAlbum(album: Album): void {
    console.log(album)
    database.albuns.where('uriSpotify')
      .equals(album.uriSpotify)
      .count(function (count) {
        if (count == 0) {
          database.albuns.add({
            nome: album.nome,
            uriSpotify: album.uriSpotify,
            urlImagem: album.urlImagem,
            artistas: album.artistas
          });
        }
      })
  }

}
