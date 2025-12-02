# Product Roadmap

> **Last Updated:** 2025-12-02

---

## Priority Levels

- **P0 (Critical):** Blocks usage, must fix immediately
- **P1 (High):** Important for daily use
- **P2 (Medium):** Nice to have, improves experience
- **P3 (Low):** Future enhancement

---

## Immediate Tasks (This Week)

### P0 - Cleanup
- [ ] Delete `lib/contexts/.ThemeContext.tsx.swp`
- [ ] Consolidate or clarify design system files
- [ ] Update `.gitignore` with `*.swp`, `session_details*.json`
- [ ] Remove or document empty directories

### P1 - Stability
- [ ] Add basic error boundary components
- [ ] Add loading states for all async operations
- [ ] Ensure shell env var issue is documented prominently

---

## Short-Term (Next 2 Weeks)

### P1 - Testing
- [ ] Set up Jest/Vitest configuration
- [ ] Write tests for `lib/ai/agents/final-decision.ts`
- [ ] Write tests for `lib/ai/agents/language-checker.ts`
- [ ] Add API route integration tests
- [ ] Test Zod schema validations

### P1 - UI Polish
- [ ] Implement unified design system
- [ ] Add consistent color scheme
- [ ] Improve mobile responsiveness
- [ ] Add dark mode support

### P2 - Features
- [ ] Export results to CSV
- [ ] Export results to Excel
- [ ] Manual PASS/REJECT override functionality
- [ ] Add notes to candidates

---

## Medium-Term (Next Month)

### P1 - Analytics
- [ ] Dashboard with screening statistics
- [ ] Cost tracking (API usage)
- [ ] Success rate metrics
- [ ] Time-to-screen metrics

### P2 - Batch Operations
- [ ] Select multiple candidates
- [ ] Bulk status change
- [ ] Bulk export

### P2 - Search & Filter
- [ ] Full-text search on candidates
- [ ] Filter by score range
- [ ] Filter by specific concerns/strengths
- [ ] Save filter presets

### P2 - Progress Monitoring
- [ ] Real-time progress during screening
- [ ] WebSocket or polling updates
- [ ] Estimated time remaining

---

## Long-Term (Future)

### P2 - Team Features
- [ ] User authentication
- [ ] Role-based access control
- [ ] Shared screening sessions
- [ ] Comments and collaboration

### P3 - AI Improvements
- [ ] A/B testing for prompts
- [ ] Confidence calibration tracking
- [ ] False positive/negative tracking
- [ ] Prompt version management

### P3 - Integrations
- [ ] Direct LinkedIn scraping (replace Apify)
- [ ] Calendar integration for scheduling
- [ ] ATS (Applicant Tracking System) export
- [ ] Slack notifications

### P3 - Advanced Analytics
- [ ] ML-based candidate scoring improvement
- [ ] Pattern recognition across successful hires
- [ ] Geographic insights
- [ ] Industry trend analysis

---

## Feature Requests Backlog

Add new feature requests here with date and requester:

| Date | Feature | Requester | Priority | Status |
|------|---------|-----------|----------|--------|
| 2025-12-02 | Design system refresh | Dvir | P1 | Planned |
| - | - | - | - | - |

---

## Technical Debt

### High Priority
- [ ] Add TypeScript strict mode
- [ ] Add comprehensive error handling
- [ ] Document all API endpoints

### Medium Priority
- [ ] Optimize Prisma queries
- [ ] Add database query caching
- [ ] Implement proper logging

### Low Priority
- [ ] Add performance monitoring
- [ ] Set up CI/CD pipeline
- [ ] Add code coverage reporting

---

## Design System Roadmap

### Phase 1: Foundation
- [ ] Define color palette
- [ ] Define typography scale
- [ ] Define spacing system
- [ ] Create base components (Button, Card, Badge, Input)

### Phase 2: Components
- [ ] Form components (Input, Select, Checkbox)
- [ ] Feedback components (Toast, Alert, Modal)
- [ ] Navigation components (Tabs, Breadcrumb)
- [ ] Data display (Table, List, Stats)

### Phase 3: Polish
- [ ] Animation system
- [ ] Dark mode
- [ ] Accessibility audit
- [ ] Component documentation

---

## Notes

### Decision Log
Document key architectural decisions here:

1. **2025-12-01:** Chose holistic evaluation over score-based
   - Reason: Too many false positives with arithmetic averaging

2. **2025-12-01:** Made AI requirement flexible
   - Reason: Missing good candidates who could learn AI quickly

3. **2025-11-30:** Chose OpenRouter over direct Claude API
   - Reason: Easier billing, fallback options

### Deferred Features
Features considered but intentionally deferred:

1. **Vercel WDK Workflows** - Too complex for current scale
2. **Multi-agent evaluation** - Single agent sufficient for now
3. **shadcn/ui** - Custom components working well
