import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier"; // 추가

export default [
  { ignores: ["dist/", "node_modules/"] },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    rules: {
      "no-unused-vars": "warn",
      eqeqeq: "error",
      "prefer-const": "warn",
    },
  },
  prettier, // 추가 (맨 마지막)
];
