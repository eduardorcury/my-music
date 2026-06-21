import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { Album } from 'src/app/shared/dominio/album.model';
import { OrderingType } from 'src/app/shared/dominio/ordering';
import { SpotifyService } from 'src/app/shared/services/spotify.service';
import { MatDialog } from '@angular/material/dialog';
import { AlbumRatingComponent } from '../album-rating/album-rating.component';
import { ActivatedRoute } from '@angular/router';
import { SaveAlbumDTO } from 'src/app/shared/dtos/save.album.dto';

export interface RankingEntry {
  nome: string;
  media: number;
  count: number;
}

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
  orderingTypes = Object.values(OrderingType);
  selectedOrder: OrderingType = OrderingType.ANO_DESC;
  savedAlbunsList: Album[] = [];
  sortedSavedAlbunsList: Album[] = [];
  recentAlbunsList: Album[] = [];
  artistRanking: RankingEntry[] = [];
  decadeRanking: RankingEntry[] = [];

  constructor(private spotifyService: SpotifyService,
              private dialog: MatDialog,
              private route: ActivatedRoute) {

    this.searchControl = new FormControl('');
    this.searchControl.valueChanges
      .pipe(debounceTime(this.debounceTime))
      .subscribe(query => spotifyService.search(query)
        .subscribe(resposta => this.albuns = resposta.map(album => ({
          nome: album.nome,
          uriSpotify: album.uriSpotify,
          urlImagem: album.urlImagem,
          id: album.id,
          artistas: album.artistas,
          dataDeLancamento: album.dataDeLancamento,
          nota: ''
        } as Album))));

    this.route.queryParams.subscribe(params => {
      if (this.authenticationToken == "" || this.authenticationToken === undefined) {
        if (params["code"]) {
          this.authenticationCode = params["code"];
          this.spotifyService.exchangeCode(this.authenticationCode).subscribe(token => {
            this.authenticationToken = token.token;
            sessionStorage.setItem("token", token.token);
            this.getRecentAlbums();
            this.setSavedAlbums();
          });
        } else {
          this.spotifyService.login().subscribe(resposta => window.location.href = resposta);
        }
      } else {
        this.getRecentAlbums();
        this.setSavedAlbums();
      }
    });
  }

  ngOnInit(): void {}

  get ratedCount(): number {
    return this.savedAlbunsList.filter(a => a.nota && a.nota !== '').length;
  }

  salvarAlbum(album: Album): void {
    this.spotifyService.saveAlbum({ albumId: album.id } as SaveAlbumDTO, this.authenticationToken).subscribe();
    if (!this.savedAlbunsList.find(a => a.id === album.id)) {
      this.savedAlbunsList.push(album);
      this.sortSavedAlbums();
    }
  }

  avaliarAlbum(album: Album): void {
    const dialogRef = this.dialog.open(AlbumRatingComponent, {
      width: '380px',
      panelClass: 'rating-window',
      data: { album }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spotifyService.saveAlbum({ albumId: album.id, albumRating: result } as SaveAlbumDTO, this.authenticationToken).subscribe();
        const existing = this.savedAlbunsList.find(a => a.id === album.id);
        if (existing) {
          existing.nota = result;
        } else {
          this.savedAlbunsList.push({ ...album, nota: result });
        }
        this.sortSavedAlbums();
        this.computeRankings();
      }
    });
  }

  changeOrder(): void {
    this.sortSavedAlbums();
  }

  getRecentAlbums(): void {
    this.spotifyService.getRecentAlbums(this.authenticationToken).subscribe(recentAlbums => {
      this.recentAlbunsList = recentAlbums.map(album => ({
        nome: album.nome,
        uriSpotify: album.uriSpotify,
        urlImagem: album.urlImagem,
        id: album.id,
        artistas: album.artistas,
        dataDeLancamento: album.dataDeLancamento,
        nota: ''
      } as Album));
    });
  }

  setSavedAlbums(): void {
    this.spotifyService.getAlbums(this.authenticationToken).subscribe(albumList => {
      this.savedAlbunsList = albumList;
      this.sortSavedAlbums();
      this.computeRankings();
    });
  }

  sortSavedAlbums(): void {
    const list = [...this.savedAlbunsList];
    switch (this.selectedOrder) {
      case OrderingType.ANO_DESC:
        list.sort((a, b) => b.dataDeLancamento.localeCompare(a.dataDeLancamento));
        break;
      case OrderingType.ANO_ASC:
        list.sort((a, b) => a.dataDeLancamento.localeCompare(b.dataDeLancamento));
        break;
      case OrderingType.NOTA_DESC:
        list.sort((a, b) => (parseFloat(b.nota) || 0) - (parseFloat(a.nota) || 0));
        break;
    }
    this.sortedSavedAlbunsList = list;
  }

  computeRankings(): void {
    const rated = this.savedAlbunsList.filter(a => a.nota && a.nota !== '');

    const artistMap = new Map<string, { total: number; count: number }>();
    rated.forEach(album => {
      const artist = album.artistas[0];
      const nota = parseFloat(album.nota);
      const entry = artistMap.get(artist) ?? { total: 0, count: 0 };
      entry.total += nota;
      entry.count += 1;
      artistMap.set(artist, entry);
    });
    this.artistRanking = Array.from(artistMap.entries())
      .map(([nome, { total, count }]) => ({ nome, media: total / count, count }))
      .sort((a, b) => b.media - a.media)
      .slice(0, 5);

    const decadeMap = new Map<string, { total: number; count: number }>();
    rated.forEach(album => {
      const year = parseInt(album.dataDeLancamento.split('-')[0]);
      const decade = `${Math.floor(year / 10) * 10}s`;
      const entry = decadeMap.get(decade) ?? { total: 0, count: 0 };
      entry.total += parseFloat(album.nota);
      entry.count += 1;
      decadeMap.set(decade, entry);
    });
    this.decadeRanking = Array.from(decadeMap.entries())
      .map(([nome, { total, count }]) => ({ nome, media: total / count, count }))
      .sort((a, b) => b.media - a.media)
      .slice(0, 3);
  }

  async setAuthorizationToken(code: string): Promise<void> {
    this.spotifyService.exchangeCode(code).subscribe(token => {
      this.authenticationToken = token.token;
      sessionStorage.setItem("token", token.token);
    });
  }
}
