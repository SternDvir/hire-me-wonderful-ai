/**
 * Country detection utility for parsing location strings from LinkedIn profiles.
 * Extracts and normalizes country names from various location formats.
 */

// Common country name variations and their normalized forms
const COUNTRY_ALIASES: Record<string, string> = {
  // United States variations
  "usa": "United States",
  "u.s.": "United States",
  "u.s.a.": "United States",
  "us": "United States",
  "united states of america": "United States",
  "america": "United States",

  // United Kingdom variations
  "uk": "United Kingdom",
  "u.k.": "United Kingdom",
  "great britain": "United Kingdom",
  "britain": "United Kingdom",
  "england": "United Kingdom",
  "scotland": "United Kingdom",
  "wales": "United Kingdom",
  "northern ireland": "United Kingdom",

  // Netherlands variations
  "holland": "Netherlands",
  "the netherlands": "Netherlands",

  // Czech Republic variations
  "czechia": "Czech Republic",
  "czech": "Czech Republic",

  // UAE variations
  "uae": "United Arab Emirates",
  "u.a.e.": "United Arab Emirates",
  "dubai": "United Arab Emirates",
  "abu dhabi": "United Arab Emirates",

  // Other common variations
  "deutschland": "Germany",
  "espana": "Spain",
  "españa": "Spain",
  "italia": "Italy",
  "brasil": "Brazil",
  "russian federation": "Russia",
  "south korea": "South Korea",
  "republic of korea": "South Korea",
  "hong kong sar": "Hong Kong",
  "taiwan, province of china": "Taiwan",
  "viet nam": "Vietnam",
};

// List of known countries for detection
const KNOWN_COUNTRIES: string[] = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia",
  "Australia", "Austria", "Azerbaijan", "Bahrain", "Bangladesh", "Belarus", "Belgium",
  "Bolivia", "Bosnia and Herzegovina", "Brazil", "Brunei", "Bulgaria", "Cambodia",
  "Cameroon", "Canada", "Chile", "China", "Colombia", "Costa Rica", "Croatia",
  "Cuba", "Cyprus", "Czech Republic", "Denmark", "Dominican Republic", "Ecuador",
  "Egypt", "El Salvador", "Estonia", "Ethiopia", "Finland", "France", "Georgia",
  "Germany", "Ghana", "Greece", "Guatemala", "Honduras", "Hong Kong", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Latvia",
  "Lebanon", "Libya", "Lithuania", "Luxembourg", "Macau", "Malaysia", "Malta",
  "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco",
  "Myanmar", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Nigeria", "Norway",
  "Oman", "Pakistan", "Palestine", "Panama", "Paraguay", "Peru", "Philippines",
  "Poland", "Portugal", "Puerto Rico", "Qatar", "Romania", "Russia", "Saudi Arabia",
  "Senegal", "Serbia", "Singapore", "Slovakia", "Slovenia", "South Africa",
  "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Thailand", "Tunisia", "Turkey", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Yemen", "Zimbabwe"
];

const KNOWN_COUNTRIES_SET = new Set(KNOWN_COUNTRIES);

/**
 * Normalize a country name using the alias mapping
 */
export function normalizeCountryName(country: string): string {
  const trimmed = country.trim();
  const lowercased = trimmed.toLowerCase();

  // Check aliases first
  if (COUNTRY_ALIASES[lowercased]) {
    return COUNTRY_ALIASES[lowercased];
  }

  // Check if it's a known country (case-insensitive match)
  for (let i = 0; i < KNOWN_COUNTRIES.length; i++) {
    const knownCountry = KNOWN_COUNTRIES[i];
    if (knownCountry.toLowerCase() === lowercased) {
      return knownCountry;
    }
  }

  // Return with proper title case if not found
  return trimmed
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Detect country from a location string.
 * Handles various formats like:
 * - "San Francisco, California, United States"
 * - "London, United Kingdom"
 * - "Berlin, Germany"
 * - "United States"
 *
 * @param location The location string to parse
 * @returns Normalized country name or null if not detected
 */
export function detectCountry(location: string | null | undefined): string | null {
  if (!location || typeof location !== 'string') {
    return null;
  }

  const trimmed = location.trim();
  if (!trimmed) {
    return null;
  }

  // Split by comma and check each part from the end (country is usually last)
  const parts = trimmed.split(',').map(p => p.trim()).filter(Boolean);

  // Check parts from the end (most likely country position)
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i];
    const lowercased = part.toLowerCase();

    // Check if it's an alias
    if (COUNTRY_ALIASES[lowercased]) {
      return COUNTRY_ALIASES[lowercased];
    }

    // Check if it's a known country
    for (let j = 0; j < KNOWN_COUNTRIES.length; j++) {
      const knownCountry = KNOWN_COUNTRIES[j];
      if (knownCountry.toLowerCase() === lowercased) {
        return knownCountry;
      }
    }
  }

  // If location is a single part, try to match it
  if (parts.length === 1) {
    const normalized = normalizeCountryName(parts[0]);
    if (KNOWN_COUNTRIES_SET.has(normalized)) {
      return normalized;
    }
  }

  return null;
}

/**
 * Extract country from LinkedIn profile data.
 * Tries multiple fields in order of reliability:
 * 1. addressCountryOnly (most reliable)
 * 2. location field
 * 3. jobLocation from current experience
 *
 * @param profile Profile data with location fields
 * @returns Normalized country name or null if not detected
 */
export function extractCountryFromProfile(profile: {
  addressCountryOnly?: string | null;
  location?: string | null;
  addressWithCountry?: string | null;
  jobLocation?: string | null;
}): string | null {
  // Try addressCountryOnly first (most reliable)
  let country = detectCountry(profile.addressCountryOnly);
  if (country) return country;

  // Try addressWithCountry
  country = detectCountry(profile.addressWithCountry);
  if (country) return country;

  // Try location field
  country = detectCountry(profile.location);
  if (country) return country;

  // Try jobLocation as fallback
  country = detectCountry(profile.jobLocation);
  if (country) return country;

  return null;
}
