import js from "@eslint/js";
import markdown from "@elsikora/eslint-plugin-markdown";
import featureSliced from "@conarti/eslint-plugin-feature-sliced";
import eslintReact from "@eslint-react/eslint-plugin";
import tanstackQuery from "@tanstack/eslint-plugin-query";
import tanstackRouter from "@tanstack/eslint-plugin-router";
import { defineConfig } from "eslint/config";
import globals from "globals";
import importPlugin from "eslint-plugin-import";
import jsonc from "eslint-plugin-jsonc";
import jsxA11y from "eslint-plugin-jsx-a11y";
import n from "eslint-plugin-n";
import packageJson from "eslint-plugin-package-json";
import perfectionist from "eslint-plugin-perfectionist";
import prettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
import react from "eslint-plugin-react";
import sonarjs from "eslint-plugin-sonarjs";
import tailwindcss from "eslint-plugin-tailwindcss";
import yml from "eslint-plugin-yml";
import tseslint from "typescript-eslint";
import betterTw from "eslint-plugin-better-tailwindcss";

const sourceFiles = ["src/**/*.{js,jsx,ts,tsx}"];
const reactFiles = ["src/**/*.{jsx,tsx}"];
const codeFiles = ["**/*.{js,mjs,cjs,jsx,ts,tsx}"];
const nodeFiles = [
 "*.config.{js,mjs,cjs,ts}",
 "eslint.config.js",
 "commitlint.config.js",
 "lint-staged.config.js",
 "release.config.js",
 "vite.config.ts",
];

const fsdLayers = ["shared", "entities", "features", "widgets", "pages", "app"];

const withFiles = (files, config) =>
 (Array.isArray(config) ? config : [config]).map((item) => ({
  ...item,
  files: item.files ?? files,
 }));

export default defineConfig(
 {
  ignores: [
   ".agents/**",
   ".cursor/**",
   ".elsikora/**",
   "dist/**",
   "coverage/**",
   "node_modules/**",
   "src/routeTree.gen.ts",
  ],
 },
 {
  files: codeFiles,
  languageOptions: {
   ecmaVersion: "latest",
   sourceType: "module",
   globals: {
    ...globals.browser,
    ...globals.es2024,
   },
  },
 },
 {
  files: nodeFiles,
  languageOptions: {
   globals: {
    ...globals.node,
   },
  },
 },
 ...withFiles(codeFiles, js.configs.recommended),
 ...withFiles(codeFiles, tseslint.configs.recommended),
 ...withFiles(reactFiles, react.configs.flat.recommended),
 ...withFiles(reactFiles, react.configs.flat["jsx-runtime"]),
 ...withFiles(reactFiles, jsxA11y.flatConfigs.recommended),
 ...withFiles(reactFiles, eslintReact.configs["recommended-typescript"]),
 ...withFiles(reactFiles, eslintReact.configs["disable-conflict-eslint-plugin-react"]),
 ...withFiles(reactFiles, betterTw.configs.recommended),
 ...withFiles(sourceFiles, tanstackQuery.configs["flat/recommended"]),
 ...withFiles(sourceFiles, tanstackRouter.configs["flat/recommended"]),
 ...withFiles(reactFiles, tailwindcss.configs["flat/recommended"]),
 ...withFiles(sourceFiles, sonarjs.configs.recommended),
 ...withFiles(markdown.configs.recommended[0].files, markdown.configs.recommended),
 ...withFiles(["**/*.{json,jsonc,json5}"], jsonc.configs["flat/recommended-with-jsonc"]),
 ...withFiles(["**/*.{yaml,yml}"], yml.configs["flat/recommended"]),
 packageJson.configs.recommended,
 {
  files: ["**/package.json"],
  rules: {
   "package-json/require-description": "off",
   "package-json/require-files": "off",
   "package-json/require-license": "off",
   "package-json/require-repository": "off",
   "package-json/require-sideEffects": "off",
   "package-json/require-version": "off",
   "package-json/valid-author": "off",
   "package-json/valid-bugs": "off",
   "package-json/valid-funding": "off",
   "package-json/valid-homepage": "off",
   "package-json/valid-keywords": "off",
   "package-json/valid-packageManager": "off",
   "package-json/valid-repository": "off",
   "package-json/sort-collections": "warn",
  },
 },
 ...withFiles(["**/*.{js,mjs,cjs,jsx,ts,tsx}"], eslintConfigPrettier),
 {
  files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
  plugins: {
   prettier,
  },
  rules: {
   "prettier/prettier": "error",
   "arrow-body-style": "off",
   "prefer-arrow-callback": "off",
  },
 },
 ...withFiles(sourceFiles, perfectionist.configs["recommended-natural"]),
 ...withFiles(["**/*.{js,mjs,cjs}"], n.configs["flat/recommended"]),
 {
  files: sourceFiles,
  settings: {
   react: {
    version: "detect",
   },
   tailwindcss: {
    callees: ["cn", "cva", "clsx", "twMerge"],
    config: {},
   },
  },
  plugins: {
   "@conarti/feature-sliced": featureSliced,
   import: importPlugin,
  },
  rules: {
   "@conarti/feature-sliced/layers-slices": "warn",
   "@conarti/feature-sliced/absolute-relative": "warn",
   "@conarti/feature-sliced/public-api": "warn",
   "import/order": [
    "warn",
    {
     alphabetize: {
      order: "asc",
      caseInsensitive: true,
     },
     "newlines-between": "never",
     distinctGroup: false,
     pathGroups: fsdLayers.flatMap((layer) => [
      {
       pattern: `@/${layer}{,/**}`,
       group: "internal",
       position: "after",
      },
      {
       pattern: `#/${layer}{,/**}`,
       group: "internal",
       position: "after",
      },
     ]),
     pathGroupsExcludedImportTypes: ["builtin"],
     groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
    },
   ],
   "perfectionist/sort-exports": "off",
   "perfectionist/sort-imports": "off",
   "perfectionist/sort-jsx-props": "off",
   "perfectionist/sort-modules": "off",
   "perfectionist/sort-named-exports": "off",
   "perfectionist/sort-named-imports": "off",
   "react/prop-types": "off",
   "sonarjs/no-duplicate-string": "off",
   "tailwindcss/no-custom-classname": "off",
  },
 },
);
