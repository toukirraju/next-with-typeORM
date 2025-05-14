
import { createTheme, DEFAULT_THEME, mergeMantineTheme } from '@mantine/core';
import { generateColors } from './colors-generator';

const customSHades = generateColors('#F79522');

const themeOverride = createTheme({
  colors: {
    primaryShades: customSHades,
  },
  primaryColor: 'primaryShades',
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
