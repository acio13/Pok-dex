export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default?: string;
    front_shiny?: string;
    front_female?: string;
    front_shiny_female?: string;
    other?: {
      'official-artwork'?: {
        front_default?: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  species: {
    url: string;
  };
}

export interface AbilityDetail {
  name: string;
  effect_entries: {
    effect: string;
    language: {
      name: string;
    };
  }[];
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
  }[];
}

export interface PokemonSpecies {
  evolution_chain: {
    url: string;
  };
  name: string;
  genera: {
    genus: string;
    language: {
      name: string;
    };
  }[];
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
    version: {
      name: string;
    };
  }[];
}

export interface EvolutionDetail {
  min_level?: number;
  trigger: {
    name: string;
  };
  item?: {
    name: string;
  };
  held_item?: {
    name: string;
  };
  location?: {
    name: string;
  };
  time_of_day?: string;
  min_happiness?: number;
  min_beauty?: number;
  min_affection?: number;
  needs_overworld_rain?: boolean;
  party_species?: {
    name: string;
  };
  party_type?: {
    name: string;
  };
  relative_physical_stats?: number;
  trade_species?: {
    name: string;
  };
  turn_upside_down?: boolean;
}

export interface EvolutionChainLink {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionChainLink[];
  evolution_details: EvolutionDetail[];
}

export interface EvolutionChain {
  chain: EvolutionChainLink;
}

export interface EvolutionInfo {
  id: number;
  name: string;
  imageUrl: string;
  evolutionMethod?: string;
  level?: number; // Aggiunto per tracciare il livello evolutivo
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

export interface PokemonCard {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
}
