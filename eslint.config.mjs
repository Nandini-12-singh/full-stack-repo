import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // ── Ignore generated / third-party directories ──────────────────────────
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "public/**",
      "*.config.mjs",
      "*.config.ts",
      "*.config.js",
      // Legacy JS files not part of the active App Router codebase
      "src/app/home.js",
      "src/app/page.js",
      "src/app/App.js",
      "src/app/layout.js",
    ],
  },

  // ── Next.js recommended rules ────────────────────────────────────────────
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // ── Project-level rule overrides ─────────────────────────────────────────
  // All rules are set to "warn" so:
  //   • Local dev  → IDE shows yellow warnings, never blocks you
  //   • CI         → `--max-warnings 0` turns any warning into a failure,
  //                  keeping the pipeline strict without "error" noise locally
  {
    rules: {
      // TypeScript
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",

      // React
      "react/no-unescaped-entities": "warn",
      "react-hooks/exhaustive-deps": "warn",

      // Next.js specific
      "@next/next/no-html-link-for-pages": "warn",
      "@next/next/no-img-element": "warn",
    },
  },
];

export default eslintConfig;
