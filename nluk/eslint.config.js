import js from '@eslint/js'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import a11yPlugin from 'eslint-plugin-jsx-a11y'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'

const sharedGlobals = {
  window: 'readonly',
  document: 'readonly',
  navigator: 'readonly',
  sessionStorage: 'readonly',
  localStorage: 'readonly',
  console: 'readonly',
  requestAnimationFrame: 'readonly',
  SpeechSynthesisUtterance: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  // PR #14 — auto-translate uses fetch and AbortController
  fetch: 'readonly',
  AbortController: 'readonly',
  Promise: 'readonly',
  // DOM types used in TypeScript generics and interface declarations
  Event: 'readonly',
  Element: 'readonly',
  HTMLButtonElement: 'readonly',
  HTMLInputElement: 'readonly',
  HTMLElement: 'readonly',
  HTMLDivElement: 'readonly',
  HTMLAnchorElement: 'readonly',
  URL: 'readonly',
  KeyboardEvent: 'readonly',
  TouchList: 'readonly',
  Touch: 'readonly',
  TouchEvent: 'readonly',
  ServiceWorkerRegistration: 'readonly',
  // Encoding
  btoa: 'readonly',
  atob: 'readonly',
  // Fetch / Abort types
  AbortSignal: 'readonly',
  HeadersInit: 'readonly',
  RequestInit: 'readonly',
}

export default [
  js.configs.recommended,
  // ── JS / JSX (legacy, kept for any remaining .js files) ──────────
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': a11yPlugin,
    },
    settings: {
      // Pin explicitly — 'detect' crashes ESLint v10 flat config
      react: { version: '18.3' },
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: sharedGlobals,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react/no-unescaped-entities': 'warn',
      ...reactHooksPlugin.configs.recommended.rules,
      'react-hooks/set-state-in-effect': 'off',
      ...a11yPlugin.configs.recommended.rules,
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-noninteractive-element-to-interactive-role': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'no-empty': ['warn', { allowEmptyCatch: true }],
    },
  },
  // ── TypeScript / TSX ────────────────────────────────────────────
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': a11yPlugin,
      '@typescript-eslint': tsPlugin,
    },
    settings: {
      react: { version: '18.3' },
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: sharedGlobals,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react/no-unescaped-entities': 'warn',
      ...reactHooksPlugin.configs.recommended.rules,
      'react-hooks/set-state-in-effect': 'off',
      ...a11yPlugin.configs.recommended.rules,
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-noninteractive-element-to-interactive-role': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      // Disable base rule in favour of TS-aware version
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'no-empty': ['warn', { allowEmptyCatch: true }],
      // Allow `any` during migration
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  // ── Test files — add vitest/jest globals ────────────────────────
  {
    files: ['src/__tests__/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: {
        ...sharedGlobals,
        global: 'readonly',
        globalThis: 'readonly',
      },
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
]
