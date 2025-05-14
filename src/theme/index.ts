import { generateColors, generateColorsMap } from './colors-generator';
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export { generateColors, generateColorsMap, wait };

export * from './theme';
