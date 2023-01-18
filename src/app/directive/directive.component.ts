import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directive',
  templateUrl: './directive.component.html',
  styleUrls: ['./directive.component.css']
})
export class DirectiveComponent implements OnInit{

  courseList: String[] = ['TypeScript', 'JavaScript', 'Java', 'C#', 'PHP'];

  available: boolean = false;

  constructor() { }

  ngOnInit(): void {
  } 

  setAvailable(): void{
    this.available = (this.available == false)? true: false
  }
}
