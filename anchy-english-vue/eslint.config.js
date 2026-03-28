import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";

export default [
  {
    ignores: ["dist/"],
  },
  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    languageOptions: {
      globals: {
        // Browser globals
        window: "readonly",
        document: "readonly",
        console: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        confirm: "readonly",
        alert: "readonly",
        speechSynthesis: "readonly",
        SpeechSynthesisUtterance: "readonly",
        Event: "readonly",
        localStorage: "readonly",
      },
    },
    rules: {
      // Relax noisy Vue template formatting rules
      "vue/multi-word-component-names": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/multiline-html-element-content-newline": "off",
      "vue/max-attributes-per-line": "off",
      "vue/html-self-closing": "off",
      "vue/html-closing-bracket-newline": "off",
      "vue/html-indent": "off",
      "vue/first-attribute-linebreak": "off",
      "vue/attributes-order": "off",
      "vue/attribute-hyphenation": "off",
      "vue/require-default-prop": "off",
      "vue/no-template-shadow": "off",

      // JS rules
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "vue/no-unused-vars": ["warn", { ignorePattern: "^_" }],
    },
  },
];
