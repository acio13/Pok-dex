import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../services/pokemon.service';
import { Pokemon, EvolutionInfo, PokemonSpecies } from '../interfaces/pokemon';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.scss'
})
export class PokemonDetailComponent implements OnInit {
  pokemon: Pokemon | null = null;
  pokemonVariants: Pokemon[] = [];
  evolutionLine: EvolutionInfo[] = [];
  loading = true;
  pokemonId: string | null = null;
  pokemonSpecies: PokemonSpecies | null = null;
  basePokemonName?: string;
  basePokemonId?: number;
  abilityDetails: Record<string, any> = {};
  pokemonCategory = '';
  pokemonDescriptions: {flavor_text: string, version: {name: string}, language: {name: string}}[] = [];
  showAllDescriptions = false;
  allVariants: Pokemon[] = [];
  cosmeticForms: Pokemon[] = [];
  
  // Touch gesture properties
  private touchStartX: number = 0;
  private touchEndX: number = 0;
  private minSwipeDistance: number = 50;
  public swipeDirection: 'left' | 'right' | null = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private pokemonService: PokemonService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.pokemonId = params.get('id');
      if (this.pokemonId) {
        this.loadPokemonDetails(this.pokemonId);
      }
    });
  }

  loadPokemonDetails(nameOrId: string) {
    this.loading = true;
    this.pokemon = null;
    this.pokemonVariants = [];

    // Load basic Pokemon data
    this.pokemonService.getPokemonDetails(nameOrId).subscribe({
      next: (pokemon: Pokemon) => {
        this.pokemon = pokemon;
        this.basePokemonName = pokemon.name;
        
        // Set basePokemonId using species URL - this works for all forms
        if (pokemon.species?.url) {
          this.basePokemonId = this.extractSpeciesIdFromUrl(pokemon.species.url);
        } else {
          this.basePokemonId = pokemon.id;
        }
        
        // Load species data for descriptions and category
        this.loadSpeciesData(pokemon.id);
        
        // Load evolution line  
        this.loadEvolutionLine(pokemon.id);
        
        // Load variants based on species
        this.loadVariantsFromSpecies(pokemon.id);
        
        // Load ability details
        // this.loadAbilitiesDetails(pokemon);
        
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading Pokemon details:', err);
        this.loading = false;
      }
    });
  }

  loadSpeciesData(pokemonId: number) {
    if (!this.pokemon?.species?.url) {
      console.error('No species URL found for species data');
      return;
    }
    
    // Use species ID extracted from Pokemon's species URL
    const speciesId = this.extractSpeciesIdFromUrl(this.pokemon.species.url);
    
    this.pokemonService.getPokemonSpecies(speciesId).subscribe({
      next: (species: PokemonSpecies) => {
        this.pokemonSpecies = species;
        
        // Set category and descriptions from species data
        this.pokemonCategory = species.genera.find((genus: any) => 
          genus.language.name === 'en')?.genus || 'Unknown';
        this.pokemonDescriptions = species.flavor_text_entries.filter((entry: any) =>
          entry.language.name === 'en');
      },
      error: (err: any) => {
        console.error('Error loading species data:', err);
      }
    });
  }

  loadEvolutionLine(pokemonId: number) {
    if (!this.pokemon?.species?.url) {
      console.error('No species URL found for evolution chain');
      return;
    }
    
    // Use species ID extracted from Pokemon's species URL
    const baseSpeciesId = this.extractSpeciesIdFromUrl(this.pokemon.species.url);
    this.pokemonService.getEvolutionLine(baseSpeciesId).subscribe({
      next: (evolutionData: EvolutionInfo[]) => {
        this.evolutionLine = evolutionData;
      },
      error: (err: any) => {
        console.error('Error loading evolution chain:', err);
        this.evolutionLine = [];
      }
    });
  }

  loadVariantsFromSpecies(pokemonId: number) {
    if (!this.pokemon?.species?.url) {
      this.allVariants = this.pokemon ? [this.pokemon] : [];
      return;
    }
    
    // Extract species ID from the Pokemon's species URL
    const speciesId = this.extractSpeciesIdFromUrl(this.pokemon.species.url);
    
    this.pokemonService.getPokemonSpecies(speciesId).subscribe({
      next: (species: any) => {
        // Get all variants from the species
        this.pokemonService.getPokemonVariants(species).subscribe({
          next: (variants: Pokemon[]) => {
            if (variants.length > 0) {
              // Remove duplicates based on ID
              this.allVariants = variants.filter((pokemon, index, self) => 
                index === self.findIndex(p => p.id === pokemon.id)
              );
            } else {
              // If no variants found, use only the current Pokemon
              this.allVariants = this.pokemon ? [this.pokemon] : [];
            }
          },
          error: (err: any) => {
            console.error('Error loading variants:', err);
            this.allVariants = this.pokemon ? [this.pokemon] : [];
          }
        });
      },
      error: (err: any) => {
        console.error('Error loading species for variants:', err);
        this.allVariants = this.pokemon ? [this.pokemon] : [];
      }
    });
  }

  goBack(): void {
    window.history.back();
  }

  navigateToVariant(variantId: number): void {
    if (variantId !== this.pokemon?.id) {
      this.router.navigate(['/pokemon', variantId]);
    }
  }

  navigateToEvolution(pokemonId: number): void {
    this.router.navigate(['/pokemon', pokemonId]);
  }

  hasMultipleEvolutions(): boolean {
    if (!this.pokemon || this.evolutionLine.length <= 1) return false;
    
    // Check if there are multiple evolutions at the same level
    const levelCounts: { [key: number]: number } = {};
    
    this.evolutionLine.forEach(evolution => {
      const level = evolution.level || 0;
      levelCounts[level] = (levelCounts[level] || 0) + 1;
    });
    
    // Check if we have the classic "single base -> multiple alternatives" pattern (like Eevee)
    // This is when level 0 has 1 Pokemon and level 1 has multiple Pokemon
    const hasBaseWithMultipleDirectEvolutions = 
      levelCounts[0] === 1 && levelCounts[1] > 1;
    
    return hasBaseWithMultipleDirectEvolutions;
  }

  isMixedEvolution(): boolean {
    if (!this.pokemon || this.evolutionLine.length <= 1) return false;
    
    const levelCounts: { [key: number]: number } = {};
    
    this.evolutionLine.forEach(evolution => {
      const level = evolution.level || 0;
      levelCounts[level] = (levelCounts[level] || 0) + 1;
    });
    
    const levels = Object.keys(levelCounts).map(Number).sort();
    
    // Check if it's a mixed evolution (linear progression with alternatives at the end)
    // Like Oddish -> Gloom -> {Vileplume, Bellossom}
    if (levels.length >= 3) {
      // Check if the last level has multiple Pokemon and previous levels are linear
      const lastLevel = levels[levels.length - 1];
      const hasAlternativesAtEnd = levelCounts[lastLevel] > 1;
      const isLinearBeforeEnd = levels.slice(0, -1).every(level => levelCounts[level] === 1);
      
      return hasAlternativesAtEnd && isLinearBeforeEnd;
    }
    
    return false;
  }

  getLinearEvolutionBeforeAlternatives(): any[] {
    if (!this.isMixedEvolution()) return [];
    
    const levelCounts: { [key: number]: number } = {};
    
    this.evolutionLine.forEach(evolution => {
      const level = evolution.level || 0;
      levelCounts[level] = (levelCounts[level] || 0) + 1;
    });
    
    const levels = Object.keys(levelCounts).map(Number).sort();
    const lastLevel = levels[levels.length - 1];
    
    // Return all Pokemon before the alternative level
    return this.evolutionLine.filter(evolution => (evolution.level || 0) < lastLevel);
  }

  getAlternativeEvolutions(): any[] {
    if (!this.isMixedEvolution()) return [];
    
    const levelCounts: { [key: number]: number } = {};
    
    this.evolutionLine.forEach(evolution => {
      const level = evolution.level || 0;
      levelCounts[level] = (levelCounts[level] || 0) + 1;
    });
    
    const levels = Object.keys(levelCounts).map(Number).sort();
    const lastLevel = levels[levels.length - 1];
    
    // Return all Pokemon at the alternative level
    return this.evolutionLine.filter(evolution => (evolution.level || 0) === lastLevel);
  }

  getEvolutionMethodText(evolution: EvolutionInfo): string {
    return evolution.evolutionMethod || 'Unknown evolution method';
  }

  getBasePokemon(): EvolutionInfo | null {
    return this.evolutionLine.length > 0 ? this.evolutionLine[0] : null;
  }

  getEvolutions(): EvolutionInfo[] {
    return this.evolutionLine.slice(1);
  }

  toggleDescriptions(): void {
    this.showAllDescriptions = !this.showAllDescriptions;
  }

  getLatestDescription(): string {
    if (this.pokemonDescriptions.length === 0) return 'No description available.';
    
    // Get the most recent description (usually the last in the array)
    const latest = this.pokemonDescriptions[this.pokemonDescriptions.length - 1];
    return this.cleanFlavorText(latest.flavor_text);
  }

  getLatestDescriptionVersion(): string {
    if (this.pokemonDescriptions.length === 0) return '';
    
    const latest = this.pokemonDescriptions[this.pokemonDescriptions.length - 1];
    return this.cleanGameName(latest.version.name);
  }

  cleanFlavorText(text: string): string {
    return text.replace(/\f/g, ' ').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  }

  cleanGameName(name: string): string {
    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  getVariantLabel(pokemonName: string): string {
    return pokemonName.split('-')
      .filter(part => part !== 'male' && part !== 'female' && part !== 'm' && part !== 'f')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  // Display methods
  getDisplayVariants(): Pokemon[] {
    return this.allVariants.length > 1 ? this.allVariants : (this.pokemon ? [this.pokemon] : []);
  }

  // Female variant methods
  hasFemaleVariant(variant: Pokemon): boolean {
    return !!(variant.sprites?.front_female || 
              variant.sprites?.other?.home?.front_female);
  }

  getFemaleVariantImage(variant: Pokemon): string {
    return variant.sprites?.other?.home?.front_female ||
           variant.sprites?.front_female ||
           'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
  }

  hasDedicatedFemaleVariant(variant?: Pokemon): boolean {
    return false;
  }

  hasBasePokemon(): boolean {
    if (!this.pokemon?.species?.url) return false;
    
    const speciesId = this.extractSpeciesIdFromUrl(this.pokemon.species.url);
    return this.pokemon.id !== speciesId;
  }

  goToBasePokemon(): void {
    if (!this.pokemon?.species?.url) return;
    
    const speciesId = this.extractSpeciesIdFromUrl(this.pokemon.species.url);
    if (this.pokemon.id !== speciesId) {
      this.router.navigate(['/pokemon', speciesId]);
    }
  }

  getAbilityDescription(abilityName: string): string {
    const ability = this.abilityDetails[abilityName];
    if (!ability) {
      return 'Loading...';
    }

    const englishEntry = ability.flavor_text_entries?.find(
      (entry: any) => entry.language.name === 'en'
    );

    if (englishEntry) {
      return englishEntry.flavor_text
        .replace(/\f/g, ' ')
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    return 'No description available.';
  }

  getStatColor(typeName: string): string {
    return this.getTypeColor(typeName);
  }

  isCurrentEvolution(evolution: EvolutionInfo): boolean {
    return evolution.id === this.pokemon?.id;
  }

  hasFemaleVariantAsMainCard(variant: Pokemon): boolean {
    const allVariants = this.getDisplayVariants();
    const baseName = variant.name.replace(/-male$/, '').replace(/-female$/, '');
    
    const hasFemaleMainCard = allVariants.some(v => 
      v.name.includes('-female') && v.name.startsWith(baseName)
    );
    
    return hasFemaleMainCard;
  }

  isDedicatedFemaleVariant(variant: Pokemon): boolean {
    return variant.name.includes('-female');
  }

  // Touch gesture methods
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.swipeDirection = null;
  }

  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].clientX;
    this.handleSwipeGesture();
    
    // Reset swipe direction after a short delay
    setTimeout(() => {
      this.swipeDirection = null;
    }, 200);
  }

  private handleSwipeGesture(): void {
    // Only handle swipes for base Pokemon (ID < 10000)
    if (!this.pokemon || this.pokemon.id >= 10000) {
      return;
    }

    const swipeDistance = this.touchEndX - this.touchStartX;
    const absSwipeDistance = Math.abs(swipeDistance);

    // Check if swipe distance is sufficient
    if (absSwipeDistance < this.minSwipeDistance) {
      return;
    }

    if (swipeDistance > 0) {
      // Swipe right - go to previous Pokemon
      this.swipeDirection = 'right';
      if (this.pokemon.id > 1) {
        this.navigateToPrevious();
      }
    } else {
      // Swipe left - go to next Pokemon
      this.swipeDirection = 'left';
      if (this.pokemon.id < 1025) {
        this.navigateToNext();
      }
    }
  }

  // Navigation methods
  navigateToPrevious() {
    if (!this.pokemon) return;
    
    const currentId = this.pokemon.id;
    const newId = Math.max(1, currentId - 1);
    this.router.navigate(['/pokemon', newId]);
  }

  navigateToNext() {
    if (!this.pokemon) return;
    
    const currentId = this.pokemon.id;
    const maxId = 1025; // Pecharunt - ultimo Pokemon del Dex nazionale
    
    if (currentId < maxId) {
      const newId = currentId + 1;
      this.router.navigate(['/pokemon', newId]);
    }
  }

  // Type color methods
  getTypeColor(typeName: string): string {
    const colors: Record<string, string> = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    return colors[typeName] || '#68A090';
  }

  getPrimaryTypeColor(): string {
    if (!this.pokemon || !this.pokemon.types || this.pokemon.types.length === 0) {
      return '#68A090'; // Default color
    }
    return this.getTypeColor(this.pokemon.types[0].type.name);
  }

  getLighterPrimaryTypeColor(): string {
    const baseColor = this.getPrimaryTypeColor();
    return baseColor + '20'; // 20 is the alpha value in hex (about 12% opacity)
  }

  getDarkerPrimaryTypeColor(): string {
    const baseColor = this.getPrimaryTypeColor();
    const hex = baseColor.replace('#', '');
    const num = parseInt(hex, 16);
    const amt = -40; // Darken by 40
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  }

  // Utility methods
  formatStatName(statName: string): string {
    switch(statName) {
      case 'hp': return 'HP';
      case 'attack': return 'Attack';
      case 'defense': return 'Defense';
      case 'special-attack': return 'Sp. Attack';
      case 'special-defense': return 'Sp. Defense';
      case 'speed': return 'Speed';
      default: return statName;
    }
  }

  getStatPercentage(statValue: number): number {
    return (statValue / 255) * 100;
  }

  isHiddenAbility(ability: any): boolean {
    return ability.is_hidden;
  }

  hasHiddenAbility(): boolean {
    return this.pokemon?.abilities.some(ability => ability.is_hidden) || false;
  }

  capitalizeName(name: string): string {
    return name.split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  // Helper method to extract species ID from species URL
  private extractSpeciesIdFromUrl(url: string): number {
    // URL format: https://pokeapi.co/api/v2/pokemon-species/{id}/
    const urlParts = url.split('/');
    const speciesId = urlParts[urlParts.length - 2]; // Get the ID before the last slash
    return parseInt(speciesId, 10);
  }

}
