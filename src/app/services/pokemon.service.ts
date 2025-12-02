import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Pokemon, PokemonListResponse, PokemonCard, PokemonSpecies, EvolutionChain, EvolutionInfo } from '../interfaces/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) { }

  getPokemonList(limit = 20, offset = 0): Observable<PokemonCard[]> {
    return this.http.get<PokemonListResponse>(`${this.apiUrl}/pokemon?limit=${limit}&offset=${offset}`)
      .pipe(
        switchMap(response => {
          const pokemonRequests = response.results.map(pokemon => 
            this.getPokemonDetails(pokemon.name)
          );
          return forkJoin(pokemonRequests);
        }),
        map(pokemonList => {
          // Filter out Pokemon with ID > 10000
          const filteredPokemonList = pokemonList.filter(pokemon => pokemon.id <= 10000);
          
          return filteredPokemonList.map(pokemon => ({
            id: pokemon.id,
            name: this.capitalizeName(pokemon.name),
            imageUrl: pokemon.sprites.other?.['official-artwork']?.front_default || 
                   pokemon.sprites.front_default ||
                   `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
            types: pokemon.types.map(type => type.type.name)
          }));
        })
      );
  }

  getPokemonDetails(nameOrId: string | number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.apiUrl}/pokemon/${nameOrId}`);
  }

  searchPokemon(query: string): Observable<PokemonCard[]> {
    const searchTerm = query.toLowerCase().trim();
    
    // Get a larger list to search through (all Pokemon for better search results)
    return this.http.get<PokemonListResponse>(`${this.apiUrl}/pokemon?limit=1500&offset=0`).pipe(
      switchMap((response: PokemonListResponse): Observable<PokemonCard[]> => {
        // Filter Pokemon names that contain the search term (LIKE functionality)
        // This handles cases like "iron-hands" when searching for "iron"
        const matchingPokemon = response.results.filter(pokemon => {
          const pokemonName = pokemon.name.toLowerCase();
          
          // For short queries (3 characters or less), be more flexible
          if (searchTerm.length <= 3) {
            return pokemonName.includes(searchTerm) || 
                   pokemonName.startsWith(searchTerm) ||
                   pokemonName.replace(/[-\s]/g, '').includes(searchTerm) ||
                   pokemonName.split('-').some(part => part.startsWith(searchTerm)) ||
                   pokemonName.split(' ').some(part => part.startsWith(searchTerm));
          }
          
          // For longer queries, use the original logic
          return pokemonName.includes(searchTerm) || 
                 pokemonName.replace(/[-\s]/g, '').includes(searchTerm.replace(/[-\s]/g, '')) ||
                 pokemonName.split('-').some(part => part.includes(searchTerm)) ||
                 pokemonName.split(' ').some(part => part.includes(searchTerm));
        });
        
        // If no matches found, try exact search as fallback
        if (matchingPokemon.length === 0) {
          return this.getPokemonDetails(searchTerm).pipe(
            map((pokemon: Pokemon): PokemonCard[] => {
              // Filter out Pokemon with ID > 10000
              if (pokemon.id > 10000) {
                return [];
              }
              
              return [{
                id: pokemon.id,
                name: this.capitalizeName(pokemon.name),
                imageUrl: pokemon.sprites.other?.['official-artwork']?.front_default || 
                       pokemon.sprites.front_default ||
                       `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
                types: pokemon.types.map((type: any) => type.type.name)
              }];
            }),
            catchError((): Observable<PokemonCard[]> => of([]))
          );
        }
        
        // Get details for all matching Pokemon (limit to 50 results for better UX)
        const pokemonRequests = matchingPokemon.slice(0, 50).map(pokemon => 
          this.getPokemonDetails(pokemon.name)
        );
        
        return forkJoin(pokemonRequests).pipe(
          map((pokemonList: Pokemon[]): PokemonCard[] => {
            // Filter out Pokemon with ID > 10000
            const filteredPokemonList = pokemonList.filter(pokemon => pokemon.id <= 10000);
            
            return filteredPokemonList.map((pokemon: Pokemon): PokemonCard => ({
              id: pokemon.id,
              name: this.capitalizeName(pokemon.name),
              imageUrl: pokemon.sprites.other?.['official-artwork']?.front_default || 
                     pokemon.sprites.front_default ||
                     `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
              types: pokemon.types.map((type: any) => type.type.name)
            }));
          })
        );
      }),
      catchError((error: any): Observable<PokemonCard[]> => {
        return of([]);
      })
    );
  }

  private capitalizeName(name: string): string {
    // Handle Pokemon names with hyphens and filter out gender references
    return name.split('-')
      .filter(part => part !== 'male' && part !== 'female' && part !== 'm' && part !== 'f')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  getPokemonVariants(species: any): Observable<Pokemon[]> {
    if (!species.varieties || species.varieties.length <= 1) {
      return of([]);
    }

    const variantPromises: Observable<Pokemon>[] = species.varieties
      .filter((variety: any) => variety.pokemon.name !== species.name)
      .map((variety: any) => {
        const pokemonId = variety.pokemon.url.split('/').slice(-2, -1)[0];
        return this.getPokemonDetails(pokemonId);
      });

    if (variantPromises.length === 0) {
      return of([]);
    }

    return forkJoin(variantPromises);
  }

  getPokemonSpecies(nameOrId: string | number): Observable<PokemonSpecies> {
    return this.http.get<PokemonSpecies>(`${this.apiUrl}/pokemon-species/${nameOrId}`);
  }

  getEvolutionChain(url: string): Observable<EvolutionChain> {
    return this.http.get<EvolutionChain>(url);
  }

  getEvolutionLine(pokemonId: string | number): Observable<EvolutionInfo[]> {
    // Prima prova a ottenere i dati del Pokemon specifico
    return this.getPokemonDetails(pokemonId.toString()).pipe(
      switchMap(pokemon => {
        // Per tutte le forme (normali e regionali), prova prima a ottenere le specie del Pokemon corrente
        return this.getPokemonSpecies(pokemon.id).pipe(
          switchMap(species => {
            // Se la specie ha una catena evolutiva, usala
            if (species.evolution_chain && species.evolution_chain.url) {
              return this.getEvolutionChain(species.evolution_chain.url).pipe(
                map(evolutionChain => this.parseEvolutionChain(evolutionChain.chain))
              );
            } else {
              // Se non ha catena evolutiva propria e ha ID alto, prova con la specie base
              if (pokemon.id > 10000 && pokemon.species) {
                const urlParts = pokemon.species.url.split('/');
                const baseSpeciesId = parseInt(urlParts[urlParts.length - 2]);
                
                return this.getPokemonSpecies(baseSpeciesId).pipe(
                  switchMap(baseSpecies => this.getEvolutionChain(baseSpecies.evolution_chain.url)),
                  map(evolutionChain => this.parseEvolutionChainForVariant(evolutionChain.chain, pokemon))
                );
              } else {
                return of([]);
              }
            }
          }),
          catchError((speciesError) => {
            // Se fallisce il caricamento delle specie per forme regionali, prova con la specie base
            if (pokemon.id > 10000 && pokemon.species) {
              const urlParts = pokemon.species.url.split('/');
              const baseSpeciesId = parseInt(urlParts[urlParts.length - 2]);
              
              return this.getPokemonSpecies(baseSpeciesId).pipe(
                switchMap(baseSpecies => this.getEvolutionChain(baseSpecies.evolution_chain.url)),
                map(evolutionChain => this.parseEvolutionChainForVariant(evolutionChain.chain, pokemon)),
                catchError(() => of([]))
              );
            }
            return of([]);
          })
        );
      }),
      catchError((error) => {
        console.error('Error loading evolution line:', error);
        return of([]);
      })
    );
  }

  private parseEvolutionChain(chain: any): EvolutionInfo[] {
    const evolutionLine: EvolutionInfo[] = [];
    
    
    // Inizia con il primo Pokemon della catena (sempre senza metodo evolutivo)
    const firstId = this.extractIdFromUrl(chain.species.url);
    evolutionLine.push({
      id: firstId,
      name: this.capitalizeName(chain.species.name),
      imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${firstId}.png`,
      level: 0
    });
    
    // Processa le evoluzioni a partire dal livello 1
    this.processEvolutionStage(chain.evolves_to, evolutionLine, 1);
    
    return evolutionLine;
  }

  private processEvolutionStage(evolutions: any[], evolutionLine: EvolutionInfo[], level: number): void {
    if (evolutions.length === 0) {
      // Nessuna evoluzione - fine
      return;
    }
    
    
    // Distingui tra evoluzioni lineari (1 evoluzione) e alternative (multiple evoluzioni)
    if (evolutions.length === 1) {
      // EVOLUZIONE LINEARE - aggiungi l'evoluzione alla catena orizzontale
      const evolution = evolutions[0];
      const pokemonId = this.extractIdFromUrl(evolution.species.url);
      
      if (evolution.evolution_details && evolution.evolution_details.length > 0) {
        const evolutionMethods: string[] = evolution.evolution_details.map((detail: any) => 
          this.getEvolutionMethod(detail)
        );
        
        const uniqueMethods = [...new Set(evolutionMethods)];
        const combinedMethod: string = uniqueMethods.length > 1 
          ? uniqueMethods.join(' OR ') 
          : (uniqueMethods[0] || 'Unknown');
        
        evolutionLine.push({
          id: pokemonId,
          name: this.capitalizeName(evolution.species.name),
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
          evolutionMethod: combinedMethod,
          level: level
        });
      } else {
        evolutionLine.push({
          id: pokemonId,
          name: this.capitalizeName(evolution.species.name),
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
          evolutionMethod: 'Unknown',
          level: level
        });
      }
      
      // Continua con il prossimo stadio nella catena lineare
      if (evolution.evolves_to.length > 0) {
        this.processEvolutionStage(evolution.evolves_to, evolutionLine, level + 1);
      }
    } else {
      // EVOLUZIONI ALTERNATIVE - aggiungi tutte le alternative allo stesso livello
      evolutions.forEach(evolution => {
        const pokemonId = this.extractIdFromUrl(evolution.species.url);
        
        if (evolution.evolution_details && evolution.evolution_details.length > 0) {
          const evolutionMethods: string[] = evolution.evolution_details.map((detail: any) => 
            this.getEvolutionMethod(detail)
          );
          
          const uniqueMethods = [...new Set(evolutionMethods)];
          const combinedMethod: string = uniqueMethods.length > 1 
            ? uniqueMethods.join(' OR ') 
            : (uniqueMethods[0] || 'Unknown');
          
          evolutionLine.push({
            id: pokemonId,
            name: this.capitalizeName(evolution.species.name),
            imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
            evolutionMethod: combinedMethod,
            level: level
          });
        } else {
          evolutionLine.push({
            id: pokemonId,
            name: this.capitalizeName(evolution.species.name),
            imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
            evolutionMethod: 'Unknown',
            level: level
          });
        }
      });
      
      // Per evoluzioni alternative, non procediamo oltre (ogni ramo è indipendente)
    }
  }

  private parseEvolutionChainForVariant(chain: any, originalPokemon: Pokemon): EvolutionInfo[] {
    const evolutionLine: EvolutionInfo[] = [];
    const current = chain;
    
    // Determina il tipo di variante dal nome del Pokemon originale
    const variantType = this.getVariantType(originalPokemon.name);

    // Add first pokemon (check for regional variant)
    const firstId = this.extractIdFromUrl(current.species.url);
    const firstVariant = this.findRegionalVariant(current.species.name, variantType);
    
    if (firstVariant) {
      evolutionLine.push({
        id: firstVariant.id,
        name: this.capitalizeName(firstVariant.name),
        imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${firstVariant.id}.png`
      });
    } else {
      evolutionLine.push({
        id: firstId,
        name: this.capitalizeName(current.species.name),
        imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${firstId}.png`
      });
    }

    // Process evolutions for variants
    this.processEvolutionsForVariant(current.evolves_to, evolutionLine, variantType);

    return evolutionLine;
  }

  private getVariantType(pokemonName: string): string | null {
    if (pokemonName.includes('-alola')) return 'alola';
    if (pokemonName.includes('-galar')) return 'galar';
    if (pokemonName.includes('-hisui')) return 'hisui';
    if (pokemonName.includes('-paldea')) return 'paldea';
    return null;
  }

  private findRegionalVariant(baseName: string, variantType: string | null): { id: number, name: string } | null {
    if (!variantType) return null;
    
    // Mappature conosciute per le forme regionali
    const regionalVariants: Record<string, Record<string, { id: number, name: string }>> = {
      'alola': {
        'rattata': { id: 10104, name: 'rattata-alola' },
        'raticate': { id: 10105, name: 'raticate-alola' },
        'raichu': { id: 10100, name: 'raichu-alola' },
        'sandshrew': { id: 10106, name: 'sandshrew-alola' },
        'sandslash': { id: 10107, name: 'sandslash-alola' },
        'vulpix': { id: 10101, name: 'vulpix-alola' },
        'ninetales': { id: 10102, name: 'ninetales-alola' },
        'diglett': { id: 10108, name: 'diglett-alola' },
        'dugtrio': { id: 10109, name: 'dugtrio-alola' },
        'meowth': { id: 10103, name: 'meowth-alola' },
        'persian': { id: 10110, name: 'persian-alola' },
        'geodude': { id: 10111, name: 'geodude-alola' },
        'graveler': { id: 10112, name: 'graveler-alola' },
        'golem': { id: 10113, name: 'golem-alola' },
        'grimer': { id: 10114, name: 'grimer-alola' },
        'muk': { id: 10115, name: 'muk-alola' },
        'exeggutor': { id: 10116, name: 'exeggutor-alola' },
        'marowak': { id: 10117, name: 'marowak-alola' }
      },
      'galar': {
        'meowth': { id: 10161, name: 'meowth-galar' },
        'ponyta': { id: 10162, name: 'ponyta-galar' },
        'rapidash': { id: 10163, name: 'rapidash-galar' },
        'slowpoke': { id: 10164, name: 'slowpoke-galar' },
        'slowbro': { id: 10165, name: 'slowbro-galar' },
        'farfetchd': { id: 10166, name: 'farfetchd-galar' },
        'weezing': { id: 10167, name: 'weezing-galar' },
        'mr-mime': { id: 10168, name: 'mr-mime-galar' },
        'articuno': { id: 10169, name: 'articuno-galar' },
        'zapdos': { id: 10170, name: 'zapdos-galar' },
        'moltres': { id: 10171, name: 'moltres-galar' },
        'slowking': { id: 10172, name: 'slowking-galar' },
        'corsola': { id: 10173, name: 'corsola-galar' },
        'zigzagoon': { id: 10174, name: 'zigzagoon-galar' },
        'linoone': { id: 10175, name: 'linoone-galar' },
        'darumaka': { id: 10176, name: 'darumaka-galar' },
        'darmanitan': { id: 10177, name: 'darmanitan-galar' },
        'yamask': { id: 10178, name: 'yamask-galar' },
        'stunfisk': { id: 10179, name: 'stunfisk-galar' }
      },
      'hisui': {
        'growlithe': { id: 10229, name: 'growlithe-hisui' },
        'arcanine': { id: 10230, name: 'arcanine-hisui' },
        'voltorb': { id: 10231, name: 'voltorb-hisui' },
        'electrode': { id: 10232, name: 'electrode-hisui' },
        'typhlosion': { id: 10233, name: 'typhlosion-hisui' },
        'qwilfish': { id: 10234, name: 'qwilfish-hisui' },
        'sneasel': { id: 10235, name: 'sneasel-hisui' },
        'samurott': { id: 10236, name: 'samurott-hisui' },
        'lilligant': { id: 10237, name: 'lilligant-hisui' },
        'zorua': { id: 10238, name: 'zorua-hisui' },
        'zoroark': { id: 10239, name: 'zoroark-hisui' },
        'braviary': { id: 10240, name: 'braviary-hisui' },
        'sliggoo': { id: 10241, name: 'sliggoo-hisui' },
        'goodra': { id: 10242, name: 'goodra-hisui' },
        'avalugg': { id: 10243, name: 'avalugg-hisui' },
        'decidueye': { id: 10244, name: 'decidueye-hisui' }
      }
    };
    
    return regionalVariants[variantType]?.[baseName] || null;
  }

  private processEvolutions(evolutions: any[], evolutionLine: EvolutionInfo[]): void {
    evolutions.forEach(evolution => {
      const pokemonId = this.extractIdFromUrl(evolution.species.url);
      const evolutionMethod = this.getEvolutionMethod(evolution.evolution_details[0]);
      
      evolutionLine.push({
        id: pokemonId,
        name: this.capitalizeName(evolution.species.name),
        imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
        evolutionMethod
      });

      // Recursive call for further evolutions
      if (evolution.evolves_to.length > 0) {
        this.processEvolutions(evolution.evolves_to, evolutionLine);
      }
    });
  }

  private processEvolutionsForVariant(evolutions: any[], evolutionLine: EvolutionInfo[], variantType: string | null): void {
    evolutions.forEach(evolution => {
      const pokemonId = this.extractIdFromUrl(evolution.species.url);
      const evolutionMethod = this.getEvolutionMethod(evolution.evolution_details[0]);
      
      // Cerca variante regionale per questa evoluzione
      const variantPokemon = this.findRegionalVariant(evolution.species.name, variantType);
      
      if (variantPokemon) {
        evolutionLine.push({
          id: variantPokemon.id,
          name: this.capitalizeName(variantPokemon.name),
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${variantPokemon.id}.png`,
          evolutionMethod
        });
      } else {
        // Se non esiste variante, usa il Pokemon normale
        evolutionLine.push({
          id: pokemonId,
          name: this.capitalizeName(evolution.species.name),
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
          evolutionMethod
        });
      }

      // Recursive call for further evolutions
      if (evolution.evolves_to.length > 0) {
        this.processEvolutionsForVariant(evolution.evolves_to, evolutionLine, variantType);
      }
    });
  }

  private getEvolutionMethod(evolutionDetail: any): string {
    if (!evolutionDetail) return 'Unknown';

    const trigger = evolutionDetail.trigger.name;
    let method = '';
    const conditions: string[] = [];
    
    // Base trigger method
    switch (trigger) {
      case 'level-up':
        if (evolutionDetail.min_level) {
          method = `Level ${evolutionDetail.min_level}`;
        } else {
          method = 'Level up';
        }
        break;
      
      case 'use-item':
        method = `Use ${this.capitalizeName(evolutionDetail.item?.name || 'item')}`;
        break;
      
      case 'trade':
        method = 'Trade';
        break;
        
      case 'shed':
        method = 'Empty slot in party + Pokeball';
        break;
      
      default:
        method = this.capitalizeName(trigger.replace('-', ' '));
        break;
    }
    
    // Add specific conditions
    if (evolutionDetail.min_happiness) {
      conditions.push(`High Friendship (${evolutionDetail.min_happiness}+)`);
    }
    
    if (evolutionDetail.min_affection) {
      conditions.push(`High Affection (${evolutionDetail.min_affection}+)`);
    }
    
    if (evolutionDetail.min_beauty) {
      conditions.push(`Beauty ${evolutionDetail.min_beauty}+`);
    }
    
    if (evolutionDetail.time_of_day) {
      conditions.push(`During ${evolutionDetail.time_of_day}`);
    }
    
    if (evolutionDetail.location) {
      conditions.push(`At ${this.capitalizeName(evolutionDetail.location.name)}`);
    }
    
    if (evolutionDetail.held_item) {
      if (trigger === 'trade') {
        conditions.push(`Holding ${this.capitalizeName(evolutionDetail.held_item.name)}`);
      } else {
        conditions.push(`While holding ${this.capitalizeName(evolutionDetail.held_item.name)}`);
      }
    }
    
    if (evolutionDetail.trade_species) {
      conditions.push(`Trade for ${this.capitalizeName(evolutionDetail.trade_species.name)}`);
    }
    
    if (evolutionDetail.party_species) {
      conditions.push(`With ${this.capitalizeName(evolutionDetail.party_species.name)} in party`);
    }
    
    if (evolutionDetail.party_type) {
      conditions.push(`With ${this.capitalizeName(evolutionDetail.party_type.name)}-type in party`);
    }
    
    if (evolutionDetail.needs_overworld_rain) {
      conditions.push('During rain');
    }
    
    if (evolutionDetail.turn_upside_down) {
      conditions.push('Turn device upside down');
    }
    
    if (evolutionDetail.relative_physical_stats !== undefined) {
      switch (evolutionDetail.relative_physical_stats) {
        case 1:
          conditions.push('Attack > Defense');
          break;
        case -1:
          conditions.push('Defense > Attack');
          break;
        case 0:
          conditions.push('Attack = Defense');
          break;
      }
    }
    
    // Combine method and conditions
    if (conditions.length > 0) {
      return `${method} (${conditions.join(', ')})`;
    }
    
    return method;
  }

  getPokemonByType(typeName: string): Observable<PokemonCard[]> {
    return this.http.get<any>(`${this.apiUrl}/type/${typeName}`).pipe(
      map((response: any) => {
        return response.pokemon
          .map((pokemonEntry: any) => ({
            name: pokemonEntry.pokemon.name,
            url: pokemonEntry.pokemon.url
          }))
          .filter((pokemon: any) => {
            // Extract ID from URL and filter out Pokemon with ID > 10000
            const id = this.extractIdFromUrl(pokemon.url);
            return id <= 10000;
          });
      }),
      catchError(error => {
        console.error('Error fetching Pokemon by type:', error);
        return of([]);
      })
    );
  }

  private extractIdFromUrl(url: string): number {
    const matches = url.match(/\/(\d+)\/$/);
    return matches ? parseInt(matches[1], 10) : 0;
  }

  getAbilityDetails(abilityNameOrUrl: string): Observable<any> {
    const url = abilityNameOrUrl.includes('http') ? abilityNameOrUrl : `${this.apiUrl}/ability/${abilityNameOrUrl}`;
    return this.http.get<any>(url);
  }

}
