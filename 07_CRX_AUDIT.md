# 07 | UX, conversion and data quality audit

Severity means impact on user trust, conversion, sending correctness and business risk. Findings marked **Observed** occurred in this Jedar session. **Unverified** questions require authenticated testing before a defect is asserted

## Priority findings

| ID | Severity | Observation | Consequence | Recommended fix | Basis |
|---|---|---|---|---|---|
| CRX-01 | P0 | Two people showed `no email found` but a draft and send CTA were visible | User could infer delivery is possible without a valid recipient | Separate draft preview from send readiness; show `0 verified recipients` and block send until verified | Observed E-014 |
| CRX-02 | P0 | Segment geography was Saudi Arabia but results included AE, IN and GB | Bad fit, spend waste and lost trust | Enforce geo hard filter at search and send; mark exceptions explicitly | Observed E-009 |
| CRX-03 | P1 | $30 free-credit language contrasted with a paid top-up preselected at checkout | Billing confusion and abandonment | Display free and prepaid modes unambiguously with exact due today | Observed E-017, E-018 |
| CRX-04 | P1 | Company details could only be corrected after account creation | User may reject wrong profile before seeing value | Permit safe anonymous correction in preview with verification later | Observed E-005 |
| CRX-05 | P1 | Language choice was generated as English without a visible public control | Saudi/Arabic campaigns could be poorly localized | Surface language and reason, allow change before activation | Observed E-013 |
| CRX-06 | P1 | A company row had no domain and two people lacked geography | Uncertain data quality is visually underexplained | Field-level confidence, missing-data badge and coverage summary | Observed E-009, E-010 |
| CRX-07 | P1 | Preview reused a completed agent run, but visible progress looked like fresh ongoing work | Incorrect user expectation of live processing and timing | Label cached/reused results and timestamps | Observed E-008, E-012 |
| CRX-08 | P2 | CTA and metrics repeated in multiple contexts with slightly different claims | Cognitive load and possible inconsistency | Single copy source of truth for plans, credits and outputs | Observed E-001, E-020 |
| CRX-09 | P2 | Public draft settings popover had two locked controls | Discoverability without utility | Explain activation dependency or hide until useful | Observed E-015 |
| CRX-10 | P2 | Table columns had sorting affordances but behavior was not clear from test | Uncertain ordering | Visible sort state and keyboard announcement | Partially observed E-016 |
| CRX-11 | P2 | On mobile, one marketing demo table exceeded its card width | Potential content clipping | Scroll container and edge hint, or responsive alternative | Observed E-022 |
| CRX-12 | P2 | The payment panel was long on 390px and required vertical scrolling to reach consent/button | Higher form abandonment | Sticky due-now footer, section summaries, focus and keyboard handling | Observed E-022 |
| CRX-13 | P2 | Contact vendor waterfall displayed provider names but little explanation of failure | User cannot act on failed enrichment | Provider-independent verification summary and remediation | Observed E-014 |
| CRX-14 | P2 | Multiple third-party console errors occurred around payment frames, mostly report-only CSP | Debug noise, possible payment-method telemetry issue | Track and separate benign from functional failures | Observed E-028 |

### Critical note on P0

P0 here prioritizes the requirements of **our replica**. It is not proof that Explee actually sends unverified emails or violates geography after activation. The observed public preview shows contradictions that require resolving before real sending

## Opportunity map

| Area | User question | UI response we should provide |
|---|---|---|
| Company research | Did you understand my offer correctly? | Source-backed summary, confidence and editable correction |
| Targeting | Why this segment? | Pain, buyer role, triggers, positive/negative criteria |
| Prospecting | Why this company? | 2 to 4 concrete fit signals with source and recency |
| People | Is this person still in role? | Verified/estimated role and date |
| Email | Will it really send? | Verified recipient status, sender, language and send-state gate |
| Autonomy | What exactly will the agent do without me? | Clear activation policy, budget, frequency, actions and pause |
| Pricing | What will I pay today and later? | Exact due-now, credit balance, usage unit and spending cap |
| Learning | Why did the campaign change? | Outcome data, proposed adjustment, version and rollback |

## Revised high-conversion preview sequence

1. Enter URL or brief
2. Display the organization match and ask for one-touch confirmation if ambiguous
3. Research company and show source-backed facts
4. Generate segments with explanation, exclusions and realistic estimates
5. Show top accounts with strict geo criteria and data confidence
6. Show people with verified contact coverage
7. Generate an example email, clearly tagged `preview` if no verified contact exists
8. Summarize sender identity, message language, daily spend and expected work after activation
9. Present exact payment options with the free-credit condition prominent
10. Activate and route immediately to a monitorable workspace

## Small, concrete UX standards

- Use transparent counts: `7 accounts found`, `2 people identified`, `0 verified emails` instead of a generic success badge
- Label estimates and forecasts every time they appear
- Allow company name and offering corrections before registration, save with preview token
- Avoid duplicate CTAs with different pricing phrasing
- Record user edits locally and server-side after auth; never discard on route change
- Treat enrichment failures as normal partial outcomes rather than green completed steps
- On narrow screens keep the sticky action out of the way of Support and native keyboard
- Progress is tied to jobs, with paused and stale-state labels
- Use factual examples, not placeholder customer claims, in result tables

## Research limitations and additional validation

- Sample size is one chosen organization and one visible segment execution
- Only one desktop and one 390px mobile viewport were inspected
- No authenticated dashboard or actual outbound sending was tested
- Marketing aggregate metrics were not audited against independent data
- Exact accessibility contrast, focus order and keyboard-only behavior still need an automated and manual test pass
- Exact model provider, prompts, retrieval sources and lead ranking weights remain unknown
