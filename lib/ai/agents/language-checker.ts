import { LinkedInProfile, Language } from "@/lib/schemas/linkedin";
import { LanguageCheck } from "@/lib/schemas/evaluation";

// Helper to normalize language names
// Handles multiple language names (English, Anglais, etc.)
function normalizeLang(name: string): string {
  const normalized = name.toLowerCase().trim();

  // Map common language name variations to standard names
  // Covers Western Europe, Eastern Europe, Asia, Middle East
  const languageMap: Record<string, string> = {
    // English variations
    'anglais': 'english',
    'inglés': 'english',
    'inglese': 'english',

    // Western European languages
    'français': 'french',
    'francais': 'french',
    'español': 'spanish',
    'espanol': 'spanish',
    'castellano': 'spanish',
    'deutsch': 'german',
    'italiano': 'italian',
    'português': 'portuguese',
    'portugues': 'portuguese',
    'nederlands': 'dutch',
    'vlaams': 'dutch', // Flemish

    // Nordic languages
    'svenska': 'swedish',
    'norsk': 'norwegian',
    'dansk': 'danish',
    'suomi': 'finnish',
    'íslenska': 'icelandic',

    // Eastern European languages
    'ελληνικά': 'greek',
    'ellinika': 'greek',
    'česky': 'czech',
    'cesky': 'czech',
    'čeština': 'czech',
    'cestina': 'czech',
    'polski': 'polish',
    'magyar': 'hungarian',
    'română': 'romanian',
    'romana': 'romanian',
    'български': 'bulgarian',
    'български език': 'bulgarian',
    'українська': 'ukrainian',
    'русский': 'russian',
    'русский язык': 'russian',
    'russkiy': 'russian',
    'srpski': 'serbian',
    'hrvatski': 'croatian',
    'slovenščina': 'slovenian',
    'slovenčina': 'slovak',

    // Asian languages - East Asia
    '中文': 'chinese',
    'zhongwen': 'chinese',
    'mandarin': 'chinese',
    'cantonese': 'chinese',
    '普通话': 'chinese',
    '廣東話': 'chinese',
    '日本語': 'japanese',
    'nihongo': 'japanese',
    '한국어': 'korean',
    'hangugeo': 'korean',

    // Asian languages - Southeast Asia
    'tiếng việt': 'vietnamese',
    'bahasa indonesia': 'indonesian',
    'bahasa melayu': 'malay',
    'ภาษาไทย': 'thai',
    'phasa thai': 'thai',
    'tagalog': 'tagalog',
    'filipino': 'tagalog',
    'မြန်မာဘာသာ': 'burmese',

    // Asian languages - South Asia
    'हिन्दी': 'hindi',
    'हिंदी': 'hindi',
    'বাংলা': 'bengali',
    'اردو': 'urdu',
    'தமிழ்': 'tamil',
    'తెలుగు': 'telugu',
    'ગુજરાતી': 'gujarati',
    'ಕನ್ನಡ': 'kannada',
    'മലയാളം': 'malayalam',
    'मराठी': 'marathi',
    'ਪੰਜਾਬੀ': 'punjabi',

    // Middle Eastern languages
    'العربية': 'arabic',
    'عربي': 'arabic',
    'عربی': 'arabic',
    'עברית': 'hebrew',
    'ivrit': 'hebrew',
    'فارسی': 'persian',
    'farsi': 'persian',
    'türkçe': 'turkish',
    'turkce': 'turkish',

    // Other important languages
    'swahili': 'swahili',
    'kiswahili': 'swahili',
    'afrikaans': 'afrikaans',
  };

  return languageMap[normalized] || normalized;
}

// Helper to check proficiency level
function isProfessional(proficiency?: string | null): boolean {
  if (!proficiency) return false;
  const p = proficiency.toLowerCase();
  return (
    p.includes("professional") ||
    p.includes("native") ||
    p.includes("bilingual") ||
    p.includes("fluent")
  );
}

// Map countries to native languages
const COUNTRY_LANGUAGE_MAP: Record<string, string | string[]> = {
  // Western Europe
  'France': 'French',
  'Germany': 'German',
  'Italy': 'Italian',
  'Spain': 'Spanish',
  'Portugal': 'Portuguese',
  'Netherlands': 'Dutch',
  'Belgium': ['Dutch', 'French', 'German'],
  'Switzerland': ['German', 'French', 'Italian'],
  'Austria': 'German',
  'Luxembourg': ['Luxembourgish', 'French', 'German'],
  'Ireland': 'English',
  'United Kingdom': 'English',
  'UK': 'English',

  // Nordic Countries
  'Sweden': 'Swedish',
  'Norway': 'Norwegian',
  'Denmark': 'Danish',
  'Finland': 'Finnish',
  'Iceland': 'Icelandic',

  // Eastern Europe
  'Poland': 'Polish',
  'Czechia': 'Czech',
  'Czech Republic': 'Czech',
  'Slovakia': 'Slovak',
  'Hungary': 'Hungarian',
  'Romania': 'Romanian',
  'Bulgaria': 'Bulgarian',
  'Greece': 'Greek',
  'Croatia': 'Croatian',
  'Serbia': 'Serbian',
  'Slovenia': 'Slovenian',
  'Estonia': 'Estonian',
  'Latvia': 'Latvian',
  'Lithuania': 'Lithuanian',
  'Ukraine': 'Ukrainian',
  'Russia': 'Russian',
  'Belarus': 'Belarusian',

  // Americas
  'United States': 'English',
  'USA': 'English',
  'Canada': ['English', 'French'],
  'Mexico': 'Spanish',
  'Brazil': 'Portuguese',
  'Argentina': 'Spanish',
  'Chile': 'Spanish',
  'Colombia': 'Spanish',
  'Peru': 'Spanish',
  'Venezuela': 'Spanish',

  // Middle East
  'Israel': 'Hebrew',
  'Turkey': 'Turkish',
  'Saudi Arabia': 'Arabic',
  'United Arab Emirates': 'Arabic',
  'UAE': 'Arabic',
  'Jordan': 'Arabic',
  'Lebanon': 'Arabic',
  'Iran': 'Persian',
  'Iraq': 'Arabic',
  'Kuwait': 'Arabic',
  'Qatar': 'Arabic',
  'Bahrain': 'Arabic',
  'Oman': 'Arabic',

  // Asia - East
  'China': 'Chinese',
  'Japan': 'Japanese',
  'South Korea': 'Korean',
  'Korea': 'Korean',
  'Taiwan': 'Chinese',
  'Hong Kong': 'Chinese',
  'Mongolia': 'Mongolian',

  // Asia - Southeast
  'Singapore': ['English', 'Chinese', 'Malay'],
  'Malaysia': 'Malay',
  'Indonesia': 'Indonesian',
  'Thailand': 'Thai',
  'Vietnam': 'Vietnamese',
  'Philippines': 'Tagalog',
  'Myanmar': 'Burmese',
  'Cambodia': 'Khmer',
  'Laos': 'Lao',

  // Asia - South
  'India': 'Hindi',
  'Pakistan': 'Urdu',
  'Bangladesh': 'Bengali',
  'Sri Lanka': 'Sinhala',
  'Nepal': 'Nepali',

  // Oceania
  'Australia': 'English',
  'New Zealand': 'English',

  // Africa
  'South Africa': 'English',
  'Nigeria': 'English',
  'Kenya': 'Swahili',
  'Egypt': 'Arabic',
  'Morocco': 'Arabic',
  'Algeria': 'Arabic',
  'Tunisia': 'Arabic',
};

export function checkLanguages(profile: LinkedInProfile, targetCountry?: string): LanguageCheck {
  const country = targetCountry || profile.addressCountryOnly || "Unknown";
  const requiredNative = COUNTRY_LANGUAGE_MAP[country];
  
  const languages = profile.languages || [];
  
  // 1. Check English
  let hasEnglish = false;
  let englishLevel = "Unknown";
  let englishInferred = false;

  const englishEntry = languages.find(l => normalizeLang(l.name) === "english");

  if (englishEntry) {
    if (isProfessional(englishEntry.proficiency)) {
      hasEnglish = true;
      englishLevel = englishEntry.proficiency || "Professional";
    } else if (!englishEntry.proficiency) {
      // English listed but no proficiency - infer it
      hasEnglish = true;
      englishLevel = "Inferred Professional (listed without level)";
      englishInferred = true;
    }
  } else {
    // No English listed - try to infer from various signals

    // Check education in English speaking countries
    const englishCountries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Ireland', 'New Zealand'];
    const hasEnglishEducation = profile.educations?.some(edu =>
      edu.schoolName && englishCountries.some(c => edu.schoolName?.includes(c) || false)
    );

    // Check international companies
    const internationalCompanies = ['Microsoft', 'Google', 'Amazon', 'Meta', 'Apple', 'IBM', 'Oracle', 'SAP', 'Cisco', 'Intel', 'Facebook', 'Netflix', 'Uber', 'Airbnb'];
    const hasIntlWork = (profile.experiences || []).some(exp =>
      exp.companyName && internationalCompanies.some(c => (exp.companyName || '').toLowerCase().includes(c.toLowerCase()))
    );

    // Check if profile text (headline, about) is in English
    const textSample = `${profile.headline || ''} ${profile.about || ''}`.toLowerCase();
    const hasEnglishText = textSample.length > 50 &&
      (textSample.includes('engineer') || textSample.includes('developer') ||
       textSample.includes('manager') || textSample.includes('director') ||
       textSample.includes('experience') || textSample.includes('team'));

    if (hasEnglishEducation || hasIntlWork || hasEnglishText) {
      hasEnglish = true;
      englishLevel = "Inferred Professional (from profile context)";
      englishInferred = true;
    } else if (profile.jobTitle || profile.headline || (profile.experiences || []).length > 0) {
      // If candidate has a professional profile but no explicit English signals,
      // assume basic English proficiency (common in tech) and note it
      hasEnglish = true;
      englishLevel = "Assumed (insufficient data, requires verification)";
      englishInferred = true;
    }
  }

  // 2. Check Native Language
  let hasNative = false;
  let nativeLangName = Array.isArray(requiredNative) ? requiredNative.join("/") : requiredNative || "None";
  let nativeInferred = false;

  if (!requiredNative) {
    // If we don't know the native language for the country, we can't enforce it.
    hasNative = true;
    nativeLangName = "Unknown (Skipped)";
  } else {
    const requiredList = Array.isArray(requiredNative) ? requiredNative : [requiredNative];

    const nativeEntry = languages.find(l =>
      requiredList.some(req => normalizeLang(l.name) === normalizeLang(req))
    );

    if (nativeEntry) {
      if (isProfessional(nativeEntry.proficiency)) {
        hasNative = true;
      } else if (!nativeEntry.proficiency) {
        // Native language listed but no proficiency
        // If they live in the country, assume they speak it
        hasNative = true;
        nativeInferred = true;
      }
    } else {
      // Native language not listed at all - infer from location
      // If candidate lives in the country, they likely speak the native language
      if (profile.addressCountryOnly === country) {
        // They live in the country - assume they speak the language
        hasNative = true;
        nativeInferred = true;
      } else if (profile.addressWithCountry?.includes(country)) {
        // Double-check with full address
        hasNative = true;
        nativeInferred = true;
      }
    }
  }

  const passed = hasEnglish && hasNative;

  // Calculate confidence based on inference
  let confidence = 100;
  const notes: string[] = [];

  if (englishInferred) {
    if (englishLevel.includes("Assumed")) {
      confidence -= 20;
      notes.push("English proficiency ASSUMED - insufficient data, requires verification");
    } else {
      confidence -= 10;
      notes.push("English proficiency inferred from profile context");
    }
  }

  if (nativeInferred) {
    confidence -= 10;
    notes.push(`${nativeLangName} proficiency inferred from location`);
  }

  // Build reasoning
  let reasoning = "";
  if (passed) {
    if (notes.length > 0) {
      reasoning = `Language requirements met (${notes.join("; ")})`;
    } else {
      reasoning = "Meets language requirements";
    }
  } else {
    const missing: string[] = [];
    if (!hasEnglish) missing.push("English");
    if (!hasNative) missing.push(nativeLangName);
    reasoning = `Unable to verify language requirements: ${missing.join(", ")}`;
  }

  return {
    hasEnglishProficiency: hasEnglish,
    englishLevel: englishLevel as any,
    hasNativeLanguageProficiency: hasNative,
    nativeLanguage: nativeLangName,
    currentCountry: country,
    reasoning,
    confidence
  };
}
