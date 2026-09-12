import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PricingConfigRow } from "@/lib/supabase/types";

export async function getUrgentSurcharge(): Promise<number> {
  const supabase = createAdminClient();
  // .returns<>() explicitly overrides the inferred row type — Supabase JS's
  // automatic inference for .from(table) has a known issue where, past a
  // certain number of tables in the Database type, type-checking for one
  // specific table's queries can silently collapse to `never` rather than
  // erroring clearly. This is the library's documented escape hatch.
  const { data, error } = await supabase
    .from("pricing_config")
    .select("*")
    .eq("key", "urgent_surcharge")
    .returns<PricingConfigRow[]>();

  if (error) throw new Error(`Failed to load pricing config: ${error.message}`);
  if (!data[0]) throw new Error("pricing_config is missing the urgent_surcharge row");
  return data[0].value;
}
