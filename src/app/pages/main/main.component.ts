import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, debounceTime, of, tap } from 'rxjs';
import { database, DatabaseAlbum } from 'src/app/shared/database/database';
import { Album } from 'src/app/shared/dominio/album.model';
import { SpotifyService } from 'src/app/shared/services/spotify.service';
import { MatDialog } from '@angular/material/dialog';
import { AlbumRatingComponent } from '../album-rating/album-rating.component';
import { OrderedAlbumList, OrderingType } from 'src/app/shared/dominio/ordering';
import { ActivatedRoute } from '@angular/router';
import { AlbumDTO } from 'src/app/shared/dtos/album.dto';
import { SaveAlbumDTO } from 'src/app/shared/dtos/save.album.dto';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  authenticationCode: string = "";
  authenticationToken: string = sessionStorage.getItem("token") || "";
  debounceTime: number = 1000;
  searchControl: FormControl;
  albuns: Album[] = [];
  savedAlbums$: Observable<AlbumDTO[]> = new Observable;
  orderingTypes = Object.values(OrderingType);
  selectedOrder: OrderingType = OrderingType.DECADA;
  orderedList: OrderedAlbumList = new OrderedAlbumList([]);
  recentAlbunsList: Album[] = [];

  constructor(private spotifyService: SpotifyService,
              private dialog: MatDialog,
              private route: ActivatedRoute) {

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
    this.route.queryParams
        .subscribe(async params => {
          console.log(params);
          if (!params["code"]) {
            await this.spotifyService.login().subscribe(resposta => {
              window.location.href = resposta;
              this.authenticationCode = params["code"];
            });
          } else {
            this.authenticationCode = params["code"];
          }
        }
    );
    if (!this.authenticationToken || this.authenticationToken == null) {
      this.spotifyService.exchangeCode(this.authenticationCode)
        .subscribe(token => {
          this.authenticationToken = token.token;
          sessionStorage.setItem("token", token.token);
          this.getRecentAlbums();
          this.savedAlbums$ = this.spotifyService.getAlbums(this.authenticationToken)
          this.savedAlbums$.subscribe(albumList => {
            console.log(albumList)
            this.orderedList = new OrderedAlbumList(albumList);
            this.orderedList.orderBy(this.selectedOrder);
          });
        });
    } else {
      this.getRecentAlbums();
      this.savedAlbums$ = this.spotifyService.getAlbums(this.authenticationToken)
      this.savedAlbums$.subscribe(albumList => {
        console.log(albumList)
        this.orderedList = new OrderedAlbumList(albumList);
        this.orderedList.orderBy(this.selectedOrder);
      });
    }
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

        this.spotifyService.saveAlbum( { albumId: album.id , albumRating: notaDoAlbum } as SaveAlbumDTO, 
          this.authenticationToken).subscribe();
        this.orderedList.albuns.push( { ...album, nota: notaDoAlbum } as Album)
        this.orderedList.orderBy(this.selectedOrder);
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
    
  getRecentAlbums() {
    this.spotifyService.getRecentAlbums(this.authenticationToken).subscribe(recentAlbums => {
      this.recentAlbunsList = recentAlbums.map(album => {
        return {
          nome: album.nome,
          uriSpotify: album.uriSpotify,
          urlImagem: album.urlImagem,
          id: album.id,
          artistas: album.artistas,
          dataDeLancamento: album.dataDeLancamento
        } as Album
      });
    })
  }

}
