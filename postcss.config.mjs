// const config = {
//   plugins: {
//     '@tailwindcss/postcss': {},
//     'postcss-preset-mantine': {},
//     'postcss-simple-vars': {
//       variables: {
//         'mantine-breakpoint-xs': '36em',
//         'mantine-breakpoint-sm': '48em',
//         'mantine-breakpoint-md': '62em',
//         'mantine-breakpoint-lg': '75em',
//         'mantine-breakpoint-xl': '88em',
//       },
//     },
//   },
// };

// export default config;

const config = {
  plugins: {
    '@tailwindcss/postcss': {},
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '40em', // 640px (Tailwind sm)
        'mantine-breakpoint-sm': '48em', // 768px (Tailwind md)
        'mantine-breakpoint-md': '64em', // 1024px (Tailwind lg)
        'mantine-breakpoint-lg': '80em', // 1280px (Tailwind xl)
        'mantine-breakpoint-xl': '96em', // 1536px (Tailwind 2xl)
      },
    },
  },
};

export default config;
