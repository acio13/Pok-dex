// Interface for Pokemon HOME form restrictions
export interface HomeFormRestriction {
  pokemonId: number;
  pokemonName: string;
  restrictedForms: string[];
  compatibleForms: string[];
  notes: string;
  category: 'mega' | 'primal' | 'origin' | 'battle' | 'weather' | 'fusion' | 'special' | 'held-item' | 'gigamax';
}

export const HOME_FORM_RESTRICTIONS: HomeFormRestriction[] = [
  // Generation 1 Mega Evolutions and Gigamax Forms
  {
    pokemonId: 3,
    pokemonName: 'Venusaur',
    restrictedForms: ['mega', 'gigamax'],
    compatibleForms: ['normal'],
    notes: 'Mega Venusaur and Gigamax Venusaur cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 6,
    pokemonName: 'Charizard',
    restrictedForms: ['mega-x', 'mega-y', 'gigamax'],
    compatibleForms: ['normal'],
    notes: 'Mega Charizard X and Y and Gigamax Charizard cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 9,
    pokemonName: 'Blastoise',
    restrictedForms: ['mega', 'gigamax'],
    compatibleForms: ['normal'],
    notes: 'Mega Blastoise and Gigamax Blastoise cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 15,
    pokemonName: 'Beedrill',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Beedrill cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 18,
    pokemonName: 'Pidgeot',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Pidgeot cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 25,
    pokemonName: 'Pikachu',
    restrictedForms: ['gigamax', 'starter'],
    compatibleForms: ['normal', 'rock-star', 'belle', 'pop-star', 'phd', 'libre', 'cosplay', 'original-cap', 'hoenn-cap', 'sinnoh-cap', 'unova-cap', 'kalos-cap', 'alola-cap', 'partner-cap', 'world-cap'],
    notes: 'Gigamax Pikachu and Starter Pikachu cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 52,
    pokemonName: 'Meowth',
    restrictedForms: ['gigamax'],
    compatibleForms: ['normal', 'alola', 'galar'],
    notes: 'Gigamax Meowth cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 65,
    pokemonName: 'Alakazam',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Alakazam cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 68,
    pokemonName: 'Machamp',
    restrictedForms: ['gigamax'],
    compatibleForms: ['normal'],
    notes: 'Gigamax Machamp cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 80,
    pokemonName: 'Slowbro',
    restrictedForms: ['mega'],
    compatibleForms: ['normal', 'galar'],
    notes: 'Mega Slowbro cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 94,
    pokemonName: 'Gengar',
    restrictedForms: ['mega', 'gigamax'],
    compatibleForms: ['normal'],
    notes: 'Mega Gengar and Gigamax Gengar cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 115,
    pokemonName: 'Kangaskhan',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Kangaskhan cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 127,
    pokemonName: 'Pinsir',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Pinsir cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 130,
    pokemonName: 'Gyarados',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Gyarados cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 131,
    pokemonName: 'Lapras',
    restrictedForms: ['gigamax'],
    compatibleForms: ['normal'],
    notes: 'Gigamax Lapras cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 133,
    pokemonName: 'Eevee',
    restrictedForms: ['gigamax', 'starter'],
    compatibleForms: ['normal'],
    notes: 'Gigamax Eevee and Starter Eevee cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 142,
    pokemonName: 'Aerodactyl',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Aerodactyl cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 143,
    pokemonName: 'Snorlax',
    restrictedForms: ['gigamax'],
    compatibleForms: ['normal'],
    notes: 'Gigamax Snorlax cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 150,
    pokemonName: 'Mewtwo',
    restrictedForms: ['mega-x', 'mega-y'],
    compatibleForms: ['normal'],
    notes: 'Mega Mewtwo X and Y cannot be deposited in HOME.',
    category: 'mega'
  },

  // Generation 2 Mega Evolutions
  {
    pokemonId: 181,
    pokemonName: 'Ampharos',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Ampharos cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 208,
    pokemonName: 'Steelix',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Steelix cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 212,
    pokemonName: 'Scizor',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Scizor cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 214,
    pokemonName: 'Heracross',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Heracross cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 229,
    pokemonName: 'Houndoom',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Houndoom cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 248,
    pokemonName: 'Tyranitar',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Tyranitar cannot be deposited in HOME.',
    category: 'mega'
  },

  // Generation 3 Mega Evolutions & Weather Forms
  {
    pokemonId: 254,
    pokemonName: 'Sceptile',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Sceptile cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 257,
    pokemonName: 'Blaziken',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Blaziken cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 260,
    pokemonName: 'Swampert',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Swampert cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 282,
    pokemonName: 'Gardevoir',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Gardevoir cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 302,
    pokemonName: 'Sableye',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Sableye cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 303,
    pokemonName: 'Mawile',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Mawile cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 306,
    pokemonName: 'Aggron',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Aggron cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 308,
    pokemonName: 'Medicham',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Medicham cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 310,
    pokemonName: 'Manectric',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Manectric cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 319,
    pokemonName: 'Sharpedo',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Sharpedo cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 323,
    pokemonName: 'Camerupt',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Camerupt cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 334,
    pokemonName: 'Altaria',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Altaria cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 351,
    pokemonName: 'Castform',
    restrictedForms: ['sunny', 'rainy', 'snowy'],
    compatibleForms: ['normal'],
    notes: 'Weather forms (Sunny, Rainy, Snowy) cannot be deposited in HOME.',
    category: 'weather'
  },
  {
    pokemonId: 354,
    pokemonName: 'Banette',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Banette cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 359,
    pokemonName: 'Absol',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Absol cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 362,
    pokemonName: 'Glalie',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Glalie cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 373,
    pokemonName: 'Salamence',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Salamence cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 376,
    pokemonName: 'Metagross',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Metagross cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 380,
    pokemonName: 'Latias',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Latias cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 381,
    pokemonName: 'Latios',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Latios cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 382,
    pokemonName: 'Kyogre',
    restrictedForms: ['primal'],
    compatibleForms: ['normal'],
    notes: 'Primal Kyogre cannot be deposited in HOME.',
    category: 'primal'
  },
  {
    pokemonId: 383,
    pokemonName: 'Groudon',
    restrictedForms: ['primal'],
    compatibleForms: ['normal'],
    notes: 'Primal Groudon cannot be deposited in HOME.',
    category: 'primal'
  },
  {
    pokemonId: 384,
    pokemonName: 'Rayquaza',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Rayquaza cannot be deposited in HOME.',
    category: 'mega'
  },

  // Generation 4 Forms
  {
    pokemonId: 421,
    pokemonName: 'Cherrim',
    restrictedForms: ['sunshine'],
    compatibleForms: ['normal', 'overcast'],
    notes: 'Sunshine Form cannot be deposited in HOME.',
    category: 'battle'
  },
  {
    pokemonId: 428,
    pokemonName: 'Lopunny',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Lopunny cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 445,
    pokemonName: 'Garchomp',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Garchomp cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 448,
    pokemonName: 'Lucario',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Lucario cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 460,
    pokemonName: 'Abomasnow',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Abomasnow cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 475,
    pokemonName: 'Gallade',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Gallade cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 483,
    pokemonName: 'Dialga',
    restrictedForms: ['origin'],
    compatibleForms: ['normal'],
    notes: 'Origin Forme cannot be deposited in HOME.',
    category: 'origin'
  },
  {
    pokemonId: 484,
    pokemonName: 'Palkia',
    restrictedForms: ['origin'],
    compatibleForms: ['normal'],
    notes: 'Origin Forme cannot be deposited in HOME.',
    category: 'origin'
  },
  {
    pokemonId: 487,
    pokemonName: 'Giratina',
    restrictedForms: ['origin'],
    compatibleForms: ['altered'],
    notes: 'Origin Forme cannot be deposited in HOME.',
    category: 'origin'
  },
  {
    pokemonId: 493,
    pokemonName: 'Arceus',
    restrictedForms: ['fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy', 'legend-plate'],
    compatibleForms: ['normal'],
    notes: 'All plate forms and Legend Plate form cannot be deposited in HOME.',
    category: 'held-item'
  },

  // Generation 5 Forms
  {
    pokemonId: 531,
    pokemonName: 'Audino',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Audino cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 555,
    pokemonName: 'Darmanitan',
    restrictedForms: ['zen', 'galar-zen'],
    compatibleForms: ['normal', 'galar'],
    notes: 'Zen Mode forms cannot be deposited in HOME.',
    category: 'battle'
  },
  {
    pokemonId: 569,
    pokemonName: 'Garbodor',
    restrictedForms: ['gigamax'],
    compatibleForms: ['normal'],
    notes: 'Gigamax Garbodor cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 646,
    pokemonName: 'Kyurem',
    restrictedForms: ['black', 'white'],
    compatibleForms: ['normal'],
    notes: 'Black Kyurem and White Kyurem fusion forms cannot be deposited.',
    category: 'fusion'
  },
  {
    pokemonId: 648,
    pokemonName: 'Meloetta',
    restrictedForms: ['pirouette'],
    compatibleForms: ['aria'],
    notes: 'Pirouette Forme cannot be deposited in HOME.',
    category: 'battle'
  },
  {
    pokemonId: 649,
    pokemonName: 'Genesect',
    restrictedForms: ['burn-drive', 'chill-drive', 'douse-drive', 'shock-drive'],
    compatibleForms: ['normal'],
    notes: 'All Drive forms cannot be deposited in HOME.',
    category: 'held-item'
  },

  // Generation 6 Forms
  {
    pokemonId: 652,
    pokemonName: 'Chesnaught',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Chesnaught cannot be deposited in HOME.',
    category: 'mega'
  },
  {
    pokemonId: 670,
    pokemonName: 'Floette',
    restrictedForms: [],
    compatibleForms: ['normal', 'eternal', 'floette-red', 'floette-yellow', 'floette-orange', 'floette-blue', 'floette-white'],
    notes: 'All Floette forms including Eternal Flower are transferable to HOME.',
    category: 'special'
  },
  {
    pokemonId: 658,
    pokemonName: 'Greninja',
    restrictedForms: ['ash', 'mega'],
    compatibleForms: ['normal'],
    notes: 'Ash-Greninja and Mega Greninja cannot be deposited in HOME.',
    category: 'special'
  },
  {
    pokemonId: 681,
    pokemonName: 'Aegislash',
    restrictedForms: ['blade'],
    compatibleForms: ['shield'],
    notes: 'Totem form cannot be deposited in HOME.',
    category: 'battle'
  },
  {
    pokemonId: 738,
    pokemonName: 'Vikavolt',
    restrictedForms: ['vikavolt-totem'],
    compatibleForms: ['normal'],
    notes: 'Totem form cannot be deposited in HOME.',
    category: 'battle'
  },
  {
    pokemonId: 746,
    pokemonName: 'Xerneas',
    restrictedForms: ['active'],
    compatibleForms: ['neutral'],
    notes: 'Active Mode cannot be deposited in HOME.',
    category: 'battle'
  },
  {
    pokemonId: 718,
    pokemonName: 'Zygarde',
    restrictedForms: ['complete', 'mega'],
    compatibleForms: ['50-percent', '10-percent'],
    notes: 'Complete Forme and Mega Zygarde cannot be deposited in HOME.',
    category: 'battle'
  },
  {
    pokemonId: 719,
    pokemonName: 'Diancie',
    restrictedForms: ['mega'],
    compatibleForms: ['normal'],
    notes: 'Mega Diancie cannot be deposited in HOME.',
    category: 'mega'
  },

  // Generation 7 Forms
  {
    pokemonId: 735,
    pokemonName: 'Gumshoos',
    restrictedForms: ['gumshoos-totem'],
    compatibleForms: ['normal'],
    notes: 'Totem form cannot be deposited in HOME.',
    category: 'battle'
  },
  {
    pokemonId: 746,
    pokemonName: 'Wishiwashi',
    restrictedForms: ['school', 'wishiwashi-totem'],
    compatibleForms: ['solo'],
    notes: 'School Form and Totem form cannot be deposited in HOME. Solo form is transferable.',
    category: 'battle'
  },
  {
    pokemonId: 754,
    pokemonName: 'Lurantis',
    restrictedForms: ['lurantis-totem'],
    compatibleForms: ['normal'],
    notes: 'Totem form cannot be deposited in HOME.',
    category: 'battle'
  },
  {
    pokemonId: 758,
    pokemonName: 'Salazzle',
    restrictedForms: ['salazzle-totem'],
    compatibleForms: ['normal'],
    notes: 'Totem form cannot be deposited in HOME.',
    category: 'battle'
  },
  {
    pokemonId: 752,
    pokemonName: 'Araquanid',
    restrictedForms: ['araquanid-totem'],
    compatibleForms: ['normal'],
    notes: 'Totem form cannot be deposited in HOME.',
    category: 'battle'
  },
  {
    pokemonId: 773,
    pokemonName: 'Silvally',
    restrictedForms: ['fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'],
    compatibleForms: ['normal'],
    notes: 'All Memory disc type forms cannot be deposited in HOME.',
    category: 'held-item'
  },
  {
    pokemonId: 778,
    pokemonName: 'Mimikyu',
    restrictedForms: ['busted', 'mimikyu-totem'],
    compatibleForms: ['disguised'],
    notes: 'Busted Form and Totem Form cannot be deposited in HOME.',
    category: 'battle'
  },
  {
    pokemonId: 777,
    pokemonName: 'Togedemaru',
    restrictedForms: ['togedemaru-totem'],
    compatibleForms: ['normal'],
    notes: 'Totem form cannot be deposited in HOME.',
    category: 'battle'
  },
  {
    pokemonId: 784,
    pokemonName: 'Kommo-o',
    restrictedForms: ['kommo-o-totem'],
    compatibleForms: ['normal'],
    notes: 'Totem form cannot be deposited in HOME.',
    category: 'battle'
  },
  {
    pokemonId: 800,
    pokemonName: 'Necrozma',
    restrictedForms: ['necrozma-dusk', 'necrozma-dawn', 'necrozma-ultra'],
    compatibleForms: ['normal', 'necrozma'],
    notes: 'Only base Necrozma can be deposited. Fusion forms and Ultra Necrozma cannot be deposited.',
    category: 'fusion'
  },

  // Generation 8 Forms & Gigamax
  {
    pokemonId: 809,
    pokemonName: 'Melmetal',
    restrictedForms: ['gigamax'],
    compatibleForms: ['normal'],
    notes: 'Gigamax Melmetal cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 812,
    pokemonName: 'Rillaboom',
    restrictedForms: ['gigamax'],
    compatibleForms: ['normal'],
    notes: 'Gigamax Rillaboom cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 815,
    pokemonName: 'Cinderace',
    restrictedForms: ['gigamax'],
    compatibleForms: ['normal'],
    notes: 'Gigamax Cinderace cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 818,
    pokemonName: 'Inteleon',
    restrictedForms: ['gigamax'],
    compatibleForms: ['normal'],
    notes: 'Gigamax Inteleon cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 823,
    pokemonName: 'Corviknight',
    restrictedForms: ['gigamax'],
    compatibleForms: ['normal'],
    notes: 'Gigamax Corviknight cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 826,
    pokemonName: 'Orbeetle',
    restrictedForms: ['gigamax'],
    compatibleForms: ['normal'],
    notes: 'Gigamax Orbeetle cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 834,
    pokemonName: 'Drednaw',
    restrictedForms: ['gigamax'],
    compatibleForms: ['normal'],
    notes: 'Gigamax Drednaw cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 839,
    pokemonName: 'Coalossal',
    restrictedForms: ['gigamax'],
    compatibleForms: ['normal'],
    notes: 'Gigamax Coalossal cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 841,
    pokemonName: 'Flapple',
    restrictedForms: ['gigamax'],
    compatibleForms: ['normal'],
    notes: 'Gigamax Flapple cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 842,
    pokemonName: 'Appletun',
    restrictedForms: ['gigamax'],
    compatibleForms: ['normal'],
    notes: 'Gigamax Appletun cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 844,
    pokemonName: 'Sandaconda',
    restrictedForms: ['gigamax'],
    compatibleForms: ['normal'],
    notes: 'Gigamax Sandaconda cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 845,
    pokemonName: 'Cramorant',
    restrictedForms: ['gulping', 'gorging'],
    compatibleForms: ['normal'],
    notes: 'Gulping Form and Gorging Form cannot be deposited in HOME.',
    category: 'battle'
  },
  {
    pokemonId: 849,
    pokemonName: 'Toxapex',
    restrictedForms: ['gigamax'],
    compatibleForms: ['normal'],
    notes: 'Gigamax Toxapex cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 851,
    pokemonName: 'Centiskorch',
    restrictedForms: ['gigamax'],
    compatibleForms: ['normal'],
    notes: 'Gigamax Centiskorch cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 858,
    pokemonName: 'Hatterene',
    restrictedForms: ['gigamax'],
    compatibleForms: ['normal'],
    notes: 'Gigamax Hatterene cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 861,
    pokemonName: 'Grimmsnarl',
    restrictedForms: ['gigamax'],
    compatibleForms: ['normal'],
    notes: 'Gigamax Grimmsnarl cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 869,
    pokemonName: 'Alcremie',
    restrictedForms: ['gigamax'],
    compatibleForms: [
      'normal', 'alcremie-vanilla-cream-strawberry-sweet', 'alcremie-vanilla-cream-berry-sweet', 'alcremie-vanilla-cream-love-sweet',
      'alcremie-vanilla-cream-star-sweet', 'alcremie-vanilla-cream-clover-sweet', 'alcremie-vanilla-cream-flower-sweet', 'alcremie-vanilla-cream-ribbon-sweet',
      'alcremie-ruby-cream-strawberry-sweet', 'alcremie-ruby-cream-berry-sweet', 'alcremie-ruby-cream-love-sweet', 'alcremie-ruby-cream-star-sweet',
      'alcremie-ruby-cream-clover-sweet', 'alcremie-ruby-cream-flower-sweet', 'alcremie-ruby-cream-ribbon-sweet',
      'alcremie-matcha-cream-strawberry-sweet', 'alcremie-matcha-cream-berry-sweet', 'alcremie-matcha-cream-love-sweet', 'alcremie-matcha-cream-star-sweet',
      'alcremie-matcha-cream-clover-sweet', 'alcremie-matcha-cream-flower-sweet', 'alcremie-matcha-cream-ribbon-sweet',
      'alcremie-mint-cream-strawberry-sweet', 'alcremie-mint-cream-berry-sweet', 'alcremie-mint-cream-love-sweet', 'alcremie-mint-cream-star-sweet',
      'alcremie-mint-cream-clover-sweet', 'alcremie-mint-cream-flower-sweet', 'alcremie-mint-cream-ribbon-sweet',
      'alcremie-lemon-cream-strawberry-sweet', 'alcremie-lemon-cream-berry-sweet', 'alcremie-lemon-cream-love-sweet', 'alcremie-lemon-cream-star-sweet',
      'alcremie-lemon-cream-clover-sweet', 'alcremie-lemon-cream-flower-sweet', 'alcremie-lemon-cream-ribbon-sweet',
      'alcremie-salted-cream-strawberry-sweet', 'alcremie-salted-cream-berry-sweet', 'alcremie-salted-cream-love-sweet', 'alcremie-salted-cream-star-sweet',
      'alcremie-salted-cream-clover-sweet', 'alcremie-salted-cream-flower-sweet', 'alcremie-salted-cream-ribbon-sweet',
      'alcremie-ruby-swirl-strawberry-sweet', 'alcremie-ruby-swirl-berry-sweet', 'alcremie-ruby-swirl-love-sweet', 'alcremie-ruby-swirl-star-sweet',
      'alcremie-ruby-swirl-clover-sweet', 'alcremie-ruby-swirl-flower-sweet', 'alcremie-ruby-swirl-ribbon-sweet',
      'alcremie-caramel-swirl-strawberry-sweet', 'alcremie-caramel-swirl-berry-sweet', 'alcremie-caramel-swirl-love-sweet', 'alcremie-caramel-swirl-star-sweet',
      'alcremie-caramel-swirl-clover-sweet', 'alcremie-caramel-swirl-flower-sweet', 'alcremie-caramel-swirl-ribbon-sweet',
      'alcremie-rainbow-swirl-strawberry-sweet', 'alcremie-rainbow-swirl-berry-sweet', 'alcremie-rainbow-swirl-love-sweet', 'alcremie-rainbow-swirl-star-sweet',
      'alcremie-rainbow-swirl-clover-sweet', 'alcremie-rainbow-swirl-flower-sweet', 'alcremie-rainbow-swirl-ribbon-sweet'
    ],
    notes: 'All Alcremie cosmetic forms are transferable. Only Gigamax Alcremie cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 875,
    pokemonName: 'Eiscue',
    restrictedForms: ['noice'],
    compatibleForms: ['ice'],
    notes: 'NoIce Face cannot be deposited in HOME.',
    category: 'battle'
  },
  {
    pokemonId: 877,
    pokemonName: 'Morpeko',
    restrictedForms: ['hangry'],
    compatibleForms: ['full-belly'],
    notes: 'Hangry Mode cannot be deposited in HOME.',
    category: 'battle'
  },
  {
    pokemonId: 879,
    pokemonName: 'Copperajah',
    restrictedForms: ['gigamax'],
    compatibleForms: ['normal'],
    notes: 'Gigamax Copperajah cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 884,
    pokemonName: 'Duraludon',
    restrictedForms: ['gigamax'],
    compatibleForms: ['normal'],
    notes: 'Gigamax Duraludon cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 888,
    pokemonName: 'Zacian',
    restrictedForms: ['crowned'],
    compatibleForms: ['hero'],
    notes: 'Crowned Sword form cannot be deposited in HOME.',
    category: 'held-item'
  },
  {
    pokemonId: 889,
    pokemonName: 'Zamazenta',
    restrictedForms: ['crowned'],
    compatibleForms: ['hero'],
    notes: 'Crowned Shield form cannot be deposited in HOME.',
    category: 'held-item'
  },
  {
    pokemonId: 890,
    pokemonName: 'Eternatus',
    restrictedForms: ['eternamax'],
    compatibleForms: ['normal'],
    notes: 'Eternamax form cannot be deposited in HOME.',
    category: 'special'
  },
  {
    pokemonId: 892,
    pokemonName: 'Urshifu',
    restrictedForms: ['single-strike-gigamax', 'rapid-strike-gigamax'],
    compatibleForms: ['single-strike', 'rapid-strike'],
    notes: 'Gigamax forms cannot be deposited in HOME.',
    category: 'gigamax'
  },
  {
    pokemonId: 898,
    pokemonName: 'Calyrex',
    restrictedForms: ['ice-rider', 'shadow-rider'],
    compatibleForms: ['normal'],
    notes: 'Fusion forms with Glastrier/Spectrier cannot be deposited.',
    category: 'fusion'
  },
  {
    pokemonId: 1024,
    pokemonName: 'Terapagos',
    restrictedForms: ['terastal', 'stellar'],
    compatibleForms: ['normal'],
    notes: 'Only Normal form can be deposited in HOME. Terastal and Stellar forms cannot be deposited.',
    category: 'battle'
  },
  // Terapagos variants with their specific IDs
  {
    pokemonId: 10276,
    pokemonName: 'Terapagos',
    restrictedForms: ['terastal'],
    compatibleForms: [],
    notes: 'Terastal form cannot be deposited in HOME.',
    category: 'battle'
  },
  {
    pokemonId: 10277,
    pokemonName: 'Terapagos',
    restrictedForms: ['stellar'],
    compatibleForms: [],
    notes: 'Stellar form cannot be deposited in HOME.',
    category: 'battle'
  }
];

// Helper functions for Pokemon HOME compatibility checks

// Get base Pokemon ID from form ID
function getBasePokemonId(pokemonId: number): number {
  // Necrozma forms mapping
  if (pokemonId === 10155 || pokemonId === 10156 || pokemonId === 10157) {
    return 800; // Base Necrozma ID
  }
  
  // Mimikyu Totem forms mapping
  if (pokemonId === 10144 || pokemonId === 10145) {
    return 778; // Base Mimikyu ID
  }
  
  // Add other form mappings as needed
  return pokemonId;
}

// Get restrictions for a specific Pokemon
export function getHomeRestrictions(pokemonId: number): HomeFormRestriction | undefined {
  const baseId = getBasePokemonId(pokemonId);
  return HOME_FORM_RESTRICTIONS.find(restriction => restriction.pokemonId === baseId);
}

// Check if a specific form can be deposited in HOME
export function canDepositForm(pokemonId: number, form: string): boolean {
  // Debug logging for Wishiwashi
  if (pokemonId === 746) {
    console.log(`DEBUG canDepositForm: pokemonId=${pokemonId}, form="${form}"`);
  }
  
  // Special handling for specific Pokemon IDs that override normal restrictions
  // These checks must come FIRST before any other form-based logic
  if (pokemonId === 10155 || pokemonId === 10156 || pokemonId === 10157) {
    return false; // Necrozma Dusk Mane, Dawn Wings, and Ultra forms cannot be deposited
  }
  
  // Special handling for Mimikyu Totem forms - these IDs override any form compatibility
  if (pokemonId === 10144 || pokemonId === 10145) {
    return false; // Mimikyu Totem Disguised and Totem Busted forms cannot be deposited
  }
  
  const restrictions = getHomeRestrictions(pokemonId);
  
  if (pokemonId === 746) {
    console.log(`DEBUG restrictions for 746:`, restrictions);
  }
  
  if (!restrictions) {
    return true; // No restrictions means it can be deposited
  }
  
  // Check if the form is explicitly restricted
  if (restrictions.restrictedForms.includes(form)) {
    if (pokemonId === 746) {
      console.log(`DEBUG form "${form}" is in restrictedForms:`, restrictions.restrictedForms);
    }
    return false;
  }
  
  // Check if the form is in the compatible forms list
  if (restrictions.compatibleForms.length > 0) {
    const result = restrictions.compatibleForms.includes(form);
    if (pokemonId === 746) {
      console.log(`DEBUG compatibleForms check: form="${form}", compatibleForms=`, restrictions.compatibleForms, `result=${result}`);
    }
    return result;
  }
  
  return true;
}

// Check if a Pokemon with original ID (before base conversion) can be deposited in HOME
export function canDepositFormWithOriginalId(originalId: number, form: string): boolean {
  // Special handling for specific Pokemon IDs that override normal restrictions
  // These checks must come FIRST before any other form-based logic
  if (originalId === 10155 || originalId === 10156 || originalId === 10157) {
    return false; // Necrozma Dusk Mane, Dawn Wings, and Ultra forms cannot be deposited
  }
  
  // Special handling for ALL Totem Pokemon IDs - these specific IDs are always Totem forms
  // regardless of the form parameter passed
  const totemIds = [
    10093, // Raticate Totem Alola
    10144, 10145, // Mimikyu Totem (Disguised, Busted)
    10121, // Gumshoos Totem (corrected ID)
    10122, // Vikavolt Totem
    10124, // Wishiwashi Totem (corrected ID)
    10149, // Lurantis Totem
    10150, // Salazzle Totem
    10151, // Araquanid Totem
    10154, // Togedemaru Totem
    10153  // Kommo-o Totem
  ];  if (totemIds.includes(originalId)) {
    return false; // All Totem forms cannot be deposited (always restricted)
  }
  
  // Use the existing canDepositForm function with base ID conversion
  return canDepositForm(originalId, form);
}

// Get all Pokemon with restrictions of a specific category
export function getRestrictionsByCategory(category: HomeFormRestriction['category']): HomeFormRestriction[] {
  return HOME_FORM_RESTRICTIONS.filter(restriction => restriction.category === category);
}

// Check if a Pokemon is generally HOME compatible (basic compatibility check)
export function isHomeCompatible(pokemonId: number): boolean {
  // All Pokemon from generations 1-9 are generally compatible with HOME
  // Only specific forms have restrictions
  return pokemonId >= 1 && pokemonId <= 1025;
}

// Get compatibility message for display
export function getCompatibilityMessage(pokemonId: number, form = 'normal'): string {
  const restrictions = getHomeRestrictions(pokemonId);
  
  if (!restrictions) {
    return 'Fully compatible with Pokemon HOME';
  }
  
  if (!canDepositForm(pokemonId, form)) {
    return `${form} form cannot be deposited in HOME. ${restrictions.notes}`;
  }
  
  if (restrictions.restrictedForms.length > 0) {
    return `Some forms have restrictions. ${restrictions.notes}`;
  }
  
  return 'Compatible with Pokemon HOME';
}