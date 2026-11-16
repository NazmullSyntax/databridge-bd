import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcrypt";

// Initialize the PostgreSQL adapter
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// Pass the adapter to PrismaClient
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Create Roles
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN", description: "System administrator" },
  });

  const teamRole = await prisma.role.upsert({
    where: { name: "TEAM" },
    update: {},
    create: { name: "TEAM", description: "Research team member" },
  });

  const customerRole = await prisma.role.upsert({
    where: { name: "CUSTOMER" },
    update: {},
    create: { name: "CUSTOMER", description: "Platform customer" },
  });

  console.log("✅ Roles created");

  // 2. Create Admin User
  const passwordHash = await bcrypt.hash("Admin@12345", 12);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@databridgebd.com" },
    update: {},
    create: {
      email: "admin@databridgebd.com",
      passwordHash,
      fullName: "Admin User",
      roleId: adminRole.id,
      emailVerified: true,
      isActive: true,
    },
  });

  console.log("✅ Admin user created:", adminUser.email);

  // 3. Create Sample Services
  const services = [
    {
      slug: "field-survey",
      title: "Field Survey",
      titleBn: "ফিল্ড সার্ভে",
      description: "On-ground data collection with verified respondents.",
      category: "FIELD_SURVEY",
      basePrice: 5000.0,
    },
    {
      slug: "market-research",
      title: "Market Research",
      titleBn: "মার্কেট রিসার্চ",
      description: "Comprehensive market analysis for Bangladesh.",
      category: "MARKET_RESEARCH",
      basePrice: 15000.0,
    },
    {
      slug: "business-data-collection",
      title: "Business Data Collection",
      titleBn: "ব্যবসায়িক ডেটা কালেকশন",
      description: "Verified business information across Bangladesh.",
      category: "BUSINESS_DATA",
      basePrice: 8000.0,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
  }

  console.log("✅ Services created");
  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
