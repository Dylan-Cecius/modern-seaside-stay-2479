export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      booking_customers: {
        Row: {
          consented_at: string | null
          email: string | null
          event_id: string
          first_name: string
          last_name: string
          phone: string
          privacy_version: string
          source: string
        }
        Insert: {
          consented_at?: string | null
          email?: string | null
          event_id: string
          first_name: string
          last_name: string
          phone: string
          privacy_version?: string
          source: string
        }
        Update: {
          consented_at?: string | null
          email?: string | null
          event_id?: string
          first_name?: string
          last_name?: string
          phone?: string
          privacy_version?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_customers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "booking_events"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_events: {
        Row: {
          created_at: string
          ends_at: string
          id: string
          kind: string
          note: string
          price_cents: number
          service_ids: string[]
          service_names: string
          starts_at: string
          status: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          id?: string
          kind: string
          note?: string
          price_cents?: number
          service_ids?: string[]
          service_names?: string
          starts_at: string
          status?: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          id?: string
          kind?: string
          note?: string
          price_cents?: number
          service_ids?: string[]
          service_names?: string
          starts_at?: string
          status?: string
        }
        Relationships: []
      }
      booking_hours: {
        Row: {
          closes: string
          enabled: boolean
          opens: string
          weekday: number
        }
        Insert: {
          closes?: string
          enabled?: boolean
          opens?: string
          weekday: number
        }
        Update: {
          closes?: string
          enabled?: boolean
          opens?: string
          weekday?: number
        }
        Relationships: []
      }
      booking_purge_log: {
        Row: {
          created_at: string
          id: string
          purged_by: string | null
          purged_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          purged_by?: string | null
          purged_count: number
        }
        Update: {
          created_at?: string
          id?: string
          purged_by?: string | null
          purged_count?: number
        }
        Relationships: []
      }
      booking_rate_log: {
        Row: {
          client_key: string
          created_at: string
          id: string
          phone_key: string
        }
        Insert: {
          client_key?: string
          created_at?: string
          id?: string
          phone_key?: string
        }
        Update: {
          client_key?: string
          created_at?: string
          id?: string
          phone_key?: string
        }
        Relationships: []
      }
      booking_rate_secret: {
        Row: {
          id: boolean
          pepper: string
        }
        Insert: {
          id?: boolean
          pepper?: string
        }
        Update: {
          id?: boolean
          pepper?: string
        }
        Relationships: []
      }
      booking_services: {
        Row: {
          active: boolean
          duration_minutes: number
          id: string
          name: string
          price_cents: number
          sort_order: number
          supplement: boolean
        }
        Insert: {
          active?: boolean
          duration_minutes?: number
          id?: string
          name: string
          price_cents: number
          sort_order?: number
          supplement?: boolean
        }
        Update: {
          active?: boolean
          duration_minutes?: number
          id?: string
          name?: string
          price_cents?: number
          sort_order?: number
          supplement?: boolean
        }
        Relationships: []
      }
      booking_settings: {
        Row: {
          durations_validated: boolean
          id: boolean
          privacy_contact: string
          privacy_validated: boolean
          public_enabled: boolean
          retention_days: number
          slot_interval_minutes: number
        }
        Insert: {
          durations_validated?: boolean
          id?: boolean
          privacy_contact?: string
          privacy_validated?: boolean
          public_enabled?: boolean
          retention_days?: number
          slot_interval_minutes?: number
        }
        Update: {
          durations_validated?: boolean
          id?: boolean
          privacy_contact?: string
          privacy_validated?: boolean
          public_enabled?: boolean
          retention_days?: number
          slot_interval_minutes?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_block: {
        Args: { p_end: string; p_note: string; p_start: string }
        Returns: string
      }
      admin_cancel: { Args: { p_id: string }; Returns: undefined }
      admin_create_booking: {
        Args: {
          p_services: string[]
          p_start: string
          p_first: string
          p_last: string
          p_phone: string
          p_email: string
          p_note: string
        }
        Returns: string
      }
      admin_count_expired_customers: { Args: never; Returns: number }
      admin_delete_customer: { Args: { p_id: string }; Returns: undefined }
      admin_purge_expired_customers: { Args: never; Returns: number }
      admin_save_booking_settings: {
        Args: { p_hours: Json; p_services: Json; p_settings: Json }
        Returns: undefined
      }
      booking_free_starts: {
        Args: {
          p_busy: unknown[]
          p_closes: string
          p_date: string
          p_duration: number
          p_now: string
          p_opens: string
          p_step: number
        }
        Returns: string[]
      }
      booking_slots: {
        Args: { p_date: string; p_services: string[] }
        Returns: {
          starts_at: string
        }[]
      }
      create_booking: {
        Args: {
          p_client_key?: string
          p_consent: boolean
          p_email: string
          p_first: string
          p_last: string
          p_manual?: boolean
          p_phone: string
          p_services: string[]
          p_start: string
        }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      system_purge_expired_booking_data: { Args: never; Returns: number }
    }
    Enums: {
      app_role: "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
    },
  },
} as const
