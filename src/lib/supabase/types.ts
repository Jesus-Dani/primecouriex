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

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: BookingRow;
        Insert: Omit<BookingRow, "id" | "created_at" | "updated_at"> &
          Partial<Pick<BookingRow, "id" | "created_at" | "updated_at">>;
        Update: Partial<BookingRow>;
      };
      staff_users: {
        Row: StaffUserRow;
        Insert: Omit<StaffUserRow, "created_at"> & Partial<Pick<StaffUserRow, "created_at">>;
        Update: Partial<StaffUserRow>;
      };
      booking_status_history: {
        Row: BookingStatusHistoryRow;
        Insert: Omit<BookingStatusHistoryRow, "id" | "created_at"> &
          Partial<Pick<BookingStatusHistoryRow, "id" | "created_at">>;
        Update: Partial<BookingStatusHistoryRow>;
      };
      pricing_config: {
        Row: PricingConfigRow;
        Insert: Omit<PricingConfigRow, "id" | "updated_at"> &
          Partial<Pick<PricingConfigRow, "id" | "updated_at">>;
        Update: Partial<PricingConfigRow>;
      };
    };
  };
}
