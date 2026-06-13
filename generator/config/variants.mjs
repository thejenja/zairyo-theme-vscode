export const VARIANTS = [
  {
    id: 'dark',
    type: 'dark',
    label: 'Dark',
    isDark: true,
    contrastAdjust: null,
  },
  {
    id: 'dark-contrast',
    type: 'dark',
    label: 'Dark Contrast',
    isDark: true,
    contrastAdjust: {
      surface: '#141218',
      onSurface: '#FFFFFF',
      outline: '#938F99',
      surfaceContainer: '#1C1B1F',
      surfaceDim: '#000000',
    },
  },
  {
    id: 'light',
    type: 'light',
    label: 'Light',
    isDark: false,
    contrastAdjust: null,
  },
  {
    id: 'light-contrast',
    type: 'light',
    label: 'Light Contrast',
    isDark: false,
    contrastAdjust: {
      surface: '#FFFFFF',
      onSurface: '#000000',
      outline: '#49454F',
      surfaceContainer: '#F4EFF4',
      surfaceDim: '#F4EFF4',
    },
  },
];
