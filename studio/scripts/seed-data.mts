// Demo catalogue carried over from the storefront's design kit (it used to be
// hard-coded in src/data/catalog.ts). Names and prices are illustrative, not
// real stock. Order matters: the storefront lists products oldest first, and
// the seed gives each one a creation time that follows this order.

export type SeedCategory = 'peces' | 'alimento' | 'equipos' | 'plantas';
export type SeedWater = 'dulce' | 'salada';
export type SeedIcon =
  | 'fish-symbol'
  | 'waves'
  | 'thermometer'
  | 'flask-conical'
  | 'leaf'
  | 'wrench'
  | 'box';
export type SeedBadgeTone = 'tide' | 'coral' | 'bronze' | 'kelp' | 'neutral';

export interface SeedProduct {
  slug: string;
  name: string;
  category: SeedCategory;
  water?: SeedWater;
  subtitle: string;
  price: number;
  compareAt?: number;
  /** File name inside IMAGE_DIR, uploaded as an image asset. */
  imageFile?: string;
  icon?: SeedIcon;
  badgeLabel?: string;
  badgeTone?: SeedBadgeTone;
  specs: string[];
  beginner?: boolean;
  inStock: boolean;
  temp?: string;
  ph?: string;
  size?: string;
  mates?: string;
}

export const seedProducts: SeedProduct[] = [
  {
    slug: 'payaso',
    name: 'Pez payaso',
    category: 'peces',
    water: 'salada',
    subtitle: 'Amphiprion ocellaris',
    price: 24,
    imageFile: 'tropical-aquarium.jpg',
    badgeLabel: 'Favorito',
    badgeTone: 'tide',
    specs: ['24–27 °C', 'pH 8.1–8.4', '8 cm'],
    beginner: true,
    inStock: true,
    temp: '24–27 °C',
    ph: '8.1–8.4',
    size: '8 cm',
    mates: 'Pacífico — convive en comunidad',
  },
  {
    slug: 'cirujano',
    name: 'Pez cirujano azul',
    category: 'peces',
    water: 'salada',
    subtitle: 'Paracanthurus hepatus',
    price: 38,
    compareAt: 45,
    imageFile: 'tropical-aquarium.jpg',
    badgeLabel: '-15%',
    badgeTone: 'coral',
    specs: ['24–26 °C', 'pH 8.1–8.4', '25 cm'],
    inStock: true,
    temp: '24–26 °C',
    ph: '8.1–8.4',
    size: '25 cm',
    mates: 'Necesita acuario grande (300 L+)',
  },
  {
    slug: 'leon',
    name: 'Pez león',
    category: 'peces',
    water: 'salada',
    subtitle: 'Pterois volitans',
    price: 62,
    imageFile: 'lionfish-reef.jpg',
    badgeLabel: 'Experto',
    badgeTone: 'bronze',
    specs: ['23–27 °C', 'pH 8.1–8.4', '35 cm'],
    inStock: true,
    temp: '23–27 °C',
    ph: '8.1–8.4',
    size: '35 cm',
    mates: 'Depredador — solo con peces grandes',
  },
  {
    slug: 'mariposa',
    name: 'Pez mariposa',
    category: 'peces',
    water: 'salada',
    subtitle: 'Chaetodon sp.',
    price: 41,
    imageFile: 'coral-reef-school.jpg',
    specs: ['24–27 °C', 'pH 8.1–8.4', '15 cm'],
    inStock: false,
    temp: '24–27 °C',
    ph: '8.1–8.4',
    size: '15 cm',
    mates: 'Pacífico — puede picar corales',
  },
  {
    slug: 'pacu',
    name: 'Pacú',
    category: 'peces',
    water: 'dulce',
    subtitle: 'Piaractus brachypomus',
    price: 29,
    imageFile: 'freshwater-moss-tank.jpg',
    specs: ['24–28 °C', 'pH 6.5–7.5', '40 cm+'],
    inStock: true,
    temp: '24–28 °C',
    ph: '6.5–7.5',
    size: '40 cm+',
    mates: 'Crece mucho — acuario de 500 L+',
  },
  {
    slug: 'guppy',
    name: 'Guppy',
    category: 'peces',
    water: 'dulce',
    subtitle: 'Poecilia reticulata',
    price: 4.5,
    imageFile: 'tank-marine-flora.jpg',
    badgeLabel: 'Principiantes',
    badgeTone: 'kelp',
    specs: ['22–28 °C', 'pH 7.0–8.0', '4 cm'],
    beginner: true,
    inStock: true,
    temp: '22–28 °C',
    ph: '7.0–8.0',
    size: '4 cm',
    mates: 'Pacífico — ideal para empezar',
  },
  {
    slug: 'escamas',
    name: 'Escamas tropicales',
    category: 'alimento',
    water: 'dulce',
    subtitle: '100 g',
    price: 9,
    icon: 'fish-symbol',
    specs: ['Uso diario'],
    inStock: true,
  },
  {
    slug: 'pellets',
    name: 'Pellets marinos',
    category: 'alimento',
    water: 'salada',
    subtitle: '120 g',
    price: 12,
    icon: 'fish-symbol',
    specs: ['Hunde lento'],
    inStock: true,
  },
  {
    slug: 'filtro',
    name: 'Filtro externo',
    category: 'equipos',
    subtitle: 'Hasta 300 L',
    price: 119,
    icon: 'waves',
    badgeLabel: 'Nuevo',
    badgeTone: 'tide',
    specs: ['1200 L/h'],
    inStock: true,
  },
  {
    slug: 'calentador',
    name: 'Calentador sumergible',
    category: 'equipos',
    subtitle: '100 W',
    price: 27,
    icon: 'thermometer',
    specs: ['20–32 °C'],
    inStock: true,
  },
  {
    slug: 'test',
    name: 'Kit de test de agua',
    category: 'equipos',
    subtitle: 'pH · NO₂ · NO₃ · NH₃',
    price: 34,
    icon: 'flask-conical',
    specs: ['5 parámetros'],
    inStock: true,
  },
  {
    slug: 'conchas',
    name: 'Conchas y grava de colores',
    category: 'plantas',
    subtitle: 'Bolsa 2 kg',
    price: 11,
    imageFile: 'colorful-aquarium-small-fish.jpg',
    specs: ['Lavada'],
    inStock: true,
  },
];
