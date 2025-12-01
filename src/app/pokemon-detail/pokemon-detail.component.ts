import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../services/pokemon.service';
import { Pokemon, EvolutionInfo, AbilityDetail } from '../interfaces/pokemon';

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
  pokemonSpecies?: any;
  basePokemonName?: string;
  basePokemonId?: number;
  abilityDetails: { [abilityName: string]: AbilityDetail } = {};
  pokemonCategory: string = '';
  pokemonDescriptions: Array<{flavor_text: string, version: {name: string}, language: {name: string}}> = [];
  showAllDescriptions: boolean = false;
  filteredVariants: Pokemon[] = [];
  allVariantsLegacy: Pokemon[] = [];
  pokemonHomeList: string[] = [];

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
    this.pokemonService.getPokemonDetails(nameOrId).subscribe({
      next: (pokemon) => {
        this.pokemon = pokemon;
        
        // Load abilities details
        this.loadAbilitiesDetails(pokemon);
        
        // Load species information to determine base form dynamically
        this.loadPokemonSpecies(pokemon);
        
        // Only try to load variants and evolution for Pokemon with reasonable IDs (species data is more reliable for lower IDs)
        // Skip variant loading and evolution for very high ID Pokemon which often don't have species data
        if (pokemon && pokemon.species && pokemon.id < 10000) {
          this.loadPokemonVariants(pokemon);
          this.loadEvolutionChain(pokemon.id);
        } else {
          this.pokemonVariants = [];
          this.evolutionLine = []; // Non caricare evoluzioni per varianti con ID alto
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading Pokemon details:', error);
        this.loading = false;
        this.pokemon = null;
      }
    });
  }

  loadPokemonVariants(basePokemon: Pokemon): void {
    // Skip variant loading for Pokemon with very high IDs as they often lack species data
    if (basePokemon.id >= 10000) {
      this.pokemonVariants = [];
      return;
    }

    // Get species data to find variants
    this.pokemonService.getPokemonSpecies(basePokemon.id).subscribe({
      next: (species: any) => {
        this.pokemonService.getPokemonVariants(species).subscribe({
          next: (variants: Pokemon[]) => {
            this.pokemonVariants = variants.filter((v: Pokemon) => 
              v.id !== basePokemon.id
            );
            
            // Create legacy variants including current Pokemon
            this.allVariantsLegacy = [basePokemon, ...variants.filter((v: Pokemon) => v.id !== basePokemon.id)];
            
            // Create filtered variants including current Pokemon and excluding mega/gigamax
            const allVariants = [basePokemon, ...variants.filter((v: Pokemon) => v.id !== basePokemon.id)];
            this.filteredVariants = allVariants.filter((variant: Pokemon) => 
              this.isValidVariant(variant.name)
            );
            
            // Generate Pokemon Home list (base, female, and regional forms only for base Pokemon)
            if (basePokemon.id < 10000) {
              this.generatePokemonHomeList(basePokemon, variants);
            }
          },
          error: (error: any) => {
            // Silently handle variant loading errors
            this.pokemonVariants = [];
          }
        });
      },
      error: (error: any) => {
        // Silently handle species loading errors for high ID Pokemon
        this.pokemonVariants = [];
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  navigateToVariant(variantId: number): void {
    this.router.navigate(['/pokemon', variantId.toString()]);
  }

  loadEvolutionChain(pokemonId: number): void {
    this.pokemonService.getEvolutionLine(pokemonId).subscribe({
      next: (evolutionLine) => {
        this.evolutionLine = evolutionLine;
      },
      error: (error) => {
        console.error('Error loading evolution chain:', error);
        this.evolutionLine = [];
      }
    });
  }

  loadAbilitiesDetails(pokemon: Pokemon): void {
    if (!pokemon.abilities) return;
    
    pokemon.abilities.forEach(abilityData => {
      const abilityName = abilityData.ability.name;
      
      this.pokemonService.getAbilityDetails(abilityName).subscribe({
        next: (abilityDetail: AbilityDetail) => {
          this.abilityDetails[abilityName] = abilityDetail;
        },
        error: (error) => {
          console.error(`Error loading ability details for ${abilityName}:`, error);
        }
      });
    });
  }

  getAbilityDescription(abilityName: string): string {
    const abilityDetail = this.abilityDetails[abilityName];
    if (!abilityDetail) return '';
    
    // Try to get English description from effect_entries
    const englishEntry = abilityDetail.effect_entries?.find(entry => entry.language?.name === 'en');
    if (englishEntry && englishEntry.effect) {
      return englishEntry.effect;
    }
    
    // Fallback to flavor text entries for shorter descriptions
    const englishFlavorText = abilityDetail.flavor_text_entries?.find(entry => entry.language?.name === 'en');
    if (englishFlavorText && englishFlavorText.flavor_text) {
      return englishFlavorText.flavor_text;
    }
    
    // Fallback to first available description
    return abilityDetail.effect_entries?.[0]?.effect || 
           abilityDetail.flavor_text_entries?.[0]?.flavor_text ||
           'Description not available';
  }

  navigateToEvolution(pokemonId: number): void {
    this.router.navigate(['/pokemon', pokemonId.toString()]);
  }

  hasMultipleEvolutions(): boolean {
    // Verifica se ci sono evoluzioni alternative controllando il livello 1
    const basePokemon = this.evolutionLine.find(evo => evo.level === 0);
    const firstLevelEvolutions = this.evolutionLine.filter(evo => evo.level === 1);
    
    
    // Se ci sono 2 o più evoluzioni al primo livello, sono alternative
    // altrimenti è una linea evolutiva lineare
    const hasMultiple = firstLevelEvolutions.length >= 2;
    
    return hasMultiple;
  }

  getBasePokemon(): EvolutionInfo | null {
    // Return the Pokemon at level 0 (the base form)
    return this.evolutionLine.find(evo => evo.level === 0) || null;
  }

  getEvolutions(): EvolutionInfo[] {
    // Return all Pokemon at level 1 (first evolution level)
    return this.evolutionLine.filter(evo => evo.level === 1);
  }

  toggleDescriptions(): void {
    this.showAllDescriptions = !this.showAllDescriptions;
  }

  getLatestDescription(): string {
    if (this.pokemonDescriptions.length === 0) return '';
    return this.cleanFlavorText(this.pokemonDescriptions[0]?.flavor_text);
  }

  getLatestDescriptionVersion(): string {
    if (this.pokemonDescriptions.length === 0) return '';
    return this.cleanGameName(this.pokemonDescriptions[0]?.version?.name || '');
  }

  cleanFlavorText(text: string): string {
    return text?.replace(/\f/g, ' ') || '';
  }

  cleanGameName(name: string): string {
    return name?.replace(/-/g, ' ') || '';
  }

  isValidVariant(pokemonName: string): boolean {
    const name = pokemonName.toLowerCase();
    
    // Exclude mega evolutions
    if (name.includes('mega')) return false;
    
    // Exclude gigamax forms
    if (name.includes('gigamax') || name.includes('gmax')) return false;
    
    // Include base forms, female variants, and regional forms
    return true;
  }

  getVariantLabel(pokemonName: string): string {
    const name = pokemonName.toLowerCase();
    
    if (name.includes('-f') || name.includes('female')) return 'Female';
    if (name.includes('-alola')) return 'Alolan';
    if (name.includes('-galar')) return 'Galarian';
    if (name.includes('-hisui')) return 'Hisuian';
    if (name.includes('-paldea')) return 'Paldean';
    
    // Check for other regional indicators
    const parts = name.split('-');
    if (parts.length > 1) {
      const lastPart = parts[parts.length - 1];
      if (lastPart === 'alola') return 'Alolan';
      if (lastPart === 'galar') return 'Galarian';
      if (lastPart === 'hisui') return 'Hisuian';
      if (lastPart === 'paldea') return 'Paldean';
    }
    
    return 'Base';
  }

  generatePokemonHomeList(basePokemon: Pokemon, allVariants: Pokemon[]): void {
    this.pokemonHomeList = [];
    
    // Get base Pokemon name without suffixes
    const baseNameRaw = basePokemon.name.toLowerCase();
    let cleanBaseName = baseNameRaw;
    
    // Handle special cases where the "base" Pokemon is actually male
    if (baseNameRaw.includes('-male')) {
      cleanBaseName = baseNameRaw.replace('-male', '');
    }
    
    const baseName = this.capitalizeName(cleanBaseName);
    
    // Always add male form
    this.pokemonHomeList.push(`${baseName} Male`);
    
    // Check if there's a separate female variant
    const femaleVariant = allVariants.find((variant: Pokemon) => 
      variant.name.toLowerCase().includes('-female')
    );
    
    // Check if the base Pokemon has female sprites (different from male)
    const hasFemaleSpriteInBase = basePokemon.sprites?.front_female && 
                                  basePokemon.sprites?.front_female !== basePokemon.sprites?.front_default;
    
    // Add female form if:
    // 1. There's a separate female variant, OR
    // 2. The base Pokemon has different female sprites
    if (femaleVariant || hasFemaleSpriteInBase) {
      this.pokemonHomeList.push(`${baseName} Female`);
    }
    
    // Add regional forms (excluding cosplay, caps, and other special variants)
    const regionalForms = allVariants.filter((variant: Pokemon) => {
      const name = variant.name.toLowerCase();
      // Only include true regional forms, not caps, cosplay, or other special variants
      return (
        (name.includes('-alola') && !name.includes('cap') && !name.includes('cosplay')) ||
        (name.includes('-galar') && !name.includes('cap') && !name.includes('cosplay')) ||
        (name.includes('-hisui') && !name.includes('cap') && !name.includes('cosplay')) ||
        (name.includes('-paldea') && !name.includes('cap') && !name.includes('cosplay'))
      ) && !name.includes('mega') && !name.includes('gmax');
    });
    
    regionalForms.forEach((regionalForm: Pokemon) => {
      const formName = this.getRegionalFormName(regionalForm.name);
      this.pokemonHomeList.push(`${formName}`);
    });
  }
  
  private getRegionalFormName(pokemonName: string): string {
    const name = pokemonName.toLowerCase();
    const cleanName = name.split('-')[0];
    const capitalizedName = this.capitalizeName(cleanName);
    
    if (name.includes('-alola')) return `${capitalizedName} Alola`;
    if (name.includes('-galar')) return `${capitalizedName} Galar`;
    if (name.includes('-hisui')) return `${capitalizedName} Hisui`;
    if (name.includes('-paldea')) return `${capitalizedName} Paldea`;
    
    return capitalizedName;
  }

  getTypeColor(type: string): string {
    const typeColors: { [key: string]: string } = {
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

  getPrimaryTypeColor(): string {
    if (this.pokemon && this.pokemon.types && this.pokemon.types.length > 0) {
      return this.getTypeColor(this.pokemon.types[0].type.name);
    }
    return '#68A090';
  }

  getDarkerPrimaryTypeColor(): string {
    const baseColor = this.getPrimaryTypeColor();
    // Convert hex to RGB and darken by reducing each component by about 20%
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const darkerR = Math.floor(r * 0.8);
    const darkerG = Math.floor(g * 0.8);
    const darkerB = Math.floor(b * 0.8);
    
    return `rgb(${darkerR}, ${darkerG}, ${darkerB})`;
  }

  getLighterPrimaryTypeColor(): string {
    const baseColor = this.getPrimaryTypeColor();
    // Convert hex to RGBA with transparency for lighter effect
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    return `rgba(${r}, ${g}, ${b}, 0.1)`; // 10% opacity for very subtle background (like abilities)
  }

  getStatColor(type: string): string {
    // Colori più scuri e contrastanti per le statistiche
    const statColors: { [key: string]: string } = {
      normal: '#6B6B43',
      fighting: '#801B1B',
      flying: '#6B5FA0',
      poison: '#6B2A6B',
      ground: '#A0804A',
      rock: '#7B6B28',
      bug: '#6B7518',
      ghost: '#4A3B5B',
      steel: '#7A7A8A',
      fire: '#A05420',
      water: '#4A5FA0',
      grass: '#4A8A30',
      electric: '#A08A20',
      psychic: '#A03558',
      ice: '#5BA8A8',
      dragon: '#4A28A0',
      dark: '#4A3B30',
      fairy: '#A06678'
    };
    return statColors[type] || '#456B5A';
  }

  capitalizeName(name: string): string {
    return name.split('-')
      .filter(part => part !== 'male' && part !== 'female' && part !== 'm' && part !== 'f')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  loadPokemonSpecies(pokemon: Pokemon) {
    // Per Pokemon con ID molto alto, proviamo a estrarre il base ID direttamente dal species URL del Pokemon
    if (pokemon.id > 10000) {
      // Estrai l'ID della specie dal Pokemon stesso
      if (pokemon.species && pokemon.species.url) {
        const urlParts = pokemon.species.url.split('/');
        const speciesId = parseInt(urlParts[urlParts.length - 2]);
        
        // Se l'ID della specie è diverso dall'ID del Pokemon, allora questo è il base Pokemon
        if (speciesId && speciesId !== pokemon.id) {
          this.basePokemonId = speciesId;
          
          return; // Non proviamo a caricare la specie via API per Pokemon con ID alto
        }
      }
      
      // Fallback: questo Pokemon potrebbe già essere il base o non avere un base
      this.basePokemonId = pokemon.id;
      return;
    }
    
    // Per Pokemon con ID normale, usa l'API delle specie
    if (pokemon.species) {
      this.pokemonService.getPokemonSpecies(pokemon.id).subscribe({
        next: (species) => {
          this.pokemonSpecies = species;
          
          // Extract Pokemon category (genus) from species data
          if (species.genera && species.genera.length > 0) {
            const englishGenus = species.genera.find((g: any) => g.language?.name === 'en');
            this.pokemonCategory = englishGenus ? englishGenus.genus : species.genera[0]?.genus || '';
          }
          
          // Extract Pokemon descriptions (flavor text entries)
          if (species.flavor_text_entries && species.flavor_text_entries.length > 0) {
            this.pokemonDescriptions = species.flavor_text_entries.filter((entry: any) => 
              entry.language?.name === 'en'
            ).reverse(); // Reverse to show latest first
          }
          
          // Extract Pokemon descriptions (flavor text entries)
          if (species.flavor_text_entries && species.flavor_text_entries.length > 0) {
            this.pokemonDescriptions = species.flavor_text_entries.filter((entry: any) => 
              entry.language?.name === 'en'
            ).reverse(); // Reverse to show latest first
          }
          
          this.determineBasePokemon(species);
        },
        error: (error) => {
          console.error('Error loading Pokemon species for ID', pokemon.id, ':', error);
          // Fallback: se non riusciamo a caricare la specie, usiamo il Pokemon corrente come base
          this.basePokemonId = pokemon.id;
        }
      });
    } else {
      // Se non ha specie, probabilmente è già il Pokemon base
      this.basePokemonId = pokemon.id;
    }
  }

  determineBasePokemon(species: any) {
    // Se questo Pokemon è già la varietà base (default_variety)
    if (species.varieties) {
      const defaultVariety = species.varieties.find((v: any) => v.is_default);
      if (defaultVariety) {
        // Estrarre l'ID dal URL
        const urlParts = defaultVariety.pokemon.url.split('/');
        this.basePokemonId = parseInt(urlParts[urlParts.length - 2]);
        this.basePokemonName = defaultVariety.pokemon.name;
      } else {
        // Se non c'è una varietà default, usa il primo della lista
        if (species.varieties.length > 0) {
          const urlParts = species.varieties[0].pokemon.url.split('/');
          this.basePokemonId = parseInt(urlParts[urlParts.length - 2]);
          this.basePokemonName = species.varieties[0].pokemon.name;
        } else {
          // Fallback: usa il Pokemon corrente
          this.basePokemonId = this.pokemon?.id;
        }
      }
    } else {
      // Se non ci sono varietà, questo è probabilmente già il Pokemon base
      this.basePokemonId = this.pokemon?.id;
    }
    
    // Non carichiamo automaticamente le evoluzioni qui - saranno caricate dal metodo principale
  }

  loadEvolutionChainForBasePokemon() {
    if (this.basePokemonId && this.basePokemonId < 10000) {
      this.loadEvolutionChain(this.basePokemonId);
    } else {
      this.evolutionLine = [];
    }
  }

  goToBasePokemon() {
    if (this.basePokemonId && this.basePokemonId !== this.pokemon?.id) {
      this.router.navigate(['/pokemon', this.basePokemonId]);
    }
  }

  hasBasePokemon(): boolean {
    return this.basePokemonId !== undefined && 
           this.basePokemonId !== this.pokemon?.id &&
           this.pokemon?.id !== undefined &&
           this.pokemon.id > 10000;
  }

  getDisplayVariants(): Pokemon[] {
    // Se ci sono varianti, mostra tutte le varianti (incluso il Pokemon corrente)
    if (this.allVariantsLegacy.length > 1) {
      return this.allVariantsLegacy;
    }
    
    // Altrimenti, mostra solo il Pokemon corrente
    return this.pokemon ? [this.pokemon] : [];
  }
}
