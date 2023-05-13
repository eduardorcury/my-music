import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-album-rating',
  templateUrl: './album-rating.component.html',
  styleUrls: ['./album-rating.component.css']
})
export class AlbumRatingComponent implements OnInit {

  selectedRating: number;

  constructor(
    public dialogRef: MatDialogRef<AlbumRatingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { album: any }
  ) {
    this.selectedRating = 5; // Set the initial rating
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close(this.selectedRating);
  }

  getEmoticon(rating: number): string {
    // You can define your own mapping of ratings to emoticons here
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

}