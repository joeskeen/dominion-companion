import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';

import { AppComponent } from './app.component';
import {
  NavbarModule,
  ButtonModule,
  CheckboxModule,
  ListModule,
  IconModule,
  AppSwitcherModule,
  TileModule,
  TabsModule,
  AccordionModule,
  RadioButtonModule,
  InputModule,
  APP_SWITCHER_CONFIG,
  APP_SWITCHER_SERVICE
} from '@healthcatalyst/cashmere';
import { LocaleService } from './services/locale.service';
import { DominionDataService } from './services/dominion-data.service';
import { RandomizerService } from './randomizer/randomizer.service';
import { RandomizerComponent } from './randomizer/randomizer.component';
import { FormsModule } from '@angular/forms';
import { CardSummaryComponent } from './card-summary/card-summary.component';
import { PreferencesService } from './services/preferences.service';
import { ModalModule } from '@healthcatalyst/cashmere';
import { RandomizerSettingsComponent } from './randomizer-settings/randomizer-settings.component';
import { SelectedExpansionsService } from './services/selected-expansions.service';
import { DescriptionPipe } from './pipes/description.pipe';
import { DominionAppSwitcherService } from './services/app-switcher.service';

@NgModule({
  declarations: [
    AppComponent,
    RandomizerComponent,
    CardSummaryComponent,
    RandomizerSettingsComponent,
    DescriptionPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NavbarModule,
    ListModule,
    IconModule,
    AppSwitcherModule,
    ButtonModule,
    CheckboxModule,
    ModalModule,
    TileModule,
    TabsModule,
    AccordionModule,
    RadioButtonModule,
    InputModule,
    RouterModule.forRoot([
      { path: 'randomizer', component: RandomizerComponent },
      { path: '', pathMatch: 'full', redirectTo: 'randomizer' }
    ])
  ],
  providers: [
    LocaleService,
    DominionDataService,
    RandomizerService,
    LocalStorage,
    PreferencesService,
    SelectedExpansionsService
  ],
  entryComponents: [RandomizerSettingsComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
