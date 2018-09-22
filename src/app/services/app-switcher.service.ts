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
        },
        {
          Description: 'Dominion Strategy Wiki',
          FriendlyName: 'Strategy Wiki',
          Icon: 'http://wiki.dominionstrategy.com/skins/common/images/dslogo.png',
          ServiceUrl: 'http://wiki.dominionstrategy.com'
        },
        {
          Description: 'Divider generator for the card game Dominion and its expansions.',
          FriendlyName: 'Tab Generator',
          Icon: 'https://avatars1.githubusercontent.com/u/9730025?s=400&v=4g',
          ServiceUrl: 'http://domtabs.sandflea.org/'
        }
      ] as IDiscoveryApplication[] });
    }
  }
