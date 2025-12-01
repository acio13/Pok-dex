import { Routes } from '@angular/router';
import { PokemonDetailComponent } from './pokemon-detail/pokemon-detail.component';
import { SearchComponent } from './search/search.component';

export const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'pokemon/:id', component: PokemonDetailComponent }
];
