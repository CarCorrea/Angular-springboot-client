import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent implements OnInit, OnChanges {
  
  @Input() paginator: any;
  pages: number[];

  from: number;
  untill: number;

  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    this.from = Math.min( Math.max(1, this.paginator.number - 4), this.paginator.totalPages - 5);
    this.untill = Math.max( Math.min(this.paginator.totalPages, this.paginator.number + 4), 6);

    if(this.paginator.totalPages > 5){
      this.pages = new Array(this.untill-this.from+1).fill(0).map((_valor, index) => index + this.from);
    } else {
      this.pages = new Array(this.paginator.totalPages).fill(0).map((_valor, index) => index + 1);
    }

  }

}
