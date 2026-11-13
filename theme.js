import { createTheme } from '@mui/material/styles'

export function getAppTheme(mode) {
  const dark = mode === 'dark'

  return createTheme({
    palette: {
      mode,
      primary: { main: '#00B4D8', dark: '#0089A8', contrastText: '#001524' },
      secondary: { main: '#2EC4B6' },
      success: { main: '#2A9D8F' },
      warning: { main: '#F77F00' },
      error: { main: { dark: '#D62828', light: '#D94A4A' }[mode] },
      background: {
        default: dark ? '#001524' : '#F4F7FA',
        paper: dark ? '#00263B' : '#FFFFFF',
      },
      text: {
        primary: dark ? '#F3F8FB' : '#003049',
        secondary: dark ? '#9CB3C2' : '#637887',
      },
      divider: dark ? 'rgba(255,255,255,0.08)' : '#E5EDF2',
    },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      button: { textTransform: 'none', fontWeight: 700 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: dark ? '#001524' : '#F4F7FA',
            transition: 'background-color 180ms ease',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          rounded: { borderRadius: 18 },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 12, paddingInline: 16 },
        },
      },
    },
  })
}
