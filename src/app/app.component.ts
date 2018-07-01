import { Component, OnInit } from '@angular/core';
import { DominionDataService } from './services/dominion-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loading = true;

  constructor(private dominionDataService: DominionDataService) {}

  ngOnInit() {
    this.dominionDataService.initialize()
      .subscribe(() => this.loading = false);
  }
}
