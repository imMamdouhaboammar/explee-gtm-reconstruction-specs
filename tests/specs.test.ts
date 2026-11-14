import { describe, test, expect } from "bun:test";
import { readFileSync, existsSync, statSync, readdirSync } from "fs";
import { resolve, join } from "path";
import yaml from "js-yaml";

const ROOT_DIR = resolve(".");

describe("Specification Contracts Integrity", () => {
  test("contracts/openapi.yaml parses and satisfies OpenAPI 3.1 structure", () => {
    const openapiPath = join(ROOT_DIR, "contracts/openapi.yaml");
    expect(existsSync(openapiPath)).toBe(true);

    const raw = readFileSync(openapiPath, "utf-8");
    const spec = yaml.load(raw) as Record<string, any>;

    expect(spec).toBeDefined();
    expect(spec.openapi).toBe("3.1.0");
    expect(spec.info).toBeDefined();
    expect(spec.info.title).toBe("Independent Auto-GTM Preview API");
    expect(spec.info.license).toBeDefined();
    expect(spec.info.license.name).toBe("Apache-2.0");

    // Verify critical endpoints exist
    const paths = Object.keys(spec.paths || {});
    expect(paths).toContain("/v1/company-search");
    expect(paths).toContain("/v1/previews");
    expect(paths).toContain("/v1/previews/{previewId}");
    expect(paths).toContain("/v1/previews/{previewId}/events");
    expect(paths).toContain("/v1/previews/{previewId}/segments");
    expect(paths).toContain("/v1/previews/{previewId}/segments/{segmentId}/discover");
    expect(paths).toContain("/v1/runs/{runId}/accounts");
    expect(paths).toContain("/v1/runs/{runId}/people");
    expect(paths).toContain("/v1/previews/{previewId}/drafts");
    expect(paths).toContain("/v1/drafts/{draftId}");
    expect(paths).toContain("/v1/campaigns");
    expect(paths).toContain("/v1/campaigns/{campaignId}/activate");
    expect(paths).toContain("/v1/campaigns/{campaignId}/pause");
    expect(paths).toContain("/v1/campaigns/{campaignId}/overview");
    expect(paths).toContain("/v1/webhooks/billing");
    expect(paths).toContain("/v1/webhooks/email");

    // Verify key schemas
    const schemas = spec.components?.schemas || {};
    expect(schemas.ApiError).toBeDefined();
    expect(schemas.CompanyCandidate).toBeDefined();
    expect(schemas.Preview).toBeDefined();
    expect(schemas.Segment).toBeDefined();
    expect(schemas.ProspectAccount).toBeDefined();
    expect(schemas.Person).toBeDefined();
    expect(schemas.Draft).toBeDefined();
    expect(schemas.Campaign).toBeDefined();
  });

  test("contracts/example-project.json is valid JSON with complete pipeline state", () => {
    const jsonPath = join(ROOT_DIR, "contracts/example-project.json");
    expect(existsSync(jsonPath)).toBe(true);

    const raw = readFileSync(jsonPath, "utf-8");
    const data = JSON.parse(raw);

    expect(data._notice).toBeDefined();
    expect(data.project).toBeDefined();
    expect(data.project.id).toBeDefined();
    expect(data.project.input_kind).toBe("domain");
    expect(data.project.domain).toBeDefined();
    expect(data.project.status).toBeDefined();
    expect(data.project.company).toBeDefined();
    expect(data.project.competitor_domains).toBeArray();
    expect(data.project.segments).toBeArray();
    expect(data.project.run).toBeDefined();
    expect(data.project.example_accounts).toBeArray();
    expect(data.project.example_people).toBeArray();
    expect(data.project.draft_preview).toBeDefined();
  });
});

describe("Documentation & Link Consistency", () => {
  const expectedDocs = [
    "00_README_AR.md",
    "01_OBSERVED_JOURNEY.md",
    "02_UI_UX_CRX_SPEC.md",
    "03_GTM_FUNCTIONAL_SPEC.md",
    "04_DATA_AND_API_SPEC.md",
    "05_TECH_ARCHITECTURE.md",
    "06_ANALYTICS_AND_PRICING.md",
    "07_CRX_AUDIT.md",
    "08_QA_ACCEPTANCE.md",
    "09_EVIDENCE_LEDGER.md",
    "10_IMPLEMENTATION_PLAN.md",
    "11_BUILD_AGENT_PROMPT.md",
    "README.md",
  ];

  test("all core specification markdown files exist and are populated", () => {
    for (const doc of expectedDocs) {
      const docPath = join(ROOT_DIR, doc);
      expect(existsSync(docPath)).toBe(true);
      const stat = statSync(docPath);
      expect(stat.size).toBeGreaterThan(100);
    }
  });

  test("all relative markdown links resolve to valid local targets", () => {
    const mdFiles = readdirSync(ROOT_DIR).filter((f) => f.endsWith(".md"));
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

    for (const mdFile of mdFiles) {
      const content = readFileSync(join(ROOT_DIR, mdFile), "utf-8");
      let match: RegExpExecArray | null;

      while ((match = linkRegex.exec(content)) !== null) {
        const linkTarget = match[2].trim();
        // Skip web URLs, anchors, mailto
        if (
          linkTarget.startsWith("http://") ||
          linkTarget.startsWith("https://") ||
          linkTarget.startsWith("#") ||
          linkTarget.startsWith("mailto:")
        ) {
          continue;
        }

        const cleanPath = linkTarget.split("#")[0];
        if (cleanPath) {
          const resolved = join(ROOT_DIR, cleanPath);
          expect(existsSync(resolved)).toBe(true);
        }
      }
    }
  });
});

describe("Security & Hygiene Configuration", () => {
  test(".gitignore contains essential exclusion patterns", () => {
    const gitignorePath = join(ROOT_DIR, ".gitignore");
    expect(existsSync(gitignorePath)).toBe(true);

    const content = readFileSync(gitignorePath, "utf-8");
    const requiredPatterns = [
      ".DS_Store",
      ".env",
      "node_modules/",
      "dist/",
      "coverage/",
      "*.pem",
      "*.key",
    ];

    for (const pattern of requiredPatterns) {
      expect(content).toContain(pattern);
    }
  });
});
