export interface Image {
    url: string;
    alt: string;
  }
  
  export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    countInStock: number;
    category: string;
    brand: string;
    sizes: string[];
    colors: string[];
    collections: string;
    gender: string;
    images: Image[];
    isFeatured: boolean;
    isPublished: boolean;
  }
  
  export interface AuthUser {
    id: string;
    email: string;
    token: string;
  }
  export interface Category {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }
  export interface User {
    _id: string;
    name: string;
    email: string;
    password?: string;
    role: 'user' | 'admin' | 'sale-staff';
    phone: string;
    createdAt: string;
    updatedAt: string;
  }
  