import { ApifyOutputSchema } from "../lib/schemas/linkedin";
import fs from "fs";
import path from "path";

const jsonPath = path.join(process.cwd(), "docs/testscarpefrance.json");

try {
  const fileContent = fs.readFileSync(jsonPath, "utf-8");
  const jsonData = JSON.parse(fileContent);

  const result = ApifyOutputSchema.safeParse(jsonData);

  if (!result.success) {
    console.error("Validation Failed!");
    // Log the full error structure to see all issues
    console.error(JSON.stringify(result.error.format(), null, 2));
  } else {
    console.log("Validation Successful!");
  }
} catch (error) {
  console.error("Error reading or parsing file:", error);
}
