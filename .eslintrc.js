module.exports = {
  extends: ['@moralisweb3', 'plugin:@next/next/recommended', 'plugin:cypress/recommended'],
  ignorePatterns: ['**/build/**/*'],
  rules: {
    'no-console': 'off',
    "@typescript-eslint/no-unused-vars": "off",
    "no-inline-comments": "off",
    complexity: ["error", 20],
    "etc/no-commented-out-code": "off",
    'no-unreachable': 'warn',
    'prefer-template': 'off',
    'no-template-curly-in-string': 'off',
    "@typescript-eslint/no-empty-function": "off",
  },
};
