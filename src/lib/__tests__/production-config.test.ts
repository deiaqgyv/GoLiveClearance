import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("production build configuration", () => {
  it("keeps React Dev Inspector scoped to development", () => {
    const config = JSON.parse(
      readFileSync(join(process.cwd(), ".babelrc"), "utf8")
    ) as {
      plugins?: string[];
      env?: { development?: { plugins?: string[] } };
    };

    expect(config.plugins).toBeUndefined();
    expect(config.env?.development?.plugins).toContain(
      "@react-dev-inspector/babel-plugin"
    );
  });
});
