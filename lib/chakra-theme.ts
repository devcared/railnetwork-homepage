import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

// Dark Mode Config
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

// Custom Theme mit DB-Farben und Fonts
const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#e2001a", // DB Rot (Primary)
      600: "#c10015", // DB Rot Dark
      700: "#991b1b",
      800: "#7f1d1d",
      900: "#450a0a",
    },
    db: {
      red: "#e2001a",
      "red-dark": "#c10015",
      gray: "#333b46",
    },
  },
  fonts: {
    heading: '"DBScreenHead", sans-serif',
    body: '"DBScreenSans", sans-serif',
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "brand",
      },
      baseStyle: {
        fontWeight: "semibold",
        borderRadius: "md",
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: "xl",
          boxShadow: "sm",
        },
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: "full",
        fontWeight: "semibold",
      },
    },
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.950" : "white",
        color: props.colorMode === "dark" ? "gray.100" : "gray.900",
      },
    }),
  },
});

export default theme;

