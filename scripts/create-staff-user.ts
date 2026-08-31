// One-off provisioning tool: there is no public staff sign-up (TRD §7 — a
// single, business-provisioned role in v1), so the first staff accounts are
// created this way rather than through the app itself.
//
// Usage: npm run create-staff-user -- "staff@example.com" "a-strong-password" "Full Name"
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const [, , email, password, name] = process.argv;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

if (!email || !password || !name) {
  console.error('Usage: npm run create-staff-user -- "<email>" "<password>" "<full name>"');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authUser.user) {
    console.error("Failed to create auth user:", authError?.message);
    process.exit(1);
  }

  const { error: profileError } = await supabase.from("staff_users").insert({
    id: authUser.user.id,
    name,
    email,
    role: "staff",
  });

  if (profileError) {
    console.error("Auth user created, but failed to create the staff_users profile:");
    console.error(profileError.message);
    process.exit(1);
  }

  console.log(`Staff user created: ${email} (${authUser.user.id})`);
}

main();
