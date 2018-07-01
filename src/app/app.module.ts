import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CookieModule } from 'ngx-cookie';

import { AppComponent } from './app.component';
import { NavbarModule, ButtonModule, CheckboxModule } from '@healthcatalyst/cashmere';
import { LocaleService } from './services/locale.service';
import { DominionDataService } from './services/dominion-data.service';
import { RandomizerService } from './randomizer/randomizer.service';
import { RandomizerComponent } from './randomizer/randomizer.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    RandomizerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NavbarModule,
    ButtonModule,
    CheckboxModule,
    RouterModule.forRoot([
      { path: 'randomizer', component: RandomizerComponent },
      { path: '', pathMatch: 'full', redirectTo: 'randomizer' }
    ]),
    CookieModule.forRoot()
  ],
  providers: [ LocaleService, DominionDataService, RandomizerService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
