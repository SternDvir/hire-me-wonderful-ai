import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Connecting to database...");
    await prisma.$connect();
    console.log("Connected successfully.");

    console.log("Checking for Country table...");
    const countries = await prisma.country.findMany();
    console.log(`Found ${countries.length} countries.`);
    console.log("Country table exists and is accessible.");
    
  } catch (error) {
    console.error("Error connecting to database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
