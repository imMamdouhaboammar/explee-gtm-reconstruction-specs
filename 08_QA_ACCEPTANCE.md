# 08 | QA, TDD and acceptance checklist

All P0 and P1 journeys require automated tests plus one manual browser pass before a release. Tests must use a synthetic company dataset and sandbox email/calendar/payment providers, never real customer campaigns in CI

## Test layers

| Layer | Scope | Tooling recommendation |
|---|---|---|
| Unit | URL normalization, filters, scoring, state machines, pricing arithmetic, suppression | Bun test |
| Contract | API request/response schemas and provider adapters | Bun test + JSON schema validators |
| Integration | DB transactions, queue retries, SSE resume, webhook dedupe | Ephemeral test database/services |
| E2E | Public preview, auth handoff, editor, payment stub, campaign control | Playwright |
| Accessibility | Keyboard, labels, modal focus, contrast, 320 to 1440 widths, RTL | axe + manual |
| AI eval | Grounded facts, language, reply routing, prompt injection, cost | Versioned evaluation fixtures |
| Deliverability | Sender DNS and status events, bounce/complaint processing | Provider sandbox/inbox test accounts |
| Security | SSRF, tenant isolation, CSRF, replay, webhook signature, PII exposure | Static/dynamic security tests |

## Functional acceptance matrix

| Test ID | Scenario | Expected result | Priority |
|---|---|---|---|
| T-001 | Enter bare recognized domain | Suggestion with name, domain, summary; canonical URL | P0 |
| T-002 | Enter URL with path/query | Correct hostname extraction, no path in identity | P0 |
| T-003 | Input localhost/private IP/javascript scheme | Rejected before any fetch, safe error | P0 |
| T-004 | Unrecognized domain | Manual analyze fallback, never dead end | P1 |
| T-005 | Ambiguous two-company match | User chooses explicitly; wrong entity never auto-selected | P0 |
| T-006 | Open no-website form | Three labeled inputs, focus and validation | P1 |
| T-007 | Submit manual brief | Project gets `input_kind=brief`, supports no domain | P1 |
| T-008 | Research backend unavailable | Partial manual brief and retry; no false success | P0 |
| T-009 | Project already exists | Same run reused with cached label, no duplicate cost | P0 |
| T-010 | SSE reconnect after refresh | Continue from last event and keep results | P0 |
| T-011 | Company fact contradicts user correction | User override wins within project and is versioned | P1 |
| T-012 | Generate six segments | Each has pain, criteria, exclusions, buyer, country | P0 |
| T-013 | Strict Saudi geography | Non-SA account excluded from send-eligible list | P0 |
| T-014 | Estimated counts overlap | No misleading summed TAM | P1 |
| T-015 | Zero matching companies | Useful no-results state with segment adjustments | P1 |
| T-016 | Missing domain or traffic | Empty cells marked, app does not crash | P1 |
| T-017 | Re-run same discovery | Idempotent run/row identities | P0 |
| T-018 | Sort companies by size | Deterministic order and accessible sort state | P2 |
| T-019 | Find role candidates | Company association and source present | P0 |
| T-020 | Stale job title | Employment uncertainty exposed | P1 |
| T-021 | All email vendors return no match | Draft remains preview-only, send blocked | P0 |
| T-022 | One verified contact | Address protected from public response, send becomes eligible after consent | P0 |
| T-023 | Unsupported contact/source use | Contact suppressed with reason | P0 |
| T-024 | Draft generation receives unverifiable claim | Claim removed or flagged, never passed as fact | P0 |
| T-025 | Arabic draft | Arabic text correct, RTL with LTR URL/email islands | P0 |
| T-026 | User edits subject/body | Persist across tabs and refresh, no silent overwrite | P1 |
| T-027 | Regenerate variant | Original draft preserved in history | P1 |
| T-028 | Open locked settings | Clear reason and activation path, no false affordance | P2 |
| T-029 | Select prepaid tier | Due-now amount, bonus credit and units update together | P0 |
| T-030 | Select pay-as-you-go | Due today zero, card requirement and later charge explained | P0 |
| T-031 | No consent checkbox | Activation and sending blocked | P0 |
| T-032 | Invalid payment | No campaign activation or charge duplication | P0 |
| T-033 | Billing webhook replay | Exactly one ledger entry | P0 |
| T-034 | Activate with valid consent, contact, budget and sender | Campaign active and first send scheduled once | P0 |
| T-035 | Daily spend reaches cap | No further billable sends; campaign paused | P0 |
| T-036 | Repeated send job retry | One provider email, no duplicate | P0 |
| T-037 | Bounce/complaint event | Contact/sender policy applied and future sends stopped as configured | P0 |
| T-038 | Unsubscribe reply | Suppression immediately applied across relevant active sequences | P0 |
| T-039 | Positive reply | Correct intent and booking flow, no unrequested follow-up sequence | P0 |
| T-040 | Calendar provider retries | One meeting, consistent booking status | P0 |
| T-041 | Prompt-injected web page | External text cannot change tools, budgets or send policy | P0 |
| T-042 | Cross-tenant object ID request | Forbidden, no record or count leakage | P0 |
| T-043 | 390px mobile landing | Form, CTA, menu, no unintentional horizontal overflow | P1 |
| T-044 | 390px mobile preview | Accordion navigable, fixed CTA not obscured | P1 |
| T-045 | Mobile checkout with keyboard | Field and submit remain reachable, focus visible | P1 |
| T-046 | Keyboard-only preview | Accessible phase order, tabs, modal and settings | P1 |
| T-047 | Reduced motion | No forced ticker or animated stage motion | P2 |
| T-048 | Model provider timeout | Retry/fallback respects cost cap and retains previous valid draft | P0 |
| T-049 | CSV with malicious formulas | Sanitized export and safe import preview | P1 |
| T-050 | Delete contact per policy | Restricted PII removed, lawful suppression state remains | P0 |

## Scenario suites

### S1. Jedar reference fixture

1. Create fixture for Saudi agency with crisis and reputation services
2. Resolve recognized company and show provenance for all facts
3. Generate six segments matching the business concept, but do not require identical words or counts to Explee
4. Run strict Saudi-only segment, demonstrate correct exclusion of non-SA companies
5. Return seven synthetic account candidates and two people in the broad unfiltered test
6. Set all contacts to `not_found`, then produce preview draft for one person
7. Assert `send_enabled=false` and `verified_email_count=0`
8. Switch Companies, People, Emails, edit draft, refresh, verify persistence
9. Open activation, switch billing modes, check amount and consent validation

### S2. Real sending in sandbox

1. Authorize test tenant and sandbox domain
2. Provision test mailbox, verified recipient, daily budget and template
3. Send once, simulate delivered reply, interested intent, booking confirmation
4. Replay every webhook twice
5. Assert one debit, one sent email, one booking, one conversation history
6. Simulate unsubscribe then prove all queued follow-ups are stopped

### S3. Failure and recovery

1. Interrupt discovery after partial results
2. Refresh preview twice, reconnect SSE, ensure no duplicated run
3. Make LLM return malformed JSON, retry with schema guard
4. Fail one enrichment provider, continue waterfall without hidden success
5. Pause sender due to excessive bounces, verify queue holds
6. Recover provider and resume safely without replaying sent messages

### S4. Localization

Run the same sample with Arabic company name, Saudi country, English recipients and Arabic recipients. Verify localized stage labels, directional isolation, campaign language control, Arabic punctuation and external profile URLs

## Quantitative release bars

The following are proposed **test targets**, not measured Explee numbers

- 100% passing P0 and P1 E2E cases in staging
- Zero send or billing duplicates in replay tests
- Zero tenant-boundary or SSRF bypass findings
- 100% suppression compliance in deterministic tests
- 100% of material generated claims grounded to accepted source facts in the evaluation fixture
- 100% schema-valid structured LLM outputs after bounded repair, otherwise explicit failure
- WCAG 2.2 AA checks passing in key public/auth screens, with manual exceptions documented
- Core Web Vitals targets set and measured after a real performance baseline
- p95 latency and operating cost budgets defined from a representative pilot workload, never fabricated before measurement

## Test data privacy

Do not use real prospect addresses or send live outbound emails in CI. Use reserved domains (`example.com`, `example.org`), synthetic identities and sandbox vendors. Keep any real-world public company names in benchmark documentation only

## TDD working agreement

1. Write a failing test for each functional acceptance criterion
2. Implement the minimum behavior that makes it pass
3. Refactor with the test suite green
4. Require contract tests for every API change
5. Verify visual states at desktop and mobile before merging
6. Keep one atomic commit per capability with tests and rationale
7. Run full Bun unit/integration suite, Playwright E2E, security checks and production build before release
