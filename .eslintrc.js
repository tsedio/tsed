module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["prettier", "plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint", "workspaces"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.eslint.json"]
  },
  env: {
    node: true,
    es6: true
  },
  rules: {
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "require-await": "error",
    "no-return-await": "error",
    "no-case-declarations": "off",
    "no-empty": "off",
    "prefer-const": "off",
    "no-fallthrough": "off",
    "workspaces/no-absolute-imports": "error"
  },
  overrides: [
    {
      files: ["**/*.benchmark.ts", "**/test/**", "**/__mock__/**"],
      rules: {
        "workspaces/no-absolute-imports": "off"
      }
    }
  ]
};
