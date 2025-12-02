# Code Conventions & Patterns

> **Last Updated:** 2025-12-02

---

## TypeScript Conventions

### File Naming
- React components: `PascalCase.tsx` (e.g., `CandidateModal.tsx`)
- Utilities/modules: `kebab-case.ts` (e.g., `final-decision.ts`)
- Schemas: `lowercase.ts` (e.g., `linkedin.ts`, `evaluation.ts`)

### Imports
```typescript
// 1. External libraries
import { z } from "zod";
import OpenAI from "openai";

// 2. Internal modules with @ alias
import { prisma } from "@/lib/prisma";
import { LinkedInProfile } from "@/lib/schemas/linkedin";

// 3. Relative imports
import { formatDate } from "./utils";
```

### Type Exports
```typescript
// Prefer named exports for schemas
export const FinalDecisionSchema = z.object({...});
export type FinalDecision = z.infer<typeof FinalDecisionSchema>;
```

---

## React Patterns

### Component Structure
```typescript
// components/ComponentName.tsx

"use client"; // If using client-side features

import { useState } from "react";
import { ComponentProps } from "@/types";

interface ComponentNameProps {
  // Props definition
}

export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // Hooks first
  const [state, setState] = useState();

  // Handlers
  const handleClick = () => {...};

  // Render
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
}
```

### Tailwind Classes
- Use Tailwind utility classes directly
- Group related classes: `className="flex items-center gap-2"`
- For complex components, use template literals for readability:
```typescript
className={`
  flex items-center gap-2
  px-4 py-2 rounded-lg
  ${isActive ? 'bg-blue-500' : 'bg-gray-200'}
`}
```

---

## API Routes

### Route Handler Pattern
```typescript
// app/api/resource/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const data = await prisma.resource.findMany();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validate with Zod
    const validated = Schema.parse(body);
    const result = await prisma.resource.create({ data: validated });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create" },
      { status: 500 }
    );
  }
}
```

---

## Database Patterns

### Prisma Queries
```typescript
// Simple query
const sessions = await prisma.screeningSession.findMany({
  orderBy: { createdAt: "desc" },
  include: { country: true },
});

// Query with relations
const session = await prisma.screeningSession.findUnique({
  where: { id },
  include: {
    evaluations: {
      orderBy: { overallScore: "desc" },
    },
    country: true,
  },
});

// Update with increment
await prisma.screeningSession.update({
  where: { id },
  data: {
    candidatesProcessed: { increment: 1 },
    passedCandidates: decision === "PASS" ? { increment: 1 } : undefined,
    rejectedCandidates: decision === "REJECT" ? { increment: 1 } : undefined,
  },
});
```

### JSON Field Access
```typescript
// Prisma stores JSON - access after fetch
const evaluation = await prisma.candidateEvaluation.findUnique({...});
const finalDecision = evaluation.finalDecision as FinalDecision;
```

---

## Zod Schema Patterns

### Basic Schema
```typescript
export const ProfileSchema = z.object({
  fullName: z.string(),
  email: z.string().email().optional(),
  age: z.number().min(0).max(150),
});
```

### With Transforms
```typescript
export const DateSchema = z.string().transform((val) => new Date(val));
```

### Nested Objects
```typescript
export const EvaluationSchema = z.object({
  decision: z.enum(["PASS", "REJECT"]),
  scores: z.object({
    technical: z.number().min(0).max(100),
    leadership: z.number().min(0).max(100),
  }),
});
```

---

## AI Integration Patterns

### OpenRouter Client
```typescript
// lib/ai/agents/final-decision.ts

function getOpenAIClient() {
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "Hire Me Wonderful AI",
    },
  });
}

// Usage
const openai = getOpenAIClient();
const completion = await openai.chat.completions.create({
  model: "anthropic/claude-opus-4.5",
  messages: [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: JSON.stringify(inputData) }
  ],
});
```

### Parsing AI Responses
```typescript
// Handle potential markdown wrapping
let jsonContent = content;
const startMarker = "```json";
const startIndex = content.indexOf(startMarker);
if (startIndex !== -1) {
  const endIndex = content.indexOf("```", startIndex + startMarker.length);
  jsonContent = content.substring(startIndex + startMarker.length, endIndex).trim();
}

const parsed = JSON.parse(jsonContent);
const validated = Schema.parse(parsed);
```

---

## Error Handling

### Try-Catch Pattern
```typescript
try {
  // Operation
} catch (error) {
  console.error("Context:", error);
  if (error instanceof SpecificError) {
    // Handle specific error
  }
  throw error; // Or return fallback
}
```

### AI Agent Fallback
```typescript
// Return safe fallback on AI error
return {
  decision: "REJECT",
  reasoning: "AI Evaluation Failed",
  confidence: 0,
  overallScore: 0,
  // ... minimal valid response
};
```

---

## Directory Structure

```
lib/
├── ai/
│   └── agents/          # AI evaluation agents
│       ├── final-decision.ts
│       └── language-checker.ts
├── schemas/             # Zod schemas
│   ├── linkedin.ts
│   ├── evaluation.ts
│   ├── company.ts
│   └── session.ts
├── enrichment/          # External API integrations
│   └── tavily.ts
├── workflows/           # Business logic orchestration
│   └── screening.ts
└── prisma.ts            # Database client singleton

components/
├── ui/                  # Reusable UI primitives
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Badge.tsx
└── [Feature].tsx        # Feature-specific components

app/
├── api/                 # API routes
│   └── [resource]/
│       └── route.ts
├── [page]/              # Page routes
│   └── page.tsx
└── layout.tsx           # Root layout
```

---

## Git Conventions

### Commit Messages
```
feat: add candidate export functionality
fix: resolve database connection timeout
refactor: simplify evaluation logic
docs: update API documentation
chore: update dependencies
```

### Branch Names
```
feature/export-csv
fix/auth-timeout
refactor/evaluation-flow
```

---

## Environment Variables

### Naming
- All caps with underscores: `DATABASE_URL`
- Prefix with `NEXT_PUBLIC_` for client-side access

### Required Variables
```bash
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
OPENROUTER_API_KEY=sk-or-v1-...
TAVILY_API_KEY=tvly-...
```

---

## Things to Avoid

1. **Don't hardcode API keys** - Always use environment variables
2. **Don't skip Zod validation** - Validate all external input
3. **Don't ignore TypeScript errors** - Fix them properly
4. **Don't mix styling approaches** - Stick to Tailwind
5. **Don't create files without purpose** - Delete empty scaffolding
6. **Don't leave debug logs** - Clean up console.log statements
