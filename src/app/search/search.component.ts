import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PokemonService } from '../services/pokemon.service';
import { SearchStateService } from '../services/search-state.service';
import { Pokemon } from '../interfaces/pokemon';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  // Search filters
  nameFilter = '';
  numberFilter: string | number = '';
  typeFilter = '';
  generationFilter = '';
  
  searchResults: Pokemon[] = [];
  isLoading = false;
  hasSearched = false;
  currentPage = 1;
  itemsPerPage = 150;
  Math = Math;
  
  // Form visibility control
  isFilterFormOpen = true;
  
  // Scroll position tracking
  private scrollListener?: () => void;

  // Available Pokemon types for type filter
  pokemonTypes = [
    'bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting',
    'fire', 'flying', 'ghost', 'grass', 'ground', 'ice',
    'normal', 'poison', 'psychic', 'rock', 'steel', 'water'
  ];

  // Available Pokemon generations with their ID ranges
  pokemonGenerations = [
    { name: 'Generation I', value: 'gen1', minId: 1, maxId: 151 },
    { name: 'Generation II', value: 'gen2', minId: 152, maxId: 251 },
    { name: 'Generation III', value: 'gen3', minId: 252, maxId: 386 },
    { name: 'Generation IV', value: 'gen4', minId: 387, maxId: 493 },
    { name: 'Generation V', value: 'gen5', minId: 494, maxId: 649 },
    { name: 'Generation VI', value: 'gen6', minId: 650, maxId: 721 },
    { name: 'Generation VII', value: 'gen7', minId: 722, maxId: 809 },
    { name: 'Generation VIII', value: 'gen8', minId: 810, maxId: 905 },
    { name: 'Generation IX', value: 'gen9', minId: 906, maxId: 1025 }
  ];

  constructor(
    private pokemonService: PokemonService,
    private searchStateService: SearchStateService,
    public router: Router
  ) {}

  ngOnInit() {
    // Ripristina lo stato della ricerca precedente se esiste
    const savedState = this.searchStateService.getSearchState();
    if (savedState) {
      this.nameFilter = savedState.nameFilter;
      this.numberFilter = savedState.numberFilter;
      this.typeFilter = savedState.typeFilter;
      this.generationFilter = savedState.generationFilter;
      this.searchResults = savedState.searchResults;
      this.hasSearched = savedState.hasSearched;
      this.isFilterFormOpen = savedState.isFilterFormOpen;
      this.currentPage = savedState.currentPage;
      
      // Ripristina la posizione di scroll
      if (savedState.scrollPosition) {
        setTimeout(() => {
          window.scrollTo({ top: savedState.scrollPosition, behavior: 'auto' });
        }, 100);
      }
    }
    
    // Aggiungi listener per salvare la posizione di scroll
    this.scrollListener = () => {
      if (this.hasSearched) {
        this.saveScrollPosition();
      }
    };
    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  ngOnDestroy() {
    // Rimuovi il listener dello scroll
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
    
    // Salva lo stato quando si esce dalla pagina
    if (this.hasSearched) {
      this.saveCurrentState();
    }
  }

  get isHomeActive(): boolean {
    return this.router.url === '/';
  }

  get isSearchActive(): boolean {
    return this.router.url === '/search';
  }

  async onSearch() {
    // Check if at least one filter is provided
    const hasNameFilter = this.nameFilter.trim();
    const hasNumberFilter = this.numberFilter.toString().trim();
    const hasTypeFilter = this.typeFilter.trim();
    const hasGenerationFilter = this.generationFilter.trim();
    
    if (!hasNameFilter && !hasNumberFilter && !hasTypeFilter && !hasGenerationFilter) {
      return;
    }

    // Hide filters immediately when search is clicked
    this.isFilterFormOpen = false;
    
    this.hasSearched = true;
    this.isLoading = true;
    this.searchResults = [];
    this.currentPage = 1;

    try {
      // Get all Pokemon first, then filter
      this.performCombinedSearch();
    } catch (error) {
      console.error('Error during search:', error);
      this.isLoading = false;
    }
  }

  private async performCombinedSearch() {
    let results: Pokemon[] = [];
    
    // If number filter is provided, search by number first (most specific)
    if (this.numberFilter.toString().trim()) {
      const pokemonId = parseInt(this.numberFilter.toString().trim());
      if (!isNaN(pokemonId) && pokemonId >= 1) {
        try {
          const pokemon = await this.pokemonService.getPokemonDetails(pokemonId.toString()).toPromise();
          if (pokemon) {
            results = [pokemon];
          }
        } catch (error) {
          console.warn(`Could not find Pokemon with ID ${pokemonId}`);
        }
      }
    } 
    // If type filter is provided, get Pokemon by type
    else if (this.typeFilter.trim()) {
      try {
        const typeResults = await this.pokemonService.getPokemonByType(this.typeFilter.trim().toLowerCase()).toPromise();
        if (typeResults) {
          // Get detailed information for ALL type results (removed limit)
          const detailPromises = typeResults.map(pokemonCard => 
            this.pokemonService.getPokemonDetails(pokemonCard.name).toPromise()
          );
          const detailedResults = await Promise.all(detailPromises);
          results = detailedResults.filter(pokemon => pokemon !== null) as Pokemon[];
        }
      } catch (error) {
        console.error('Error searching by type:', error);
      }
    }
    // If only name filter is provided, search by name (use the same logic as home page)
    else if (this.nameFilter.trim()) {
      try {
        const nameResults = await this.pokemonService.searchPokemon(this.nameFilter.trim()).toPromise();
        if (nameResults) {
          // Don't convert to full Pokemon objects, just use the search results directly
          // Convert PokemonCard to minimal Pokemon structure for display
          results = nameResults.map(card => ({
            id: card.id,
            name: card.name.toLowerCase().replace(/\s+/g, '-'),
            sprites: {
              front_default: card.imageUrl,
              other: {
                'official-artwork': {
                  front_default: card.imageUrl
                }
              }
            },
            types: card.types.map(typeName => ({
              slot: 1,
              type: { name: typeName, url: '' }
            }))
          } as any));
        }
      } catch (error) {
        console.error('Error searching by name:', error);
      }
    }
    // If only generation filter is provided, get all Pokemon from that generation
    else if (this.generationFilter.trim()) {
      try {
        const generation = this.pokemonGenerations.find(g => g.value === this.generationFilter.trim());
        if (generation) {
          const generationResults: Pokemon[] = [];
          // Get all Pokemon in the generation range
          for (let i = generation.minId; i <= generation.maxId; i++) {
            try {
              const pokemon = await this.pokemonService.getPokemonDetails(i.toString()).toPromise();
              if (pokemon) {
                generationResults.push(pokemon);
              }
            } catch (error) {
              console.warn(`Could not find Pokemon with ID ${i}`);
            }
          }
          results = generationResults;
        }
      } catch (error) {
        console.error('Error searching by generation:', error);
      }
    }

    // Apply additional filters to the results
    results = this.applyAdditionalFilters(results);
    
    this.searchResults = results.sort((a, b) => a.id - b.id);
    this.isLoading = false;
    
    // Salva lo stato della ricerca
    this.saveCurrentState();
  }

  private applyAdditionalFilters(results: Pokemon[]): Pokemon[] {
    let filteredResults = [...results];

    // Apply name filter if provided (and not used as primary filter)
    if (this.nameFilter.trim() && (this.numberFilter.toString().trim() || this.typeFilter.trim() || this.generationFilter.trim())) {
      const nameQuery = this.nameFilter.trim().toLowerCase();
      filteredResults = filteredResults.filter(pokemon => 
        pokemon.name.toLowerCase().includes(nameQuery)
      );
    }

    // Apply type filter if provided (and not used as primary filter)
    if (this.typeFilter.trim() && (this.numberFilter.toString().trim() || this.nameFilter.trim() || this.generationFilter.trim())) {
      const typeQuery = this.typeFilter.trim().toLowerCase();
      filteredResults = filteredResults.filter(pokemon => 
        pokemon.types.some(type => type.type.name.toLowerCase() === typeQuery)
      );
    }

    // Apply generation filter if provided (and not used as primary filter)
    if (this.generationFilter.trim() && (this.numberFilter.toString().trim() || this.nameFilter.trim() || this.typeFilter.trim())) {
      const generation = this.pokemonGenerations.find(g => g.value === this.generationFilter.trim());
      if (generation) {
        filteredResults = filteredResults.filter(pokemon => 
          pokemon.id >= generation.minId && pokemon.id <= generation.maxId
        );
      }
    }

    return filteredResults;
  }

  private saveCurrentState() {
    const state = {
      nameFilter: this.nameFilter,
      numberFilter: this.numberFilter,
      typeFilter: this.typeFilter,
      generationFilter: this.generationFilter,
      searchResults: this.searchResults,
      hasSearched: this.hasSearched,
      isFilterFormOpen: this.isFilterFormOpen,
      currentPage: this.currentPage,
      scrollPosition: window.pageYOffset || document.documentElement.scrollTop
    };
    this.searchStateService.saveSearchState(state);
  }

  private saveScrollPosition() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    this.searchStateService.saveScrollPosition(scrollPosition);
  }

  toggleFilterForm() {
    this.isFilterFormOpen = !this.isFilterFormOpen;
    // Salva lo stato quando si toglie la visibilità dei filtri
    if (this.hasSearched) {
      this.saveCurrentState();
    }
  }

  clearSearch() {
    this.nameFilter = '';
    this.numberFilter = '';
    this.typeFilter = '';
    this.generationFilter = '';
    this.searchResults = [];
    this.hasSearched = false;
    this.isFilterFormOpen = true;
    // Cancella lo stato salvato
    this.searchStateService.clearSearchState();
  }

  getPaginatedResults() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.searchResults.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.searchResults.length) {
      this.currentPage++;
      this.saveCurrentState();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.saveCurrentState();
    }
  }

  canGoNext(): boolean {
    return this.currentPage * this.itemsPerPage < this.searchResults.length;
  }

  canGoPrevious(): boolean {
    return this.currentPage > 1;
  }

  getTotalPages(): number {
    return Math.ceil(this.searchResults.length / this.itemsPerPage);
  }

  navigateToPokemon(pokemonId: number) {
    // Salva la posizione di scroll prima di navigare
    this.saveScrollPosition();
    this.router.navigate(['/pokemon', pokemonId]);
  }

  goBack() {
    this.router.navigate(['/']);
  }

  navigateToSearch() {
    // Nella pagina search, torna alla home
    this.router.navigate(['/']);
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

  getCardBackground(pokemon: Pokemon): string {
    const firstType = pokemon.types[0]?.type?.name || 'normal';
    const secondType = pokemon.types[1]?.type?.name || firstType;
    return `linear-gradient(135deg, ${this.getTypeColor(firstType)}, ${this.getTypeColor(secondType)})`;
  }
}
