const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

console.log(
  join(
    __dirname, './src/index.html'
  ),

  )


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname, './src/index.html'
    ),
    join(
      __dirname, "./src/**/*.{js,ts,jsx,tsx}"
    ),
    join(
      __dirname, '../../',
      'node_modules/@llamaindex/chat-ui/**/*.{ts,tsx}'
    ),
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
