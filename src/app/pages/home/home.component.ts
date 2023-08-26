import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/shared/services/spotify.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private spotifyService: SpotifyService) { 
  }

  ngOnInit(): void {
  }

  autorizar() {
    this.spotifyService.login().subscribe(resposta => {
      window.location.href = resposta;
    });
  }

}
