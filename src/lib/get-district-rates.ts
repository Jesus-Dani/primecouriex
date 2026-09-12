import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface PublicDistrictRate {
  district: string;
  standard_fee: number | null;
  return_copy_addon_fee: number | null;
}

/**
 * District names and customer-facing fees only — never rider_rate (the
 * business's internal cost, "NOT FOR CLIENT DISTRIBUTION" per the source
 * document). Safe to pass to a Client Component: unlike most data in this
 * app, these are prices we want customers to see.
 */
export async function getDistrictRates(): Promise<PublicDistrictRate[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("district_rates")
    .select("district, standard_fee, return_copy_addon_fee")
    .order("district");

  if (error) throw new Error(`Failed to load district rates: ${error.message}`);
  return data;
}
