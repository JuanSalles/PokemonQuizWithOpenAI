import { Component } from '@angular/core';
import { Ranking } from '../Types/types';
import { RankingService } from '../ranking.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent {

  ranking: Ranking = [];

  constructor(private rankingService: RankingService) { }

  ngOnInit(): void {
    this.rankingService.getRanking().subscribe(ranking => {
      this.ranking = ranking;
    });
  }
}
