import { ApifyClient } from 'apify-client';
import { LinkedInProfile } from '@/lib/schemas/linkedin';

const ACTOR_ID = "2SyF0bVxmgGr8IVCZ"; // LinkedIn Profile Scraper

// Create Apify client lazily to ensure env vars are loaded
function getApifyClient() {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) {
    throw new Error("APIFY_API_TOKEN environment variable is not set");
  }
  return new ApifyClient({ token });
}

export interface ScrapeResult {
  success: boolean;
  profiles: LinkedInProfile[];
  failedUrls: string[];
  error?: string;
}

/**
 * Scrape LinkedIn profiles using Apify actor.
 * This is a blocking call that waits for the actor to complete.
 *
 * @param profileUrls Array of LinkedIn profile URLs to scrape
 * @returns Array of scraped LinkedIn profiles
 */
export async function scrapeLinkedInProfiles(profileUrls: string[]): Promise<ScrapeResult> {
  if (profileUrls.length === 0) {
    return { success: true, profiles: [], failedUrls: [] };
  }

  try {
    const client = getApifyClient();

    console.log(`Starting Apify scrape for ${profileUrls.length} profiles...`);

    // Run the Actor and wait for it to finish
    const run = await client.actor(ACTOR_ID).call({
      profileUrls: profileUrls
    });

    console.log(`Apify run completed with status: ${run.status}`);

    if (run.status !== 'SUCCEEDED') {
      throw new Error(`Apify run failed with status: ${run.status}`);
    }

    // Fetch results from the run's dataset
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    console.log(`Retrieved ${items.length} profiles from Apify`);

    // Cast items to LinkedInProfile type
    const profiles = items as unknown as LinkedInProfile[];

    // Find any URLs that didn't return results
    const returnedUrls = new Set(profiles.map(p => p.linkedinUrl?.toLowerCase()));
    const failedUrls = profileUrls.filter(url => !returnedUrls.has(url.toLowerCase()));

    return {
      success: true,
      profiles,
      failedUrls
    };

  } catch (error) {
    console.error("Apify scraping error:", error);
    return {
      success: false,
      profiles: [],
      failedUrls: profileUrls,
      error: error instanceof Error ? error.message : "Unknown error during scraping"
    };
  }
}

/**
 * Validate and normalize LinkedIn URLs
 * @param urls Raw URL input (may have duplicates or invalid URLs)
 * @returns Array of valid, normalized LinkedIn profile URLs
 */
export function validateLinkedInUrls(urls: string[]): { valid: string[]; invalid: string[] } {
  const valid: string[] = [];
  const invalid: string[] = [];
  const seen = new Set<string>();

  for (const rawUrl of urls) {
    const url = rawUrl.trim();
    if (!url) continue;

    // Normalize URL
    let normalizedUrl = url;

    // Add https:// if missing
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    // Convert http to https
    normalizedUrl = normalizedUrl.replace('http://', 'https://');

    // Ensure it's a LinkedIn URL
    if (!normalizedUrl.includes('linkedin.com/in/')) {
      invalid.push(url);
      continue;
    }

    // Extract and normalize the profile part
    const match = normalizedUrl.match(/linkedin\.com\/in\/([^/?#]+)/i);
    if (!match) {
      invalid.push(url);
      continue;
    }

    const profileId = match[1].toLowerCase();
    const canonicalUrl = `https://www.linkedin.com/in/${profileId}`;

    // Skip duplicates
    if (seen.has(profileId)) {
      continue;
    }
    seen.add(profileId);

    valid.push(canonicalUrl);
  }

  return { valid, invalid };
}
