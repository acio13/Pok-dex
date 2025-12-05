import { Injectable } from '@angular/core';
import { Pokemon } from '../interfaces/pokemon';

export interface SearchState {
  nameFilter: string;
  numberFilter: string | number;
  typeFilter: string;
  generationFilter: string;
  searchResults: Pokemon[];
  hasSearched: boolean;
  isFilterFormOpen: boolean;
  currentPage: number;
  scrollPosition?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SearchStateService {
  private searchState: SearchState | null = null;
  private scrollPosition: number = 0;
  private readonly SCROLL_KEY = 'pokedex_home_scroll_position';
  private readonly SEARCH_STATE_KEY = 'pokedex_search_state';

  constructor() {
    // Carica la posizione di scroll dal sessionStorage all'avvio
    this.loadScrollPosition();
    this.loadSearchState();
  }

  saveSearchState(state: SearchState) {
    this.searchState = { ...state };
    // Persisti nello storage
    try {
      sessionStorage.setItem(this.SEARCH_STATE_KEY, JSON.stringify(this.searchState));
    } catch (error) {
      console.warn('Could not save search state to sessionStorage:', error);
    }
  }

  getSearchState(): SearchState | null {
    return this.searchState ? { ...this.searchState } : null;
  }

  clearSearchState() {
    this.searchState = null;
    this.scrollPosition = 0;
    // Pulisci anche dallo storage
    try {
      sessionStorage.removeItem(this.SEARCH_STATE_KEY);
      sessionStorage.removeItem(this.SCROLL_KEY);
    } catch (error) {
      console.warn('Could not clear state from sessionStorage:', error);
    }
  }

  hasStoredState(): boolean {
    return this.searchState !== null;
  }

  saveScrollPosition(position: number) {
    this.scrollPosition = position;
    // Persisti nello storage
    try {
      sessionStorage.setItem(this.SCROLL_KEY, position.toString());
    } catch (error) {
      console.warn('Could not save scroll position to sessionStorage:', error);
    }
  }

  getScrollPosition(): number {
    return this.scrollPosition;
  }

  private loadScrollPosition() {
    try {
      const saved = sessionStorage.getItem(this.SCROLL_KEY);
      if (saved) {
        this.scrollPosition = parseInt(saved, 10) || 0;
      }
    } catch (error) {
      console.warn('Could not load scroll position from sessionStorage:', error);
    }
  }

  private loadSearchState() {
    try {
      const saved = sessionStorage.getItem(this.SEARCH_STATE_KEY);
      if (saved) {
        this.searchState = JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Could not load search state from sessionStorage:', error);
    }
  }
}