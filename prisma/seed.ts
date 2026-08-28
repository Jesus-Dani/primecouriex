import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Locked v1 pricing values — PRD §10.1-10.3, TRD §3.2.
const PRICING_CONFIG: Record<string, number> = {
  rate_per_km: 540,
  minimum_charge: 5000,
  urgent_surcharge: 5000,
  return_copy_addon_fee: 3500,
};

async function main() {
  for (const [key, value] of Object.entries(PRICING_CONFIG)) {
    await prisma.pricingConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  console.log("Seeded PricingConfig:", PRICING_CONFIG);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
