import { readFileSync, existsSync } from "fs";
import { resolve, join } from "path";
import yaml from "js-yaml";

const SPEC_PATH = resolve("contracts/openapi.yaml");

function validateOpenApi() {
  if (!existsSync(SPEC_PATH)) {
    console.error(`Error: OpenAPI specification not found at ${SPEC_PATH}`);
    process.exit(1);
  }

  const raw = readFileSync(SPEC_PATH, "utf-8");
  let spec: any;
  try {
    spec = yaml.load(raw);
  } catch (err: any) {
    console.error(`YAML parse error: ${err.message}`);
    process.exit(1);
  }

  const errors: string[] = [];

  // 1. Root structure
  if (!spec.openapi || !spec.openapi.startsWith("3.1")) {
    errors.push(`Expected openapi version 3.1.x, got: ${spec.openapi}`);
  }

  if (!spec.info || !spec.info.title || !spec.info.version) {
    errors.push("Missing required info object fields (title, version)");
  }

  if (!spec.info.license || !spec.info.license.name) {
    errors.push("Missing required info.license object");
  }

  if (!Array.isArray(spec.servers) || spec.servers.length === 0) {
    errors.push("No server definitions declared");
  }

  if (!Array.isArray(spec.tags) || spec.tags.length === 0) {
    errors.push("No tags declared");
  } else {
    for (const tag of spec.tags) {
      if (!tag.name || !tag.description) {
        errors.push(`Tag "${tag.name || 'unnamed'}" missing name or description`);
      }
    }
  }

  // 2. Paths & Operations
  const paths = spec.paths || {};
  const pathKeys = Object.keys(paths);
  if (pathKeys.length === 0) {
    errors.push("No paths declared in contract");
  }

  const httpMethods = ["get", "post", "put", "patch", "delete", "options", "head"];

  for (const pathKey of pathKeys) {
    const pathItem = paths[pathKey];

    // Extract path parameters from URL
    const urlParams = (pathKey.match(/\{([^}]+)\}/g) || []).map((p) => p.slice(1, -1));

    for (const method of httpMethods) {
      if (!pathItem[method]) continue;
      const op = pathItem[method];
      const opDesc = `${method.toUpperCase()} ${pathKey}`;

      if (!op.operationId) {
        errors.push(`${opDesc}: Missing operationId`);
      }
      if (!op.summary) {
        errors.push(`${opDesc}: Missing summary`);
      }
      if (!Array.isArray(op.tags) || op.tags.length === 0) {
        errors.push(`${opDesc}: Missing tags`);
      }

      // Check parameters
      const declaredParams: string[] = [];
      const allParams = [...(pathItem.parameters || []), ...(op.parameters || [])];
      for (const param of allParams) {
        if (param.$ref) {
          const refName = param.$ref.split("/").pop();
          const target = spec.components?.parameters?.[refName];
          if (!target) {
            errors.push(`${opDesc}: Unresolved parameter $ref "${param.$ref}"`);
          } else if (target.in === "path") {
            declaredParams.push(target.name);
          }
        } else if (param.in === "path") {
          declaredParams.push(param.name);
        }
      }

      for (const urlParam of urlParams) {
        if (!declaredParams.includes(urlParam)) {
          errors.push(`${opDesc}: Path parameter "{${urlParam}}" not declared in parameters`);
        }
      }

      // Check responses
      const responses = op.responses || {};
      const statusCodes = Object.keys(responses);
      const has2xx = statusCodes.some((code) => code.startsWith("2"));
      const has4xx = statusCodes.some((code) => code.startsWith("4"));

      if (!has2xx) {
        errors.push(`${opDesc}: Missing 2XX success response`);
      }
      if (!has4xx) {
        errors.push(`${opDesc}: Missing 4XX client error response`);
      }
    }
  }

  // 3. Components & $ref resolution audit
  function auditRefs(obj: any, currentPath = "") {
    if (!obj || typeof obj !== "object") return;
    if (obj.$ref && typeof obj.$ref === "string") {
      const ref = obj.$ref;
      if (ref.startsWith("#/components/")) {
        const parts = ref.replace("#/components/", "").split("/");
        const section = parts[0];
        const name = parts[1];
        if (!spec.components?.[section]?.[name]) {
          errors.push(`Unresolved reference "${ref}" at ${currentPath}`);
        }
      }
      return;
    }
    for (const key of Object.keys(obj)) {
      auditRefs(obj[key], `${currentPath}.${key}`);
    }
  }

  auditRefs(spec, "root");

  if (errors.length > 0) {
    console.error(`\n❌ OpenAPI validation failed with ${errors.length} error(s):`);
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  console.log(`\n✅ OpenAPI 3.1.0 specification verified:`);
  console.log(`   Paths: ${pathKeys.length}`);
  console.log(`   Tags: ${spec.tags.length}`);
  console.log(`   Schemas: ${Object.keys(spec.components?.schemas || {}).length}`);
  console.log(`   Parameters: ${Object.keys(spec.components?.parameters || {}).length}`);
  console.log(`   Responses: ${Object.keys(spec.components?.responses || {}).length}`);
  console.log(`   0 errors, all references cleanly resolved.\n`);
}

validateOpenApi();
