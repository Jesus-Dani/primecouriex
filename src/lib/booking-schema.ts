import { z } from "zod";
import type { ServiceType, DeliverySpeed } from "@/lib/supabase/types";

export const SERVICE_TYPES: ServiceType[] = [
  "process_serving",
  "registry_liaison",
  "corporate_courier",
  "same_day_delivery",
  "filing_compliance",
];

export const DELIVERY_SPEEDS: DeliverySpeed[] = ["standard", "same_day", "urgent_express"];

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .optional();

export const bookingSchema = z
  .object({
    service_type: z.enum(SERVICE_TYPES as [ServiceType, ...ServiceType[]], {
      message: "Select a service type",
    }),
    delivery_speed: z.enum(DELIVERY_SPEEDS as [DeliverySpeed, ...DeliverySpeed[]], {
      message: "Select a delivery speed",
    }),

    customer_name: z.string().trim().min(1, "Your full name is required"),
    company_name: optionalText,
    phone: z.string().trim().min(1, "Phone number is required"),
    whatsapp_number: z.string().trim().min(1, "WhatsApp number is required"),
    email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),

    pickup_district: z.string().trim().min(1, "Select a pickup district"),
    pickup_address: z.string().trim().min(1, "Pickup address is required"),
    pickup_contact_name: z.string().trim().min(1, "Pickup contact name is required"),
    pickup_contact_phone: z.string().trim().min(1, "Pickup contact phone is required"),

    delivery_address: z.string().trim().min(1, "Delivery address is required"),
    recipient_name: z.string().trim().min(1, "Recipient name is required"),
    recipient_phone: z.string().trim().min(1, "Recipient phone is required"),

    package_description: z.string().trim().min(1, "Describe what needs to be delivered"),
    weight_kg: z.coerce
      .number({ message: "Enter a valid weight" })
      .positive("Enter a valid weight"),
    package_count: z.coerce
      .number({ message: "Enter a valid number of items" })
      .int()
      .positive("Enter a valid number of items"),
    delivery_instructions: optionalText,
    preferred_pickup_date: z.string().trim().min(1, "Select a preferred pickup date"),
    preferred_delivery_date: optionalText,
    additional_notes: optionalText,

    return_copy_addon: z.boolean(),

    legal_court_name: optionalText,
    legal_suit_case_number: optionalText,
    legal_process_document: optionalText,
    legal_client_address: optionalText,
    legal_company_name: optionalText,
    legal_landmark: optionalText,

    client_confirmation_accepted: z.literal(true, {
      message: "You must confirm the information provided is accurate",
    }),
    data_consent_accepted: z.literal(true, {
      message: "You must consent to data processing to continue",
    }),
  })
  .refine(
    (data) =>
      data.service_type !== "process_serving" ||
      (data.legal_court_name && data.legal_suit_case_number && data.legal_process_document),
    {
      message:
        "Court name, suit/case number, and the process to be served are required for legal bookings",
      path: ["legal_court_name"],
    },
  );

export type BookingFormValues = z.infer<typeof bookingSchema>;

/** Converts raw FormData into the plain object bookingSchema expects.
 * Checkboxes need explicit handling — FormData omits unchecked ones
 * entirely rather than sending "false". */
export function formDataToBookingInput(formData: FormData): Record<string, unknown> {
  const text = (name: string) => formData.get(name)?.toString() ?? "";
  const checked = (name: string) => formData.get(name) === "on";

  return {
    service_type: text("service_type"),
    delivery_speed: text("delivery_speed"),
    customer_name: text("customer_name"),
    company_name: text("company_name"),
    phone: text("phone"),
    whatsapp_number: text("whatsapp_number"),
    email: text("email"),
    pickup_district: text("pickup_district"),
    pickup_address: text("pickup_address"),
    pickup_contact_name: text("pickup_contact_name"),
    pickup_contact_phone: text("pickup_contact_phone"),
    delivery_address: text("delivery_address"),
    recipient_name: text("recipient_name"),
    recipient_phone: text("recipient_phone"),
    package_description: text("package_description"),
    weight_kg: text("weight_kg"),
    package_count: text("package_count"),
    delivery_instructions: text("delivery_instructions"),
    preferred_pickup_date: text("preferred_pickup_date"),
    preferred_delivery_date: text("preferred_delivery_date"),
    additional_notes: text("additional_notes"),
    return_copy_addon: checked("return_copy_addon"),
    legal_court_name: text("legal_court_name"),
    legal_suit_case_number: text("legal_suit_case_number"),
    legal_process_document: text("legal_process_document"),
    legal_client_address: text("legal_client_address"),
    legal_company_name: text("legal_company_name"),
    legal_landmark: text("legal_landmark"),
    client_confirmation_accepted: checked("client_confirmation_accepted"),
    data_consent_accepted: checked("data_consent_accepted"),
  };
}
