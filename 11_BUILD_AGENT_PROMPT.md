# Build agent execution prompt

You are the lead engineering agent for an independent B2B Auto-GTM product. Your task is to implement a working product following all documents in this ZIP. Do not implement a visual or code copy of Explee. Reconstruct the observed user outcomes with an original interface and safe, licensed backends

## Required work order

1. Read every file in this package, including the OpenAPI contract and evidence ledger
2. Inspect the target repository and its AGENTS.md, existing conventions, migrations and tests before making changes
3. Record discrepancies between existing code and this spec, and distinguish observed benchmark from proposed design
4. Create a slice-based implementation plan using `10_IMPLEMENTATION_PLAN.md`
5. Start with Bun, strict TypeScript, deterministic fixtures, migrations and TDD tests
6. Implement R0 to R4 as a working end-to-end preview, then R5 to R7 only when provider credentials and policy choices are configured
7. Use licensed data sources and sandbox integrations by default. Never call private Explee APIs
8. Verify each slice with Bun tests, Playwright browser tests, accessibility checks and a production build
9. Produce atomic commits, a detailed validation report and a list of unresolved product decisions

## Non-negotiable product behavior

- Accept a recognized company domain or a three-field manual business brief
- Resume previous runs without duplicate expensive jobs
- Show source-backed company facts and editable corrections
- Produce competitor options and structured ICP segments with positive/negative criteria
- Rank account candidates after strict geography/exclusion filtering
- Show people and verified-contact status separately from draft previews
- Stream real progress, including partial/error/cached states
- Generate a short factual, evidence-backed email draft with language rationale and editable subject/body
- Persist edits, support Arabic/RTL and English/LTR correctly
- Present exact billing mode, due-now amount, usage unit and authorization terms
- Never send without verified contact, explicit one-time authorization, healthy sender and remaining budget
- Once activated, let the agent conduct ordinary sending, follow-ups, reply classification and booking autonomously within policy
- Handle unsubscribe, bounces, billing retries, event replay and campaign pause safely
- Provide account, campaign, lead, inbox, calendar, analytics and billing views as capabilities are built

## Verification checklist

- All P0 and P1 scenarios in `08_QA_ACCEPTANCE.md` pass
- An anonymous Jedar-like synthetic reference flow succeeds from input to editable draft
- The synthetic reference returns zero verified contacts and therefore cannot send
- A sandbox test campaign can send once, receive an interested reply and book once
- Replayed webhooks never duplicate sends, bookings or debit events
- Non-SA leads cannot enter an SA-only campaign
- Arabic/English mixed direction is correct on desktop and 390px mobile
- Tenant isolation, SSRF defenses and secret redaction are tested
- Every claim in generated email has accepted source evidence
- UI clearly marks estimates, cached output, incomplete contact data and provider errors
- All billing text and plan calculations use one shared pricing contract

## Deliverables and communication

Return a working implementation, a list of actual tests and their outcomes, API/schema differences, screenshots or visual tests using synthetic data, decisions made, and precise remaining gaps. Never claim a live send, booked meeting, payment or model result without execution evidence

## Explicit exclusions

- No unauthorized third-party API use
- No copying of competitor source bundles, icons, copy, testimonials or layouts pixel for pixel
- No fabricated output metrics or simulated live-lead claims in production
- No unapproved payment, real campaign send or external customer contact during build and test
- No Docker or Colima requirement; use Bun-compatible local/testing services
