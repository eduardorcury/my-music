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
  formValue: String = 'Teste';

  constructor() { 
    this.searchControl = new FormControl('');
    this.subject = new Subject();
    //this.formValue = new Observable();
    this.searchControl.valueChanges.subscribe(value => {
      this.subject.next(value);
      console.log(`Subject ${this.subject} Form ${this.searchControl.value}`);
    });
  }

  ngOnInit(): void {
    this.subject.pipe(
      map(text => {
        this.formValue = text;
        console.log(this.formValue);
      })
    );
  }

}
