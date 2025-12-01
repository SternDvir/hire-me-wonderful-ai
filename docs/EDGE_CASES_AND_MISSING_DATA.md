# Edge Cases & Missing Data Handling Guide

## 🎯 Overview

Real LinkedIn profiles are messy. This document covers how to handle incomplete data, missing fields, and edge cases that occur in 30-40% of profiles.

**Philosophy**: Be flexible but cautious. When data is missing, use inference and context rather than auto-reject, but lower confidence scores appropriately.

---

## 🗣️ Language Field Issues

### Problem 1: Languages Listed But No Proficiency Level

**Example**:
```json
{
  "languages": [
    { "name": "English" },
    { "name": "Greek" }
  ]
}
```

**Solution - Inference Heuristics**:

```typescript
function inferLanguageProficiency(
  language: Language,
  profile: LinkedInProfile
): string | null {
  // 1. Check if it's explicitly listed (even without proficiency)
  if (!language.proficiency || language.proficiency === 'Not specified') {
    
    // 2. Infer from location and work history
    const countryLanguageMap = {
      'Greece': 'Greek',
      'Czechia': 'Czech',
      'Czech Republic': 'Czech',
      // ... etc
    };
    
    const nativeLanguage = countryLanguageMap[profile.addressCountryOnly];
    
    // If candidate is IN the country and lists the native language
    // They likely speak it professionally
    if (language.name === nativeLanguage) {
      return 'INFERRED_NATIVE';
    }
    
    // 3. Check work history - years in country
    const yearsInCountry = calculateYearsInCountry(
      profile.experiences, 
      profile.addressCountryOnly
    );
    
    if (yearsInCountry >= 5 && language.name === nativeLanguage) {
      return 'INFERRED_PROFESSIONAL'; // 5+ years working there
    }
    
    // 4. Check about section for language mentions
    const aboutLower = profile.about?.toLowerCase() || '';
    if (aboutLower.includes(`fluent in ${language.name.toLowerCase()}`)) {
      return 'INFERRED_FLUENT';
    }
    
    // 5. For English - check education in English-speaking countries
    const englishCountries = ['United States', 'United Kingdom', 'Canada', 'Australia'];
    if (language.name === 'English') {
      const hasEnglishEducation = profile.educations?.some(edu => 
        englishCountries.includes(edu.location)
      );
      if (hasEnglishEducation) {
        return 'INFERRED_PROFESSIONAL';
      }
    }
  }
  
  return language.proficiency || null;
}
```

**Evaluation Logic**:
```typescript
// Language check with inference
const languageCheck = {
  hasEnglish: checkLanguage('English', profile),
  hasNativeLanguage: checkLanguage(requiredNativeLanguage, profile),
  confidence: 'high', // or 'inferred' or 'unknown'
  notes: []
};

// If INFERRED, pass but note it
if (languageCheck.confidence === 'inferred') {
  evaluation.confidence -= 5; // Small penalty
  evaluation.concerns.push('Language proficiency inferred from context');
}

// If UNKNOWN and cannot infer, flag for manual review
if (languageCheck.confidence === 'unknown') {
  evaluation.decision = 'MANUAL_REVIEW';
  evaluation.confidence -= 15; // Larger penalty
  evaluation.concerns.push('Cannot verify language requirements');
}
```

**Prompt Addition**:
```
LANGUAGE VERIFICATION (CRITICAL):

The candidate MUST have:
1. English at Professional level or higher
2. ${nativeLanguage} at Professional level or higher

If proficiency is not explicitly stated:
- INFER from location (lives/works in country for 5+ years)
- INFER from work history (companies in that country)
- INFER from education (studied in English-speaking country)
- CHECK about section for language mentions

If you cannot verify with reasonable confidence:
- Set decision to "MANUAL_REVIEW"
- Note "Language proficiency uncertain - needs verification"
- Reduce confidence by 15 points
```

---

### Problem 2: No Languages Listed At All

**Example**:
```json
{
  "languages": []
}
```

**Solution - Strong Inference**:

```typescript
function inferLanguagesWhenMissing(profile: LinkedInProfile): {
  likelyHasEnglish: boolean;
  likelyHasNative: boolean;
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
} {
  const signals = [];
  let englishConfidence = 0;
  let nativeConfidence = 0;
  
  // English inference signals
  
  // 1. Education in English-speaking country (STRONG signal)
  if (hasEducationInEnglishCountry(profile.educations)) {
    englishConfidence += 40;
    signals.push('Educated in English-speaking country');
  }
  
  // 2. Work at international companies (MEDIUM signal)
  const internationalCompanies = [
    'Microsoft', 'Google', 'Amazon', 'Meta', 'Apple',
    'IBM', 'Oracle', 'SAP', 'Cisco', 'Intel'
  ];
  if (profile.experiences.some(exp => 
    internationalCompanies.includes(exp.companyName)
  )) {
    englishConfidence += 30;
    signals.push('Worked at international companies');
  }
  
  // 3. Profile written in English (MEDIUM signal)
  if (isProfileInEnglish(profile.about, profile.headline)) {
    englishConfidence += 25;
    signals.push('Profile written in English');
  }
  
  // 4. Job descriptions in English (WEAK signal)
  if (profile.experiences.every(exp => 
    isEnglish(exp.jobDescription)
  )) {
    englishConfidence += 15;
    signals.push('All job descriptions in English');
  }
  
  // Native language inference signals
  
  // 1. Living/working in country for 5+ years (STRONG)
  const yearsInCountry = calculateYearsInCountry(profile.experiences);
  if (yearsInCountry >= 5) {
    nativeConfidence += 50;
    signals.push(`Worked in ${profile.addressCountryOnly} for ${yearsInCountry} years`);
  }
  
  // 2. Born/raised in country (from education)
  if (profile.educations.some(edu => 
    edu.location === profile.addressCountryOnly && 
    edu.degree?.includes('High School')
  )) {
    nativeConfidence += 40;
    signals.push('Attended school in country');
  }
  
  return {
    likelyHasEnglish: englishConfidence >= 50,
    likelyHasNative: nativeConfidence >= 50,
    confidence: (englishConfidence + nativeConfidence) / 2 >= 60 ? 'high' :
                (englishConfidence + nativeConfidence) / 2 >= 40 ? 'medium' : 'low',
    reasoning: signals.join('; ')
  };
}
```

**Decision Logic**:
- **High confidence inference** (70+): PASS but note "Languages inferred", reduce confidence by 10
- **Medium confidence inference** (40-69): MANUAL_REVIEW, reduce confidence by 20
- **Low confidence inference** (<40): REJECT unless other factors are exceptional

---

## 💼 Freelancers & Missing Company Data

### Problem: Freelancer with No Company Names

**Example**:
```json
{
  "experiences": [
    {
      "title": "Senior Full-Stack Developer",
      "companyName": null,
      "employmentType": "Freelance",
      "jobDescription": "Developed AI-powered chatbot for fintech client...",
      "jobStartedOn": "01-2020",
      "jobEndedOn": "12-2023"
    }
  ]
}
```

**Solution - Alternative Evaluation**:

```typescript
function evaluateFreelanceExperience(experience: Experience): {
  technicalDepth: number; // 0-100
  leadership: number; // 0-100
  aiRelevance: number; // 0-100
  clientQuality: number; // 0-100
} {
  const description = experience.jobDescription || '';
  
  // Extract signals from description
  return {
    technicalDepth: scoreKeywords(description, [
      'architecture', 'backend', 'infrastructure', 'microservices',
      'database', 'API', 'cloud', 'deployment', 'scaling'
    ]),
    
    leadership: scoreKeywords(description, [
      'led team', 'managed', 'mentored', 'built team',
      'hired', 'coordinated', 'stakeholder', 'client-facing'
    ]),
    
    aiRelevance: scoreKeywords(description, [
      'AI', 'ML', 'machine learning', 'LLM', 'GPT', 'Claude',
      'NLP', 'deep learning', 'neural network', 'agent', 'prompt'
    ]),
    
    clientQuality: inferClientQuality(description)
  };
}

function inferClientQuality(description: string): number {
  const desc = description.toLowerCase();
  
  // High-quality signals
  if (desc.match(/enterprise|fortune 500|bank|financial|healthcare|government/)) {
    return 80;
  }
  
  // Medium-quality signals
  if (desc.match(/startup|series [abc]|funded|scaleup/)) {
    return 60;
  }
  
  // Generic
  return 40;
}
```

**Prompt Modification for Freelancers**:
```
FREELANCE/SELF-EMPLOYED EXPERIENCE:

When a candidate has freelance/consulting/self-employed roles:

✅ STRENGTHS to look for:
- Entrepreneurial mindset (matches Wonderful's Independence value)
- Client-facing experience (pre-sales, consulting)
- Diverse project portfolio
- Technical depth across multiple domains
- Self-management and ownership

⚠️ EVALUATE CAREFULLY:
- Team building experience (harder as freelancer)
- Leadership progression (look for team coordination, client projects)
- Technical depth (focus on project descriptions, technologies used)

💡 CONTEXT:
- Many top CTOs have freelance backgrounds
- Freelancing shows independence and self-motivation
- Focus on: project complexity, client quality, technologies, outcomes

EXAMPLE GOOD FREELANCER:
"Built AI-powered CRM for 3 enterprise clients (banking, healthcare).
Led integration teams, architected microservices infrastructure,
mentored junior developers on projects."
→ This shows: technical depth, leadership, client-facing, AI

EXAMPLE WEAK FREELANCER:
"Website development for various clients."
→ Too vague, no depth, frontend-only implication
```

**Evaluation Adjustment**:
```typescript
// For freelancers, skip company enrichment
if (isFreelancer(experience)) {
  // Don't penalize for missing company data
  // Focus evaluation on:
  // 1. Technical keywords in descriptions
  // 2. Duration and continuity
  // 3. Project complexity indicators
  // 4. Client mentions (if any)
  
  evaluation.notes.push('Freelancer - evaluated based on project descriptions');
  
  // Small bonus for entrepreneurial background
  if (hasMultipleFreelanceRoles && totalYears >= 7) {
    evaluation.strengths.push('Entrepreneurial background with deep technical work');
  }
}
```

---

## 🏢 Companies with No Public Information

### Problem: Working at Unknown Companies (Especially Asian Companies)

**Example**:
```json
{
  "companyName": "Kakao Corp",  // Korean company
  "companyIndustry": "Internet",
  "companySize": "1001-5000"
}
```

**Solution - Graceful Degradation**:

```typescript
async function enrichCompanyWithFallback(
  companyName: string,
  profileData: Experience
): Promise<CompanyEnrichment> {
  
  try {
    // Try Tavily search
    const results = await tavily.search(
      `${companyName} company about business`,
      { max_results: 3 }
    );
    
    if (results.length > 0 && hasRelevantInfo(results)) {
      return parseCompanyData(results);
    }
    
  } catch (error) {
    // Tavily failed, continue to fallback
  }
  
  // FALLBACK 1: Use profile-provided data
  if (profileData.companyIndustry || profileData.companySize) {
    return {
      name: companyName,
      summary: `${profileData.companyIndustry || 'Technology'} company`,
      size: profileData.companySize || 'Unknown',
      stage: inferStageFromSize(profileData.companySize),
      reputation: 'unknown',
      dataSource: 'linkedin_profile',
      confidence: 'low'
    };
  }
  
  // FALLBACK 2: Minimal enrichment
  return {
    name: companyName,
    summary: 'Company information not available',
    size: 'Unknown',
    stage: 'unknown',
    reputation: 'unknown',
    dataSource: 'none',
    confidence: 'none',
    note: 'Company may be regional/local or have limited online presence'
  };
}
```

**Evaluation Adjustment for Unknown Companies**:

```typescript
function evaluateWithUnknownCompany(
  candidate: LinkedInProfile,
  companies: CompanyEnrichment[]
): void {
  
  const unknownCompanies = companies.filter(c => 
    c.confidence === 'none' || c.dataSource === 'none'
  );
  
  if (unknownCompanies.length > 0) {
    // Don't penalize for working at unknown companies
    // Many legitimate companies (especially in Asia) have limited English web presence
    
    evaluation.notes.push(
      `${unknownCompanies.length} companies have limited public information - ` +
      'evaluated based on role and profile data'
    );
    
    // Rely MORE on:
    // 1. Job title and description
    // 2. Technologies mentioned
    // 3. Team size mentions
    // 4. Duration and continuity
    // 5. Candidate's own narrative
  }
}
```

**Prompt Modification**:
```
COMPANY CONTEXT:

${companies.map(c => c.confidence === 'high' ? 
  `- ${c.name}: ${c.summary}` : 
  `- ${c.name}: Limited public information available`
).join('\n')}

IMPORTANT: 
- Many excellent companies (especially Asian tech companies) have limited English information
- Do NOT penalize candidates for working at unknown companies
- Focus on: role, technologies, team size, achievements from their profile
- Companies like Kakao, Naver, Line, Grab may not be well-known but are major tech companies

If company info is limited:
✅ Rely on candidate's job description
✅ Check technologies and role seniority
✅ Look for team size mentions ("led 20-person team")
✅ Evaluate based on role progression and responsibilities
```

---

## 🔍 Combined Edge Case Handling Strategy

### Overall Approach

```typescript
interface DataQualityScore {
  languages: 'complete' | 'partial' | 'inferred' | 'missing';
  companies: 'complete' | 'partial' | 'missing';
  experience: 'complete' | 'partial' | 'vague';
  overallQuality: number; // 0-100
}

function assessDataQuality(profile: LinkedInProfile): DataQualityScore {
  // Calculate quality score
  let score = 100;
  const issues = [];
  
  // Language data
  let languageStatus: 'complete' | 'partial' | 'inferred' | 'missing';
  if (profile.languages?.length > 0 && 
      profile.languages.every(l => l.proficiency)) {
    languageStatus = 'complete';
  } else if (profile.languages?.length > 0) {
    languageStatus = 'partial';
    score -= 10;
    issues.push('Language proficiency levels missing');
  } else {
    languageStatus = 'inferred';
    score -= 20;
    issues.push('No language data - will infer from profile');
  }
  
  // Company data
  let companyStatus: 'complete' | 'partial' | 'missing';
  const hasCompanies = profile.experiences.some(e => e.companyName);
  if (hasCompanies) {
    companyStatus = 'complete';
  } else {
    companyStatus = 'missing';
    score -= 15;
    issues.push('Company information sparse');
  }
  
  // Experience descriptions
  let experienceStatus: 'complete' | 'partial' | 'vague';
  const avgDescLength = profile.experiences
    .map(e => (e.jobDescription || '').length)
    .reduce((a, b) => a + b, 0) / profile.experiences.length;
  
  if (avgDescLength > 200) {
    experienceStatus = 'complete';
  } else if (avgDescLength > 50) {
    experienceStatus = 'partial';
    score -= 10;
    issues.push('Job descriptions are brief');
  } else {
    experienceStatus = 'vague';
    score -= 25;
    issues.push('Job descriptions minimal or missing');
  }
  
  return {
    languages: languageStatus,
    companies: companyStatus,
    experience: experienceStatus,
    overallQuality: score,
    issues
  };
}
```

### Decision Matrix

| Data Quality | Language | Company | Experience | Action | Confidence Adjustment |
|--------------|----------|---------|------------|--------|----------------------|
| High (80+) | Complete | Complete | Complete | Evaluate normally | No change |
| Good (60-79) | Partial/Inferred | Partial | Partial | Evaluate with notes | -10 points |
| Fair (40-59) | Inferred | Missing | Vague | Evaluate carefully | -20 points |
| Poor (<40) | Missing | Missing | Vague | Manual review | -30 points or MANUAL_REVIEW |

### Confidence Score Adjustments

```typescript
function adjustConfidenceForDataQuality(
  baseConfidence: number,
  dataQuality: DataQualityScore
): number {
  let adjusted = baseConfidence;
  
  // Apply penalties
  if (dataQuality.languages === 'inferred') {
    adjusted -= 10;
  } else if (dataQuality.languages === 'missing') {
    adjusted -= 20;
  }
  
  if (dataQuality.companies === 'missing') {
    adjusted -= 5; // Small penalty, not their fault
  }
  
  if (dataQuality.experience === 'partial') {
    adjusted -= 10;
  } else if (dataQuality.experience === 'vague') {
    adjusted -= 20;
  }
  
  return Math.max(0, adjusted);
}
```

---

## 📊 Examples of Edge Cases Handled

### Example 1: Korean CTO with Minimal English Presence

**Profile**:
```json
{
  "fullName": "Kim Min-jae",
  "location": "Seoul, South Korea",
  "currentRole": "CTO",
  "currentCompany": "Naver Corp",  // Major Korean tech company
  "languages": [],  // No languages listed
  "experiences": [
    {
      "title": "CTO",
      "companyName": "Naver Corp",
      "description": "Leading 200+ engineering team..."
    }
  ]
}
```

**Handling**:
1. ✅ Infer Korean language (native, lives in Seoul, works at Korean company)
2. ✅ Infer English (CTO at major tech company, profile in English)
3. ⚠️ Naver might have limited search results → Use profile data
4. ✅ Evaluate based on role, team size, and description
5. 📊 Pass with confidence 75-80 (instead of 85-90 due to inferred data)

---

### Example 2: Freelancer with Strong Technical Background

**Profile**:
```json
{
  "fullName": "Maria Papadopoulos",
  "location": "Athens, Greece",
  "languages": [{"name": "Greek"}, {"name": "English"}],  // No proficiency
  "experiences": [
    {
      "title": "Senior AI/ML Consultant",
      "companyName": null,
      "employmentType": "Self-employed",
      "description": "Built AI-powered chatbots for 5 enterprise clients including Alpha Bank. Led integration teams, architected microservices..."
    }
  ]
}
```

**Handling**:
1. ✅ Infer Greek proficiency (lives in Athens, native)
2. ✅ Infer English proficiency (profile in English, enterprise clients)
3. ✅ Skip company enrichment (freelancer)
4. ✅ Evaluate based on: enterprise clients, AI work, team leadership, architecture
5. ✅ BONUS for entrepreneurial background
6. 📊 Pass with confidence 80-85

---

### Example 3: Candidate with Sparse Profile

**Profile**:
```json
{
  "fullName": "John Smith",
  "location": "Prague, Czechia",
  "languages": [],
  "experiences": [
    {
      "title": "Senior Developer",
      "companyName": "TechStartup s.r.o.",
      "description": "Software development"  // Very brief
    }
  ]
}
```

**Handling**:
1. ⚠️ Cannot infer Czech (no evidence)
2. ⚠️ Cannot infer English proficiency
3. ⚠️ Unknown company, no enrichment possible
4. ⚠️ Vague job description
5. 📊 MANUAL_REVIEW with confidence 30-40 or REJECT if no other strong signals

---

## 🎯 Summary: Edge Case Handling Rules

### DO:
✅ Infer languages from location, work history, education  
✅ Use profile-provided company data when enrichment fails  
✅ Evaluate freelancers based on project descriptions  
✅ Focus on role and achievements when company is unknown  
✅ Adjust confidence scores based on data quality  
✅ Flag for manual review when too much uncertainty  

### DON'T:
❌ Auto-reject for missing language proficiency if inferable  
❌ Penalize unknown companies (especially Asian companies)  
❌ Penalize freelancers for missing company names  
❌ Ignore context from other profile sections  
❌ Assume data quality issues mean bad candidate  

### KEY PRINCIPLE:
**"Be flexible with data, strict with criteria"**

Missing data should lower confidence but not automatically disqualify good candidates. The goal is finding great CTOs, not perfect LinkedIn profiles.

---

## 🔧 Implementation Checklist

- [ ] Implement language inference functions
- [ ] Add freelancer detection and evaluation logic
- [ ] Implement graceful company enrichment fallback
- [ ] Add data quality scoring
- [ ] Adjust confidence scores based on data completeness
- [ ] Update prompts with edge case handling
- [ ] Add "MANUAL_REVIEW" as decision option
- [ ] Test with real edge case profiles
- [ ] Document edge cases in user guide

---

## 📝 Prompt Template with Edge Cases

```
=== IMPORTANT: MISSING DATA HANDLING ===

This profile may have incomplete data. Apply these rules:

LANGUAGES (if missing or unspecified):
- Infer from location (works in country = likely speaks language)
- Infer from work history (5+ years in country = professional level)
- Infer from education (studied in English country = speaks English)
- If still uncertain: reduce confidence by 15 points, note "Language verification needed"

COMPANY INFORMATION (if unavailable):
- Many legitimate companies have limited web presence (especially in Asia)
- Focus on candidate's role description, technologies, team size
- Do NOT penalize for unknown companies
- Evaluate based on what candidate says about their role

FREELANCERS:
- Treat as BONUS for entrepreneurial mindset
- Focus on: client quality, project complexity, technical depth
- Look for team leadership in project descriptions
- Independence is a Wonderful value

DATA QUALITY CONFIDENCE ADJUSTMENTS:
- High quality data (detailed descriptions, verified): No adjustment
- Medium quality (some missing fields): -10 points
- Low quality (many missing fields): -20 points
- Very low quality (minimal profile): MANUAL_REVIEW

When uncertain: Be honest. Note what's missing and why confidence is lower.
```

---

This edge case handling ensures the system is robust for real-world messy data while maintaining evaluation quality.
