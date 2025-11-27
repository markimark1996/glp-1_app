export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ProductCategory = 'dairy' | 'produce' | 'meat' | 'grains' | 'snacks' | 'beverages' | 'pantry' | 'frozen' | 'other';

export interface Database {
  public: {
    Tables: {
      scanned_products: {
        Row: {
          id: string
          barcode: string | null
          name: string
          brand: string
          manufacturer: string | null
          category: ProductCategory
          weight_value: number | null
          weight_unit: string | null
          serving_size: string | null
          calories: number | null
          protein: number | null
          carbs: number | null
          fat: number | null
          fiber: number | null
          sugar: number | null
          ingredients: string[] | null
          is_vegan: boolean
          is_vegetarian: boolean
          is_gluten_free: boolean
          image_url: string | null
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          barcode?: string | null
          name: string
          brand: string
          manufacturer?: string | null
          category?: ProductCategory
          weight_value?: number | null
          weight_unit?: string | null
          serving_size?: string | null
          calories?: number | null
          protein?: number | null
          carbs?: number | null
          fat?: number | null
          fiber?: number | null
          sugar?: number | null
          ingredients?: string[] | null
          is_vegan?: boolean
          is_vegetarian?: boolean
          is_gluten_free?: boolean
          image_url?: string | null
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          barcode?: string | null
          name?: string
          brand?: string
          manufacturer?: string | null
          category?: ProductCategory
          weight_value?: number | null
          weight_unit?: string | null
          serving_size?: string | null
          calories?: number | null
          protein?: number | null
          carbs?: number | null
          fat?: number | null
          fiber?: number | null
          sugar?: number | null
          ingredients?: string[] | null
          is_vegan?: boolean
          is_vegetarian?: boolean
          is_gluten_free?: boolean
          image_url?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      product_certifications: {
        Row: {
          id: string
          product_id: string
          certification: string
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          certification: string
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          certification?: string
          created_at?: string
        }
      }
      product_allergens: {
        Row: {
          id: string
          product_id: string
          allergen: string
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          allergen: string
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          allergen?: string
          created_at?: string
        }
      }
      scan_history: {
        Row: {
          id: string
          user_id: string
          product_id: string | null
          scan_quality: number | null
          lighting_condition: string | null
          scan_duration: number | null
          successful: boolean
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id?: string | null
          scan_quality?: number | null
          lighting_condition?: string | null
          scan_duration?: number | null
          successful?: boolean
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string | null
          scan_quality?: number | null
          lighting_condition?: string | null
          scan_duration?: number | null
          successful?: boolean
          error_message?: string | null
          created_at?: string
        }
      }
    }
  }
}