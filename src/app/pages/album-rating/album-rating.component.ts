import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-album-rating',
  templateUrl: './album-rating.component.html',
  styleUrls: ['./album-rating.component.css']
})
export class AlbumRatingComponent implements OnInit {

  selectedRating: number = 5;

  constructor(
    public dialogRef: MatDialogRef<AlbumRatingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { album: any }
  ) {}

  ngOnInit(): void {}

  closeDialog(): void {
    this.dialogRef.close(this.selectedRating);
  }
}
