export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      entries: {
        Row: {
          cash_end: number | null
          cash_rate: number | null
          cash_recurring: number | null
          cash_recurring_rate: number | null
          cash_start: number | null
          cash_taxable: boolean | null
          created_at: string
          end_year: number | null
          existing: boolean | null
          id: number
          investments_end: number | null
          investments_rate: number | null
          investments_recurring: number | null
          investments_recurring_rate: number | null
          investments_start: number | null
          loans_end: number | null
          loans_periods: number | null
          loans_rate: number | null
          loans_start: number | null
          name: string | null
          parent_id: number | null
          property_end: number | null
          property_rate: number | null
          property_start: number | null
          scenario: string | null
          start_year: number | null
          sub_type: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          cash_end?: number | null
          cash_rate?: number | null
          cash_recurring?: number | null
          cash_recurring_rate?: number | null
          cash_start?: number | null
          cash_taxable?: boolean | null
          created_at?: string
          end_year?: number | null
          existing?: boolean | null
          id?: number
          investments_end?: number | null
          investments_rate?: number | null
          investments_recurring?: number | null
          investments_recurring_rate?: number | null
          investments_start?: number | null
          loans_end?: number | null
          loans_periods?: number | null
          loans_rate?: number | null
          loans_start?: number | null
          name?: string | null
          parent_id?: number | null
          property_end?: number | null
          property_rate?: number | null
          property_start?: number | null
          scenario?: string | null
          start_year?: number | null
          sub_type?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          cash_end?: number | null
          cash_rate?: number | null
          cash_recurring?: number | null
          cash_recurring_rate?: number | null
          cash_start?: number | null
          cash_taxable?: boolean | null
          created_at?: string
          end_year?: number | null
          existing?: boolean | null
          id?: number
          investments_end?: number | null
          investments_rate?: number | null
          investments_recurring?: number | null
          investments_recurring_rate?: number | null
          investments_start?: number | null
          loans_end?: number | null
          loans_periods?: number | null
          loans_rate?: number | null
          loans_start?: number | null
          name?: string | null
          parent_id?: number | null
          property_end?: number | null
          property_rate?: number | null
          property_start?: number | null
          scenario?: string | null
          start_year?: number | null
          sub_type?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'entries_parent_id_fkey'
            columns: ['parent_id']
            isOneToOne: false
            referencedRelation: 'entries'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'entries_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never
