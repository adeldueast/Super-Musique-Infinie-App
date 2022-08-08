import { TrustPipe } from './pipes/trust/trust.pipe';
import { ConcertCardComponent } from './components/concert-card/concert-card.component';
import { AlbumsComponent } from './components/albums/albums.component';
import { Home } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ArtistCardComponent } from './components/artist-card/artist-card.component';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MyArtistsService } from './services/artists/MyArtists.service';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { PageNotFoundComponent } from './components/PageNotFound/PageNotFound.component';
import { ChansonsComponent } from './components/chansons/chansons.component';
import { AudioPlayerComponent } from './components/chanson-card/chanson-card.component';
import { ConcertsComponent } from './components/concerts/concerts/concerts.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

const routes: Routes = [
  { path: 'home', component: Home },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: ':artistName/albums', component: AlbumsComponent },
  { path: ':artistName/:albumId/tracks', component: ChansonsComponent },
  { path: ':artistName/concerts', component: ConcertsComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' },
]; // sets up routes constant where you define your routes

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ArtistCardComponent,
    Home,
    AlbumsComponent,
    ChansonsComponent,
    AudioPlayerComponent,
    ConcertsComponent,
    ConcertCardComponent,
    TrustPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    GoogleMapsModule,
    RouterModule.forRoot(routes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [MyArtistsService],
  bootstrap: [AppComponent],
  exports: [RouterModule],
})
export class AppModule {}
