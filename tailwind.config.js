/**
 * Tailwind CSS configuration file.
 *
 * This file is used to configure the tailwind CSS. For more information,
 * please visit https://tailwindcss.com/docs/configuration
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify the files to scan for classes
  content: ['./src/**/*.{js,jsx,ts,tsx}'],

  // Custom theme configuration
  theme: {
    // Extend the default tailwind theme
    extend: {
      // Custom boxShadow configuration
      boxShadow: {
        // Custom shadow class
        custom: '0px 2px 4px 0px rgba(0, 0, 0, 0.1)', // Note: #0000001A translates to rgba(0, 0, 0, 0.1)
      },
    },
  },

  // Plugins to be used
  plugins: [],
};
