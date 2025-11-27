import { ProductInfo } from '../types';

const CACHE_KEY = 'scanned_products';

export function cacheProduct(product: ProductInfo): void {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const products: ProductInfo[] = cached ? JSON.parse(cached) : [];
    
    // Add new product to the beginning of the array
    products.unshift(product);
    
    // Keep only the last 100 products
    if (products.length > 100) {
      products.pop();
    }
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error caching product:', error);
  }
}

export function getCachedProducts(): ProductInfo[] {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  } catch (error) {
    console.error('Error retrieving cached products:', error);
    return [];
  }
}

export function getCachedProduct(id: string): ProductInfo | null {
  try {
    const products = getCachedProducts();
    return products.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error retrieving cached product:', error);
    return null;
  }
}