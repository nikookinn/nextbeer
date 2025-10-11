import { createTheme } from '@mui/material/styles';
import * as colors from '@radix-ui/colors';

// Modern Light Theme - Soft & Elegant
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563EB',    // Modern Blue
      light: '#60A5FA',   // Light Blue
      dark: '#1D4ED8',    // Deep Blue
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7C3AED',    // Purple
      light: '#A78BFA',   // Light Purple
      dark: '#5B21B6',    // Deep Purple
      contrastText: '#ffffff',
    },
    error: {
      main: '#EF4444',    // Modern Red
      light: '#F87171',   // Light Red
      dark: '#DC2626',    // Deep Red
    },
    warning: {
      main: '#F59E0B',    // Modern Orange
      light: '#FBBF24',   // Light Orange
      dark: '#D97706',    // Deep Orange
    },
    info: {
      main: '#06B6D4',    // Cyan
      light: '#22D3EE',   // Light Cyan
      dark: '#0891B2',    // Deep Cyan
    },
    success: {
      main: '#10B981',    // Modern Green
      light: '#34D399',   // Light Green
      dark: '#059669',    // Deep Green
    },
    background: {
      default: '#FAFBFC',   // Very Light Gray-Blue
      paper: '#FFFFFF',     // Pure White
    },
    text: {
      primary: '#1F2937',    // Dark Gray (not black)
      secondary: '#6B7280',  // Medium Gray
    },
    divider: '#E5E7EB',      // Light Gray
  },
  typography: {
    fontFamily: '"SF Pro Display", "-apple-system", "BlinkMacSystemFont", "Inter", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.025em' },
    h2: { fontWeight: 600, letterSpacing: '-0.025em' },
    h3: { fontWeight: 600, letterSpacing: '-0.02em' },
    h4: { fontWeight: 600, letterSpacing: '-0.02em' },
    h5: { fontWeight: 500, letterSpacing: '-0.01em' },
    h6: { fontWeight: 500, letterSpacing: '-0.01em' },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 251, 252, 0.95) 100%) !important',
          backdropFilter: 'blur(20px) saturate(180%) !important',
          borderBottom: '1px solid rgba(229, 231, 235, 0.8) !important',
          boxShadow: '0 4px 20px rgba(37, 99, 235, 0.08) !important',
          borderRadius: '0 !important',
          color: '#1F2937 !important',
          '&.MuiAppBar-root': {
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 251, 252, 0.95) 100%) !important',
            color: '#1F2937 !important',
          },
          '& .MuiIconButton-root': {
            color: '#1F2937 !important',
            '& svg': {
              color: '#1F2937 !important',
              fill: '#1F2937 !important',
            }
          },
          '& .MuiTypography-root': {
            color: '#1F2937 !important',
          }
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FEFEFE 100%)',
          borderRadius: '16px !important',
          boxShadow: '0 4px 20px rgba(37, 99, 235, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(229, 231, 235, 0.6)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 30px rgba(37, 99, 235, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)',
            borderColor: 'rgba(37, 99, 235, 0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FEFEFE 100%)',
          borderRadius: '16px !important',
          boxShadow: '0 4px 20px rgba(37, 99, 235, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(229, 231, 235, 0.6)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '12px !important',
          fontWeight: 600,
          padding: '12px 24px',
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 16px rgba(37, 99, 235, 0.25)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px !important',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(37, 99, 235, 0.08) !important',
            transform: 'scale(1.05)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
          // Touch feedback for mobile
          '@media (hover: none)': {
            '&:hover': {
              backgroundColor: 'transparent !important',
              transform: 'none',
            },
            '&:active': {
              backgroundColor: 'rgba(37, 99, 235, 0.12) !important',
              transform: 'scale(0.95)',
            },
          },
        },
      },
    },
  },
});

// Professional Dark Theme - Apple/Figma Dark Style
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFFFFF',    // Pure White (for dark mode)
      light: '#F2F2F7',   // Light Gray
      dark: '#E5E5E7',    // Medium Gray
      contrastText: '#000000',
    },
    secondary: {
      main: '#0A84FF',    // Apple Blue Dark
      light: '#409CFF',   // Light Blue
      dark: '#0056CC',    // Deep Blue
      contrastText: '#ffffff',
    },
    error: {
      main: '#FF453A',    // Apple Red Dark
      light: '#FF6961',   // Light Red
      dark: '#D70015',    // Deep Red
    },
    warning: {
      main: '#FF9F0A',    // Apple Orange Dark
      light: '#FFB340',   // Light Orange
      dark: '#CC7700',    // Deep Orange
    },
    info: {
      main: '#64D2FF',    // Apple Light Blue Dark
      light: '#8ADDFF',   // Lighter Blue
      dark: '#32BEFF',    // Deep Light Blue
    },
    success: {
      main: '#30D158',    // Apple Green Dark
      light: '#5DE075',   // Light Green
      dark: '#28A745',    // Deep Green
    },
    background: {
      default: '#000000',   // Pure Black (Apple style)
      paper: '#1C1C1E',     // Apple Dark Gray
    },
    text: {
      primary: '#FFFFFF',    // Pure White
      secondary: '#8E8E93',  // Apple Secondary Gray
    },
    divider: '#38383A',      // Apple Dark Separator
  },
  typography: {
    fontFamily: '"SF Pro Display", "-apple-system", "BlinkMacSystemFont", "Inter", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.025em' },
    h2: { fontWeight: 600, letterSpacing: '-0.025em' },
    h3: { fontWeight: 600, letterSpacing: '-0.02em' },
    h4: { fontWeight: 600, letterSpacing: '-0.02em' },
    h5: { fontWeight: 500, letterSpacing: '-0.01em' },
    h6: { fontWeight: 500, letterSpacing: '-0.01em' },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(28, 28, 30, 0.85) !important',
          backdropFilter: 'blur(20px) saturate(180%) !important',
          borderBottom: '1px solid #38383A !important',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3) !important',
          borderRadius: '0 !important',
          color: '#FFFFFF !important',
          '&.MuiAppBar-root': {
            backgroundColor: 'rgba(28, 28, 30, 0.85) !important',
            color: '#FFFFFF !important',
          },
          '& .MuiIconButton-root': {
            color: '#FFFFFF !important',
            '& svg': {
              color: '#FFFFFF !important',
              fill: '#FFFFFF !important',
            }
          },
          '& .MuiTypography-root': {
            color: '#FFFFFF !important',
          }
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1C1C1E',
          borderRadius: '12px !important',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          border: '1px solid #2C2C2E',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
            borderColor: '#38383A',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1C1C1E',
          borderRadius: '12px !important',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          border: '1px solid #2C2C2E',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '10px !important',
          fontWeight: 600,
          padding: '10px 20px',
          boxShadow: `0 1px 2px ${colors.blackA.blackA6}`,
          '&:hover': {
            boxShadow: `0 2px 4px ${colors.blackA.blackA8}`,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px !important',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08) !important',
            transform: 'scale(1.05)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
          // Touch feedback for mobile
          '@media (hover: none)': {
            '&:hover': {
              backgroundColor: 'transparent !important',
              transform: 'none',
            },
            '&:active': {
              backgroundColor: 'rgba(255, 255, 255, 0.12) !important',
              transform: 'scale(0.95)',
            },
          },
        },
      },
    },
  },
});

export const createAppTheme = (mode: 'light' | 'dark') => {
  return mode === 'light' ? lightTheme : darkTheme;
};

// Force AppBar colors with global CSS
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('appbar-override');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  const style = document.createElement('style');
  style.id = 'appbar-override';
  style.textContent = `
    .MuiAppBar-root {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 251, 252, 0.95) 100%) !important;
      backdrop-filter: blur(20px) saturate(180%) !important;
      border-bottom: 1px solid rgba(229, 231, 235, 0.8) !important;
      box-shadow: 0 4px 20px rgba(37, 99, 235, 0.08) !important;
      color: #1F2937 !important;
      border-radius: 0 !important;
    }
    .MuiAppBar-root .MuiIconButton-root {
      color: #1F2937 !important;
    }
    .MuiAppBar-root .MuiIconButton-root svg {
      color: #1F2937 !important;
      fill: #1F2937 !important;
    }
    .MuiAppBar-root .MuiTypography-root {
      color: #1F2937 !important;
    }
    [data-mui-color-scheme="dark"] .MuiAppBar-root {
      background-color: rgba(28, 28, 30, 0.85) !important;
      border-bottom: 1px solid #38383A !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
      color: #FFFFFF !important;
    }
    [data-mui-color-scheme="dark"] .MuiAppBar-root .MuiIconButton-root {
      color: #FFFFFF !important;
    }
    [data-mui-color-scheme="dark"] .MuiAppBar-root .MuiIconButton-root svg {
      color: #FFFFFF !important;
      fill: #FFFFFF !important;
    }
    [data-mui-color-scheme="dark"] .MuiAppBar-root .MuiTypography-root {
      color: #FFFFFF !important;
    }
  `;
  document.head.appendChild(style);
}
