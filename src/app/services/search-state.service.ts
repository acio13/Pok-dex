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

  saveSearchState(state: SearchState) {
    this.searchState = { ...state };
  }

  getSearchState(): SearchState | null {
    return this.searchState ? { ...this.searchState } : null;
  }

  clearSearchState() {
    this.searchState = null;
    this.scrollPosition = 0;
  }

  hasStoredState(): boolean {
    return this.searchState !== null;
  }

  saveScrollPosition(position: number) {
    this.scrollPosition = position;
  }

  getScrollPosition(): number {
    return this.scrollPosition;
  }
}