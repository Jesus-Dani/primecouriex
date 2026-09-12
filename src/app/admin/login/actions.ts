"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { StaffUserRow } from "@/lib/supabase/types";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent("Incorrect email or password.")}`);
  }

  redirect("/admin");
}

// Public self-service staff sign-up. Explicit, deliberate override of the
// original "no public sign-up, single business-provisioned role" security
// control (TRD §7, see scripts/create-staff-user.ts and README) — the
// client asked for open sign-up specifically, after being told plainly
// that anyone who finds /admin/login can grant themselves access to every
// customer's full contact details and legal case information this way.
// Left in place because that's what was asked for, not because it's the
// recommended posture for a system handling this kind of PII.
export async function signup(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "");

  if (!email || !password || !name) {
    redirect(`/admin/login?mode=signup&error=${encodeURIComponent("All fields are required.")}`);
  }
  if (password.length < 8) {
    redirect(
      `/admin/login?mode=signup&error=${encodeURIComponent("Password must be at least 8 characters.")}`,
    );
  }

  const admin = createAdminClient();

  const { data: authUser, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authUser.user) {
    redirect(
      `/admin/login?mode=signup&error=${encodeURIComponent(authError?.message ?? "Could not create account.")}`,
    );
  }

  // Same @supabase/supabase-js insert type-inference limitation documented
  // in src/app/booking/actions.ts — narrowly-typed intermediate rather than
  // fighting the broken inference.
  type InsertableStaffUsersTable = {
    insert: (row: Partial<StaffUserRow>) => PromiseLike<{ error: { message: string } | null }>;
  };
  const staffRow: Partial<StaffUserRow> = {
    id: authUser.user.id,
    name,
    email,
    role: "staff",
  };
  const { error: profileError } = await (
    admin.from("staff_users") as unknown as InsertableStaffUsersTable
  ).insert(staffRow);

  if (profileError) {
    redirect(
      `/admin/login?mode=signup&error=${encodeURIComponent("Account created but profile setup failed: " + profileError.message)}`,
    );
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

  if (signInError) {
    redirect("/admin/login?error=" + encodeURIComponent("Account created — please sign in."));
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
