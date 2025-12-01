import { tavily } from "@tavily/core";
import { EnrichedCompany } from "@/lib/schemas/company";

// Initialize Tavily client
// Note: process.env.TAVILY_API_KEY is automatically used by the SDK if not passed, 
// but we can pass it explicitly if needed.
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export async function enrichCompany(companyName: string, website?: string): Promise<EnrichedCompany> {
  try {
    const query = `${companyName} company information funding tech stack reputation ${website || ""}`;
    
    const response = await tvly.search(query, {
      searchDepth: "basic",
      maxResults: 5,
      includeAnswer: true
    });
    
    // Parse the answer or results to structure the data
    // This is a simplified parsing. In a real agent, we might use an LLM to extract structured data from the search results.
    // For now, we will map what we can.
    
    const answer = response.answer || "";
    const results = response.results || [];
    
    // We'll use a basic heuristic or just return the raw text in description for the AI to process later?
    // The architecture says "Extract and return JSON".
    // Ideally we use an LLM here to parse the search results into the schema.
    // But to save tokens/latency, maybe we just pass the search context to the main evaluation?
    // The schema `EnrichedCompany` expects structured data.
    
    // Let's do a minimal extraction here.
    
    return {
      name: companyName,
      description: answer, // Tavily's AI answer is usually a good summary
      website: website || results[0]?.url,
      searchTimestamp: new Date().toISOString(),
      // Other fields would ideally be extracted by an LLM from the search results
      // For this implementation, we'll leave them undefined and let the main evaluator 
      // use the 'description' (which contains the Tavily answer) to infer context.
      // OR we could make a quick LLM call here. 
      // Given the architecture separates "Company Enrichment" as a step, let's assume 
      // we might want to add a small LLM call here later.
      // For now, we return what we have.
    };
    
  } catch (error) {
    console.error(`Error enriching company ${companyName}:`, error);
    return {
      name: companyName,
      description: "Failed to fetch company information",
      searchTimestamp: new Date().toISOString()
    };
  }
}
