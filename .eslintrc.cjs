// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineConfig } = require('eslint-define-config')

const baseExtends = [
  'eslint:recommended',
  'plugin:import/typescript',
  'plugin:@typescript-eslint/recommended',
  'prettier'
]

module.exports = defineConfig({
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: baseExtends,
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    // 允许解析JSX
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  rules: {
    'no-debugger': 'error',
    'no-console': ['warn', { allow: ['error'] }],
    'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
    camelcase: ['error', { properties: 'never' }],
    'no-var': 'error',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-void': 'error',
    'no-unused-vars': 'off',
    'prefer-const': ['warn', { destructuring: 'all', ignoreReadBeforeAssign: true }],
    'prefer-template': 'error',
    'object-shorthand': ['error', 'always', { ignoreConstructors: false, avoidQuotes: true }],
    'block-scoped-var': 'error',
    'no-constant-condition': ['error', { checkLoops: false }],
    'no-use-before-define': 'off',

    // prettier
    'prettier/prettier': 'error',

    // import
    'import/first': 'off',
    'import/no-duplicates': 'error'
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.vue'],
      excludedFiles: 'node_modules',
      rules: { 'no-undef': 'off' }
    },
    {
      files: ['packages/main-app/**'],
      // 指定如何解析语法。可以为空，但若不为空，只能配该值
      parser: 'vue-eslint-parser',
      extends: ['plugin:vue/vue3-recommended', ...baseExtends],
      rules: {
        // vue
        'vue/no-v-html': 'off',
        'vue/require-default-prop': 'off',
        'vue/require-explicit-emits': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/component-definition-name-casing': 'off',
        'vue/custom-event-name-casing': 'off',

        'import/order': [
          'error',
          {
            groups: [
              'builtin',
              'external',
              'internal',
              'parent',
              'sibling',
              'index',
              'object',
              'type'
            ],
            pathGroups: [
              {
                pattern: 'vue',
                group: 'external',
                position: 'before'
              },
              {
                pattern: '@vue/**',
                group: 'external',
                position: 'before'
              },
              {
                pattern: '@/**',
                group: 'internal'
              }
            ],
            pathGroupsExcludedImportTypes: ['type']
          }
        ]
      }
    }
  ]
})
