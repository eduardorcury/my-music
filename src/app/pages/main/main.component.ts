import { Component, OnInit } from '@angular/core';
import { liveQuery, Observable } from 'dexie';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { database, DatabaseAlbum } from 'src/app/shared/database/database';
import { Album } from 'src/app/shared/dominio/album.model';
import { SpotifyService } from 'src/app/shared/services/spotify.service';
import { MatDialog } from '@angular/material/dialog';
import { AlbumRatingComponent } from '../album-rating/album-rating.component';
import { OrderedAlbumList, OrderingType } from 'src/app/shared/dominio/ordering';

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
  orderingTypes = Object.values(OrderingType);
  selectedOrder: OrderingType = OrderingType.DECADA;
  orderedList: OrderedAlbumList = new OrderedAlbumList([]);

  constructor(private spotifyService: SpotifyService,
    private dialog: MatDialog) {
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

    this.databaseAlbuns$.subscribe(albumList => {
      this.orderedList = new OrderedAlbumList(
        albumList.map(databaseAlbum => {
          return {
            nome: databaseAlbum.nome,
            uriSpotify: databaseAlbum.uriSpotify,
            urlImagem: databaseAlbum.urlImagem,
            artistas: databaseAlbum.artistas,
            dataDeLancamento: databaseAlbum.dataDeLancamento,
            nota: databaseAlbum.nota
          } as Album;
        })
      );
      this.orderedList.orderBy(this.selectedOrder);
    });

  }

  ngOnInit(): void {
  }

  salvarAlbum(album: Album): void {
    const dialogRef = this.dialog.open(AlbumRatingComponent, {
      width: '40%',
      height: '40%',
      panelClass: 'rating-window',
      data: { album }
    });

    let notaDoAlbum: string;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        notaDoAlbum = result;
        database.albuns.where('uriSpotify')
          .equals(album.uriSpotify)
          .count(function (count) {
            if (count == 0) {
              database.albuns.add({
                nome: album.nome,
                uriSpotify: album.uriSpotify,
                urlImagem: album.urlImagem,
                artistas: album.artistas,
                dataDeLancamento: album.dataDeLancamento,
                nota: notaDoAlbum
              });
            }
          })
      }
    });
  }

  getEmoticon(albumRating: string): string {
    // You can define your own mapping of ratings to emoticons here
    var rating = +albumRating;
    if (rating < 1) return '🤮';
    if (1 <= rating && rating < 2) return '😖';
    if (2 <= rating && rating < 3) return '🙁';
    if (3 <= rating && rating < 4) return '😕';
    if (4 <= rating && rating < 5) return '😐';
    if (5 <= rating && rating < 6) return '🙂';
    if (6 <= rating && rating < 7) return '😄';
    if (7 <= rating && rating < 8) return '🥰';
    if (8 <= rating && rating < 9) return '😍';
    if (9 <= rating && rating <= 10) return '🤩';
    return '';
  }

  changeOrder() {
    this.orderedList.orderBy(this.selectedOrder);
  }

}
