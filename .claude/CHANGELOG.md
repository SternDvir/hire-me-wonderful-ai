# Changelog

All notable changes to this project will be documented in this file.

Format: [YYYY-MM-DD] - Description

---

## [2025-12-02] - Infrastructure Documentation & Cleanup

### Added
- Created `.claude/` directory with AI agent context files
- `PROJECT.md` - Project overview and quick start
- `ARCHITECTURE.md` - System architecture and data flows
- `CURRENT_STATE.md` - Implementation status tracking
- `PROMPTS.md` - AI evaluation prompt documentation
- `CONVENTIONS.md` - Code style and patterns
- `CHANGELOG.md` - This file
- `ROADMAP.md` - Future features and priorities

### Fixed
- Identified shell environment variable issue causing database auth failures
- Solution: `unset DATABASE_URL DIRECT_URL` before starting dev server

### Cleanup Completed
- Deleted VIM swap file: `lib/contexts/.ThemeContext.tsx.swp`
- Removed empty scaffolded directories:
  - `components/candidate/`
  - `components/layout/`
  - `components/results/`
  - `components/screening/`
  - `lib/utils/`
- Updated `.gitignore` with editor backup files (`*.swp`, `*.swo`, `*~`)
- Updated `.gitignore` with generated artifacts (`session_details*.json`)

### Noted for Future
- Two design system files exist but neither is imported (kept for design refresh):
  - `lib/design-system.ts` - Basic design tokens
  - `lib/wonderful-design-system.ts` - Brand-specific with gradient orbs

---

## [2025-12-02] - Database Fix

### Fixed
- Database connection authentication failure
- Root cause: Shell environment variables overriding `.env` file
- Old password `d0508713113D%40` in shell was being used instead of new password `NadavStern0502`

---

## [2025-12-01] - Security Cleanup

### Security
- Rotated all API keys after GitHub detected exposed credentials
- Removed `.env` from git tracking
- Created `.env.example` with placeholder values
- Rotated: OpenRouter API key, Tavily API key, Database password

### Fixed
- Removed `.npm-cache` from git tracking

---

## [2025-12-01] - Screening Philosophy Update

### Changed
- Moved from score-based to holistic evaluation
- Made AI/ML requirement flexible (strong engineers can learn)
- Added executive drift detection
- `handsOnCurrent` score now most important metric

### Added
- `docs/SCREENING_PHILOSOPHY.md` - Detailed evaluation philosophy

---

## [2025-12-01] - Core Features

### Added
- Company schema and country management
- Dummy candidate data for testing
- Results page with candidate filtering
- Candidate modal with detailed view

### Changed
- Updated evaluation prompts for better accuracy
- Improved language inference logic

---

## [2025-11-30] - Initial Setup

### Added
- Next.js 14 project with TypeScript
- Prisma 7 with PostgreSQL adapter
- Supabase database integration
- OpenRouter AI integration
- Tavily company enrichment
- Basic screening workflow
- Dashboard and upload pages

---

## Version History

| Version | Date | Milestone |
|---------|------|-----------|
| 0.1.0 | 2025-12-01 | MVP with core screening |
| 0.0.1 | 2025-11-30 | Initial setup |
