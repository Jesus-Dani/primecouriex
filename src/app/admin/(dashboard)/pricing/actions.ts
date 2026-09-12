"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { DistrictRateRow } from "@/lib/supabase/types";

export interface ActionResult {
  status: "idle" | "error";
  formError?: string;
}

/** Same authorization model as every other admin Server Action in this
 * project (README/orders actions.ts): the action itself checks auth,
 * since it can be invoked directly and not only via the rendered page. */
async function requireStaffId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

function parseOptionalFee(raw: FormDataEntryValue | null): number | null {
  const str = String(raw ?? "").trim();
  if (str === "") return null;
  const n = Number(str);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export async function updateDistrictRate(formData: FormData): Promise<ActionResult> {
  try {
    await requireStaffId();
    const id = String(formData.get("id") ?? "");
    if (!id) return { status: "error", formError: "Missing district id." };

    const admin = createAdminClient();
    // Same @supabase/supabase-js insert/update type-inference limitation
    // documented throughout this project (README) — narrowly-typed
    // intermediate rather than fighting the broken inference.
    type UpdatableDistrictRatesTable = {
      update: (row: Partial<DistrictRateRow>) => {
        eq: (col: string, val: string) => PromiseLike<{ error: { message: string } | null }>;
      };
    };
    const { error } = await (admin.from("district_rates") as unknown as UpdatableDistrictRatesTable)
      .update({
        rider_rate: parseOptionalFee(formData.get("rider_rate")),
        standard_fee: parseOptionalFee(formData.get("standard_fee")),
        return_copy_addon_fee: parseOptionalFee(formData.get("return_copy_addon_fee")),
      })
      .eq("id", id);

    if (error) return { status: "error", formError: error.message };
    revalidatePath("/admin/pricing");
    return { status: "idle" };
  } catch (e) {
    return { status: "error", formError: (e as Error).message };
  }
}

export async function updateUrgentSurcharge(formData: FormData): Promise<ActionResult> {
  try {
    await requireStaffId();
    const value = Number(String(formData.get("value") ?? ""));
    if (!Number.isFinite(value) || value < 0) {
      return { status: "error", formError: "Enter a valid non-negative amount." };
    }

    const admin = createAdminClient();
    type UpdatablePricingConfigTable = {
      update: (row: { value: number }) => {
        eq: (col: string, val: string) => PromiseLike<{ error: { message: string } | null }>;
      };
    };
    const { error } = await (admin.from("pricing_config") as unknown as UpdatablePricingConfigTable)
      .update({ value })
      .eq("key", "urgent_surcharge");

    if (error) return { status: "error", formError: error.message };
    revalidatePath("/admin/pricing");
    return { status: "idle" };
  } catch (e) {
    return { status: "error", formError: (e as Error).message };
  }
}
