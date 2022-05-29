import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, map, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  searchControl: FormControl;
  subject: Subject<String>;
  formValue: String = '';

  constructor() { 
    this.searchControl = new FormControl('');
    this.subject = new Subject();
    // this.formValue = new Observable();
    this.searchControl.valueChanges.subscribe(value => this.subject.next(value));
  }

  ngOnInit(): void {
    this.subject.pipe(
      debounceTime(1000), 
      map(text => this.formValue = text)
    );
  }

}
