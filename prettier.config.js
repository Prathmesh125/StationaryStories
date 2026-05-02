/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all', // Adjusted for consistent trailing commas
  printWidth: 80,
  jsxSingleQuote: true, // Ensures single quotes in JSX attributes
  bracketSpacing: true,
  arrowParens: 'always', // Keeps parentheses around arrow function parameters
};

export default config;
