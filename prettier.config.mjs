import tailwindPlugin from "prettier-plugin-tailwindcss";

/** @type {import("prettier").Config} */
const config = {
  plugins: [tailwindPlugin],
  semi: true,
  singleQuote: false,
  trailingComma: "all"
};

export default config;
