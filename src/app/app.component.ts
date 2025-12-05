import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PokemonService } from './services/pokemon.service';
import { SearchStateService } from './services/search-state.service';
import { PokemonCard } from './interfaces/pokemon';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'Pokédx Mobile';
  pokemonList: PokemonCard[] = [];
  loading = true;
  loadingMore = false;
  hasMorePokemon = true;
  searchQuery = '';
  isSearching = false;
  currentOffset = 0;
  limit = 150;
  isInSearchMode = false;
  allSearchResults: PokemonCard[] = [];
  showFloatingSearch = false;
  floatingSearchQuery = '';
  private searchTimeout: any = null;
  private routerSubscription: Subscription = new Subscription();
  private scrollListener?: () => void;
  private previousUrl = '';  // Track previous URL to detect navigation from detail page

  constructor(private pokemonService: PokemonService, public router: Router, private searchStateService: SearchStateService) {}

  ngOnInit() {
    this.loadPokemonList();
    
    // Subscribe to router events with custom scroll behavior
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Check if we're navigating to home
        if (event.url === '/' || event.url === '') {
          // Check if we're coming from a detail page and reset search if so
          if (this.previousUrl.includes('/pokemon/') && this.isInSearchMode) {
            // Reset search state to show all Pokemon
            this.clearSearch();
          }
          
          // This is the home page - check if we have a saved scroll position
          // Ripristina la posizione SEMPRE quando si torna alla home, indipendentemente da dove si arriva
          const savedScrollPosition = this.searchStateService.getScrollPosition();
          
          if (savedScrollPosition > 0) {
            // Ripristina la posizione di scroll
            setTimeout(() => {
              window.scrollTo({ top: savedScrollPosition, behavior: 'auto' });
            }, 50);
            
            // Tentativi aggiuntivi per assicurare il ripristino
            setTimeout(() => {
              window.scrollTo({ top: savedScrollPosition, behavior: 'auto' });
            }, 150);
            
            setTimeout(() => {
              window.scrollTo({ top: savedScrollPosition, behavior: 'auto' });
            }, 300);
          } else {
            window.scrollTo(0, 0);
          }
        } else if (event.url.includes('/pokemon/')) {
          // Going to pokemon detail page, scroll to top
          window.scrollTo(0, 0);
        } else if (event.url.includes('/search')) {
          // Going to search page, scroll to top
          window.scrollTo(0, 0);
        }
        
        // Update previous URL for next navigation
        this.previousUrl = event.url;
      });

    // Add scroll listener to save position periodically
    this.scrollListener = () => {
      this.saveScrollPosition();
    };
    
    // Ascolta gli eventi di scroll della finestra
    if (this.scrollListener) {
      window.addEventListener('scroll', this.scrollListener, { passive: true });
    }
  }

  ngAfterViewInit() {
    // Additional check for scroll position restoration after view init
    if (this.router.url === '/' || this.router.url === '') {
      const savedScrollPosition = this.searchStateService.getScrollPosition();
      if (savedScrollPosition > 0) {
        setTimeout(() => {
          window.scrollTo({ top: savedScrollPosition, behavior: 'auto' });
        }, 0);
      }
    }
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  loadPokemonList(): void {
    this.loading = true;
    this.currentOffset = 0;
    this.pokemonService.getPokemonList(this.limit, this.currentOffset).subscribe({
      next: (pokemonList) => {
        this.pokemonList = pokemonList;
        this.currentOffset = pokemonList.length;
        this.hasMorePokemon = pokemonList.length === this.limit;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading Pokemon:', error);
        this.loading = false;
      }
    });
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const query = target.value.trim();
    
    // Clear previous timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    // If query is empty, clear search completely
    if (query.length === 0) {
      this.clearSearch();
      return;
    }
    
    // Debounce search by 300ms for any length query
    this.searchTimeout = setTimeout(() => {
      this.performSearch(query);
    }, 300);
  }
  
  private performSearch(query: string): void {
    this.isSearching = true;
    this.isInSearchMode = true;
    this.currentOffset = 0;
    
    this.pokemonService.searchPokemon(query).subscribe({
      next: (searchResults) => {
        this.allSearchResults = searchResults;
        this.pokemonList = this.allSearchResults.slice(0, this.limit);
        this.currentOffset = Math.min(this.limit, this.allSearchResults.length);
        // Keep isSearching true to show "no results" message when needed
        // Only set to false if we're not in search mode anymore
      },
      error: (error) => {
        console.error('Error searching Pokemon:', error);
        this.pokemonList = [];
        // Keep isSearching true to show "no results" message
      }
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.performSearch(this.searchQuery.trim());
    } else {
      this.clearSearch();
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.isSearching = false;
    this.isInSearchMode = false;
    this.allSearchResults = [];
    this.hasMorePokemon = true;
    
    // Clear search timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    }
    
    this.loadPokemonList();
  }

  loadMore(): void {
    if (this.loadingMore) return; // Previeni chiamate multiple
    
    if (this.isInSearchMode) {
      // Carica più risultati dalla ricerca
      const nextResults = this.allSearchResults.slice(this.currentOffset, this.currentOffset + this.limit);
      if (nextResults.length > 0) {
        this.pokemonList = [...this.pokemonList, ...nextResults];
        this.currentOffset += nextResults.length;
      }
    } else {
      // Caricamento normale tramite API
      this.loadingMore = true;
      this.pokemonService.getPokemonList(this.limit, this.currentOffset).subscribe({
        next: (morePokemon) => {
          this.pokemonList = [...this.pokemonList, ...morePokemon];
          this.currentOffset += morePokemon.length;
          this.hasMorePokemon = morePokemon.length === this.limit;
          this.loadingMore = false;
        },
        error: (error) => {
          console.error('Error loading more Pokemon:', error);
          this.hasMorePokemon = false;
          this.loadingMore = false;
        }
      });
    }
  }

  hasMoreResults(): boolean {
    if (this.isInSearchMode) {
      return this.currentOffset < this.allSearchResults.length;
    }
    return this.hasMorePokemon;
  }

  getTypeColor(type: string): string {
    const typeColors: Record<string, string> = {
      normal: '#A8A878',
      fighting: '#C03028',
      flying: '#A890F0',
      poison: '#A040A0',
      ground: '#E0C068',
      rock: '#B8A038',
      bug: '#A8B820',
      ghost: '#705898',
      steel: '#B8B8D0',
      fire: '#F08030',
      water: '#6890F0',
      grass: '#78C850',
      electric: '#F8D030',
      psychic: '#F85888',
      ice: '#98D8D8',
      dragon: '#7038F8',
      dark: '#705848',
      fairy: '#EE99AC'
    };
    return typeColors[type] || '#68A090';
  }

  navigateToPokemonDetail(pokemonId: number): void {
    // Save current scroll position before navigating
    this.saveHomePageState();
    this.router.navigate(['/pokemon', pokemonId]);
  }

  navigateToSearch(): void {
    // Save current scroll position and state before navigating
    this.saveHomePageState();
    this.router.navigate(['/search']);
  }

  public saveHomePageState(): void {
    const currentUrl = this.router.url;
    
    // Salva la posizione SOLO quando siamo nella home page
    if (currentUrl === '/' || currentUrl === '') {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      this.searchStateService.saveScrollPosition(scrollPosition);
    }
  }

  private saveScrollPosition(): void {
    const currentUrl = this.router.url;
    
    // Salva la posizione di scroll SOLO quando siamo nella home page
    if (currentUrl === '/' || currentUrl === '') {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      
      // Se l'utente è in cima alla pagina (primi 100px), cancella la posizione salvata
      if (scrollPosition <= 100) {
        this.searchStateService.saveScrollPosition(0);
      } else {
        this.searchStateService.saveScrollPosition(scrollPosition);
      }
    }
  }

  isDetailRoute(): boolean {
    return this.router.url.includes('/pokemon/') || this.router.url.includes('/search');
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
    }
  }

  // Floating Search Methods
  toggleFloatingSearch(): void {
    this.showFloatingSearch = !this.showFloatingSearch;
    if (this.showFloatingSearch) {
      // Focus on input after modal opens
      setTimeout(() => {
        const input = document.querySelector('.floating-search-modal .search-input') as HTMLInputElement;
        if (input) input.focus();
      }, 100);
    } else {
      this.floatingSearchQuery = '';
    }
  }

  closeFloatingSearch(event?: Event): void {
    this.showFloatingSearch = false;
    this.floatingSearchQuery = '';
  }

  performFloatingSearch(): void {
    if (this.floatingSearchQuery.trim().length === 0) {
      return;
    }
    
    // Save current scroll position
    this.saveHomePageState();
    
    // Set the main search query and perform search
    this.searchQuery = this.floatingSearchQuery.trim();
    this.performSearch(this.searchQuery);
    
    // Close floating search
    this.closeFloatingSearch();
    
    // Navigate to search page or update current view
    if (this.router.url === '/') {
      // We're on home, the search results will show here
    } else {
      this.router.navigate(['/search']);
    }
  }
}
