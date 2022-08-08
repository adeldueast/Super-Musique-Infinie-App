import { Concert } from 'src/app/models/concert';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-concert-card',
  templateUrl: './concert-card.component.html',
  styleUrls: ['./concert-card.component.css'],
})
export class ConcertCardComponent implements OnInit {
  @Input() concert?: Concert;
  constructor() {}

  ngOnInit() {}
}
