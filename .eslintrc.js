module.exports = {
  extends: ['@moralisweb3', 'plugin:@next/next/recommended', 'plugin:cypress/recommended'],
  ignorePatterns: ['**/build/**/*'],
  rules: {
    'no-console': 'off',
    "@typescript-eslint/no-unused-vars": "off",
    "no-inline-comments": "off",
  },
};
