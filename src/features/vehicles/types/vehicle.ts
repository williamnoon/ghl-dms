export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  condition: 'new' | 'used' | 'certified';
  status: 'available' | 'sold' | 'pending';
  description: string;
  specifications: Record<string, string>;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryFilters {
  search: string;
  condition: Vehicle['condition'][];
  status: Vehicle['status'][];
  minPrice: number;
  maxPrice: number;
  minYear: number;
  maxYear: number;
}