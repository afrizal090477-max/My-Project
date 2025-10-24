module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "react-hooks"],
  rules: {
    // --- General Rules ---
    "no-unused-vars": "error",
    "no-console": "warn",

    // --- React Rules ---
    "react/react-in-jsx-scope": "off", // untuk React 17+
    "react/prop-types": "off", // kamu udah pakai PropTypes manual di komponen modal

    // --- Accessibility (a11y) Rules ---
    "jsx-a11y/label-has-associated-control": "error",
    "jsx-a11y/click-events-have-key-events": "warn",
    "jsx-a11y/no-static-element-interactions": "warn",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
