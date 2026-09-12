// Hand-written to match supabase/migrations/0001_init.sql exactly.
// Regenerate with `supabase gen types typescript` once the project is linked
// via the Supabase CLI, to keep this in sync automatically.

export type ServiceType =
  | "process_serving"
  | "registry_liaison"
  | "corporate_courier"
  | "same_day_delivery"
  | "filing_compliance";

export type DeliverySpeed = "standard" | "same_day" | "urgent_express";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export type BookingStatus =
  "pending_review" | "confirmed" | "rejected" | "in_transit" | "delivered" | "cancelled";

export interface BookingRow {
  id: string;
  reference_number: string;
  service_type: ServiceType;
  delivery_speed: DeliverySpeed;

  customer_name: string;
  company_name: string | null;
  phone: string;
  whatsapp_number: string;
  email: string;
  pickup_address: string;
  pickup_lat: number | null;
  pickup_lng: number | null;
  // Which district the booking was priced against (TRD §4) — added by
  // supabase/migrations/0003_booking_pickup_district.sql for the district-
  // rate pricing model. Distinct from pickup_address, which is the free-text
  // street address for the courier.
  pickup_district: string;
  pickup_contact_name: string;
  pickup_contact_phone: string;
  delivery_address: string;
  delivery_lat: number | null;
  delivery_lng: number | null;
  recipient_name: string;
  recipient_phone: string;

  package_description: string;
  weight_kg: number;
  package_count: number;
  delivery_instructions: string | null;
  preferred_pickup_date: string;
  preferred_delivery_date: string | null;
  additional_notes: string | null;

  legal_court_name: string | null;
  legal_suit_case_number: string | null;
  legal_process_document: string | null;
  legal_client_address: string | null;
  legal_company_name: string | null;
  legal_landmark: string | null;
  return_copy_addon: boolean;

  distance_km: number | null;
  base_price: number | null;
  urgent_surcharge: number;
  addon_total: number;
  total_price: number | null;

  payment_status: PaymentStatus;
  paystack_reference: string | null;

  status: BookingStatus;
  rejection_reason: string | null;
  notified_at: string | null;
  notified_by_staff_id: string | null;
  // Added by supabase/migrations/0004_booking_notification_fields.sql —
  // TRD §8's "Mark as Notified" channel/notes, missing from the originally
  // locked schema.
  notified_channel: string | null;
  notified_note: string | null;
  confirmed_by_staff_id: string | null;

  client_confirmation_accepted: boolean;
  data_consent_accepted: boolean;
  data_consent_timestamp: string;

  created_at: string;
  updated_at: string;
}

export interface StaffUserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface BookingStatusHistoryRow {
  id: string;
  booking_id: string;
  from_status: BookingStatus | null;
  to_status: BookingStatus;
  changed_by_staff_id: string;
  note: string | null;
  created_at: string;
}

export interface PricingConfigRow {
  id: string;
  key: string;
  value: number;
  updated_at: string;
}

// District flat-rate pricing (supabase/migrations/0002_district_rates.sql) —
// client-directed override of the distance-based engine, "for now". null
// standard_fee/return_copy_addon_fee means "price on request" (Zuba, Abaji
// — see seed.sql). rider_rate is internal-only; never render it to customers.
export interface DistrictRateRow {
  id: string;
  district: string;
  rider_rate: number | null;
  standard_fee: number | null;
  return_copy_addon_fee: number | null;
  created_at: string;
  updated_at: string;
}

// Backs the public /track rate limit (supabase/migrations/
// 0005_track_lookup_attempts.sql) — never customer-facing.
export interface TrackLookupAttemptRow {
  id: string;
  ip_address: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      // Insert/Update use a plain Partial<Row> rather than the more precise
      // Omit<Row, "id"|...> & Partial<Pick<Row, "id"|...>> pattern (which
      // marks only id/timestamp columns optional). That more precise form
      // computes a materially more complex type per table, and with five
      // tables this pushed @supabase/supabase-js's row-inference past some
      // internal complexity threshold — queries against specific tables
      // (which one seemed arbitrary) silently resolved to `never` instead of
      // their real Row type, with no type error pointing at the cause. All
      // required fields are already enforced by the Zod schema before any
      // insert happens (src/lib/booking-schema.ts), so the looser Insert
      // type here costs us little.
      bookings: {
        Row: BookingRow;
        Insert: Partial<BookingRow>;
        Update: Partial<BookingRow>;
        Relationships: [];
      };
      staff_users: {
        Row: StaffUserRow;
        Insert: Partial<StaffUserRow>;
        Update: Partial<StaffUserRow>;
        Relationships: [];
      };
      booking_status_history: {
        Row: BookingStatusHistoryRow;
        Insert: Partial<BookingStatusHistoryRow>;
        Update: Partial<BookingStatusHistoryRow>;
        Relationships: [];
      };
      pricing_config: {
        Row: PricingConfigRow;
        Insert: Partial<PricingConfigRow>;
        Update: Partial<PricingConfigRow>;
        Relationships: [];
      };
      district_rates: {
        Row: DistrictRateRow;
        Insert: Partial<DistrictRateRow>;
        Update: Partial<DistrictRateRow>;
        Relationships: [];
      };
      track_lookup_attempts: {
        Row: TrackLookupAttemptRow;
        Insert: Partial<TrackLookupAttemptRow>;
        Update: Partial<TrackLookupAttemptRow>;
        Relationships: [];
      };
    };
    // @supabase/supabase-js's generic row-inference overloads expect these
    // keys to exist alongside Tables, even empty — omitting them silently
    // breaks type inference (e.g. .single() resolving to `never`) on some
    // queries rather than raising a clear error. `{ [_ in never]: never }`
    // matches exactly what `supabase gen types typescript` emits for an
    // empty section — plain `Record<string, never>` does not satisfy the
    // library's GenericSchema constraint the same way.
    Views: { [_ in never]: never };
    Functions: {
      check_track_rate_limit: {
        Args: {
          p_ip_address: string;
          p_window_minutes: number;
          p_max_attempts: number;
        };
        Returns: boolean;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
