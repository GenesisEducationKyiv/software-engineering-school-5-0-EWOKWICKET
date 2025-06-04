import * as tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['test/**'],
  },
  {
    languageOptions: {
      globals: {
        process: 'readonly',
      },
    },
  },
  ...tseslint.configs.recommended, //ts rules

  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
      },
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
