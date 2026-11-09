# 09 | Evidence ledger

Evidence is derived from a browser interaction session on 2026-11-09. IDs below are **report-local references** for auditability, not REA-server evidence IDs. REA's local CLI could not start in this environment because its runner reported `env: node: No such file or directory`, so the actual investigation used browser UI, DOM inspection and recorded network request/response views

## Source coverage

| ID | Type | Source | Supports | Confidence |
|---|---|---|---|---|
| E-001 | UI | `https://explee.com/` landing snapshot | Hero, input, CTA, proof and pricing layout | Observed |
| E-002 | Network | #345 `GET /api/companies/search?q=jedar-agency.com`, 200 | Company suggestion fields | Observed |
| E-003 | Navigation | Selected Jedar suggestion | `/auto-gtm/company/jedar-agency.com/explore` route | Observed |
| E-004 | Network | #375 `GET /api/project/jedar-agency.com`, 200 | Company, competitors, segments, metadata, phase history | Observed |
| E-005 | UI | Research company phase | Jedar card, year, employee estimate, keywords | Observed |
| E-006 | UI | Competitor panel | 12 count, 8 visible external cards | Observed |
| E-007 | UI | Campaign detail click on first card | Use case, pain, criteria, examples | Observed |
| E-008 | Network | #432 `POST /api/agent/ensure/52a1wj`, 200 | Existing run `status: done`, `created: false` | Observed |
| E-009 | Network | #433 `_companies.parquet?limit=100`, 200 | Seven company rows, columns and values | Observed |
| E-010 | Network | #434 `_people.parquet?limit=100`, 200 | Two decision-maker rows | Observed |
| E-011 | Network | #435 agent `/stream`, eventsource 200 | Streaming connection exists, no body retained in our inspection | Observed limited |
| E-012 | UI | Six-phase stepper states through final | Progressive status and transitions | Observed |
| E-013 | Network | #708 `/api/draft/generate`, POST 200 | Recipient input, subject, body, English language decision | Observed |
| E-014 | UI | Final Emails tab | Editable subject/body, enrichment vendor names, no email found | Observed |
| E-015 | UI | Draft settings gear | Locked Tone and Calendar link controls | Observed |
| E-016 | UI | Final Companies and People tabs | Tables, column labels, links | Observed |
| E-017 | UI | Start outreach payment handoff | Two payment modes, card input, consent | Observed |
| E-018 | UI | Pay-as-you-go option selection | $0 upfront messaging and Add card and start | Observed |
| E-019 | Network | #743, #1032 `/api/payment/create-elements-checkout` | Stripe checkout preparation | Observed metadata only; payment secrets excluded |
| E-020 | UI | Home FAQ eight accordions | Billing, pricing, email senders, data sources, languages, results descriptions | Disclosed |
| E-021 | UI | `I don't have a website` modal | Three-field alternate intake | Observed |
| E-022 | UI | Mobile viewport 390x844 | Stacked hero, menu, accordion preview, fixed CTA | Observed |
| E-023 | UI | `auth.explee.com` sign in and register | Work email, LinkedIn, Logto branding | Observed |
| E-024 | DOM | `_next/static/chunks` references | Next.js and Turbopack build output | Observed |
| E-025 | Network/DOM | Stripe, Sentry, Plausible, GTM, Meta, TikTok, Bing, Reddit, LinkedIn, OpenAI pixel | Client-side third-party integrations | Observed |
| E-026 | JS inspection | 44 publicly loaded Next chunks searched | No named LLM surfaced; OpenAI hits were tracking pixel and domain lists | Observed negative within scope |
| E-027 | Site | `https://jedar-agency.com/` later loaded after initial 403 | Arabic RTL site, crisis management, digital monitoring services | Observed |
| E-028 | Console | Multiple report-only Google Pay frame CSP errors and favicon 404 | Third-party console noise | Observed |

## Request-shape notes

- Search response: array of `{name, domain, desc, explee_id}`
- Project response: `company`, `determinants`, `competitors`, `search_queries`, `segments`, `segment_runs`, `domains`, `pipeline_log`
- Segment object: `label`, `icon`, `use_case`, `pain`, `criteria`, `negative_criterias`, `keywords`, `example_clients`, `percentage`, `estimated_companies`, `buyer_type`, `id`, `decision_maker`, `target_geo`
- Agent ensure response: `run_id`, `status`, `created`
- File response: `columns`, `rows`, `total_rows`, `offset`, `limit`, with `.parquet` in request path but JSON returned to the browser
- Draft response: `draft_id`, `cached`, `subject`, `body`, `highlights`, `language_used`, `language_reason`

## Technical deductions and explicit unknowns

| Claim | Status | Basis / limit |
|---|---|---|
| Site uses Next.js/Turbopack on the public frontend | Observed | `_next/static/chunks` and `turbopack-*` asset naming |
| Auth uses Logto | Observed | Login page attribution and `auth.explee.com` |
| Checkout uses Stripe Elements | Observed | Stripe iframe and checkout network preparation |
| Some work streams over SSE | Observed | `text/event-stream` endpoint |
| Pipeline results persist across visits | Strong inference | Existing project and `created:false` on ensure |
| Company discovery depends on a large proprietary dataset | Disclosed | FAQ and search API behavior, underlying acquisition not tested |
| Email waterfall tries Hunter, Exreacher, Findymail, LeadMagic | UI labels observed | Does not prove all provider API calls executed in this run |
| Backend uses GPT, Claude, Gemini or a specific model | Unknown | None identified in response or public JS |
| OpenAI tracking script proves use of OpenAI LLM | Unsupported | Script is a marketing measurement pixel |
| 97% inbox placement, $9 median cost, free leads in 24h | Unverified claim | Marketing copy and testimonials only |
| Sender mailboxes are pre-warmed with SPF/DKIM/DMARC | Disclosed | FAQ says so, no DNS or inbox tests performed |
| Follow-ups and booking execute automatically after payment | Disclosed | Post-preview steps only, no authenticated test |

## Excluded material

- Opaque run/device identifiers, session state, cookies, tokens, Stripe secrets and payment responses
- Public-site JavaScript code and third-party visual assets
- Full customer testimonials and long exact sales messages
- Any personalized data beyond the public professional records needed to explain the demonstrated UI

## Coverage gaps to close in a later authorized session

1. Registered dashboard, campaign creation and editing after billing
2. Daily budget configuration, sender pools, throttle, consent and unsubscribe paths
3. Live email sending, bounced/replied state transitions and inbox classification
4. Meeting-link handoff and calendar events
5. Analytics over time, iteration loops and lead-scoring calibration
6. Pricing/credit ledger, invoices, retries, refunds and cancellation
7. Model/provider metadata from an authorized backend trace or vendor disclosure
