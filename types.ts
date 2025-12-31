
export enum Category {
  MENINAS = "Meninas",
  MENINOS = "Meninos",
  BEBES = "Bebês",
  NOVIDADES = "Novidades",
  PROMOCOES = "Promoções"
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  old_price?: number;
  category: Category;
  category_id?: string;
  sizes: string[];
  colors: string[];
  image: string;
  is_popular?: boolean;
  is_new?: boolean;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}
