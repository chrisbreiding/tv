module.exports = {
  root: true,
  extends: [
    'plugin:crb/general',
    'plugin:crb/react',
  ],
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      files: [
        '*.ts',
        '*.tsx',
      ],
      extends: [
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'react/jsx-filename-extension': ['error', {
          'extensions': ['.tsx'],
        }],
      },
    },
  ],
}
