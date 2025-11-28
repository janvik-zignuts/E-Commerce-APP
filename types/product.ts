import type { Timestamp } from 'firebase/firestore';

export interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  discount?: number;
  category: string;
  brand: string;
  image: string;
  alt: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  inStock: boolean;
  sizes: string[];
  colors: string[];
  dateAdded: string;
}

export interface CartItem extends Product {
  quantity: number;
  addedAt?: Timestamp | string;
  updatedAt?: Timestamp | string;
}

