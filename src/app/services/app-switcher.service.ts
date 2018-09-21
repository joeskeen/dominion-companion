import { Injectable } from '@angular/core';
import { IDiscoveryApplication } from '@healthcatalyst/cashmere';
import { of } from 'rxjs';

@Injectable()
export class DominionAppSwitcherService {
    getApplications() {
      return of({ value: [
        {
          Description: 'Dominion at Rio Grande Games',
          FriendlyName: 'Official Site',
          Icon: 'http://www.gateplay.com/images/logos/rio_grande_games.gif',
          ServiceUrl: 'http://riograndegames.com/games.html?id=278'
        },
        {
          Description: 'Dominion at BoardGameGeek',
          FriendlyName: 'BoardGameGeek',
          Icon: 'https://pbs.twimg.com/profile_images/1254446238/Geek_Head_400x400.jpg',
          ServiceUrl: 'https://boardgamegeek.com/boardgame/36218/dominion'
        }
      ] as IDiscoveryApplication[] });
    }
  }
