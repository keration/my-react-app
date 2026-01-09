import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import { defineConfig } from 'eslint/config';

export default defineConfig({
  ignores: ['dist'],
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      plugins: {
        react: reactPlugin,
        '@typescript-eslint': tsPlugin,
        'react-hooks': reactHooks,
      },
      extends: [
        js.configs.recommended,
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:react/recommended',
      ],
      languageOptions: {
        globals: globals.browser,
      },
      settings: {
        react: { version: 'detect' },
      },
      rules: {
        'react/prop-types': 'off',
      },
    },
  ],
});
