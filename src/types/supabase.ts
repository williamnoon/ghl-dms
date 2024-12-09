export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      vehicles: {
        Row: {
          id: string
          make: string
          model: string
          year: number
          price: number
          condition: 'new' | 'used' | 'certified'
          status: 'available' | 'sold' | 'pending'
          description: string
          specifications: Json
          images: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          make: string
          model: string
          year: number
          price: number
          condition: 'new' | 'used' | 'certified'
          status: 'available' | 'sold' | 'pending'
          description: string
          specifications?: Json
          images?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          make?: string
          model?: string
          year?: number
          price?: number
          condition?: 'new' | 'used' | 'certified'
          status?: 'available' | 'sold' | 'pending'
          description?: string
          specifications?: Json
          images?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      initialize_vehicles_table: {
        Args: Record<string, never>
        Returns: void
      }
    }
  }
}