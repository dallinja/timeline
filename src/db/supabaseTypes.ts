export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      entries: {
        Row: {
          cash_end: number | null
          cash_start: number | null
          cash_start_rate: number | null
          cash_recurring: number | null
          cash_recurring_rate: number | null
          created_at: string
          end_year: number | null
          id: number
          investments_end: number | null
          investments_start: number | null
          investments_start_rate: number | null
          investments_recurring: number | null
          investments_recurring_rate: number | null
          loans_end: number | null
          loans_periods: number | null
          loans_rate: number | null
          loans_start: number | null
          name: string | null
          parent_id: number | null
          property_end: number | null
          property_start: number | null
          property_start_rate: number | null
          start_year: number | null
          type: string | null
          user_id: string
        }
        Insert: {
          cash_end?: number | null
          cash_start?: number | null
          cash_recurring?: number | null
          cash_recurring_rate?: number | null
          created_at?: string
          end_year?: number | null
          id?: number
          investments_end?: number | null
          investments_start?: number | null
          loans_end?: number | null
          loans_periods?: number | null
          loans_rate?: number | null
          loans_start?: number | null
          name?: string | null
          parent_id?: number | null
          property_end?: number | null
          property_start?: number | null
          property_start_rate?: number | null
          start_year?: number | null
          type?: string | null
          user_id: string
        }
        Update: {
          cash_end?: number | null
          cash_start?: number | null
          cash_recurring?: number | null
          cash_recurring_rate?: number | null
          created_at?: string
          end_year?: number | null
          id?: number
          investments_end?: number | null
          investments_start?: number | null
          loans_end?: number | null
          loans_periods?: number | null
          loans_rate?: number | null
          loans_start?: number | null
          name?: string | null
          parent_id?: number | null
          property_end?: number | null
          property_start?: number | null
          property_start_rate?: number | null
          start_year?: number | null
          type?: string | null
          user_id?: string
        }
      }
      users: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      net_worth_chart_data: {
        Returns: {
          year: number
          cash: number
          property: number
          investments: number
          loans: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
