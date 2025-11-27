"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { useTheme } from "@/contexts/theme-context";
import { useEffect } from "react";
import theme from "@/lib/chakra-theme";

type DashboardChakraProviderProps = {
  children: React.ReactNode;
};

export default function DashboardChakraProvider({
  children,
}: DashboardChakraProviderProps) {
  const { theme: appTheme } = useTheme();

  // Sync Chakra color mode with app theme
  useEffect(() => {
    const html = document.documentElement;
    if (appTheme === "dark") {
      html.setAttribute("data-theme", "dark");
      html.classList.add("chakra-ui-dark");
    } else {
      html.setAttribute("data-theme", "light");
      html.classList.remove("chakra-ui-dark");
    }
  }, [appTheme]);

  return (
    <ChakraProvider
      theme={theme}
      colorModeManager={{
        type: "localStorage",
        get: () => appTheme === "dark" ? "dark" : "light",
        set: () => {}, // Managed by app theme context
      }}
    >
      {children}
    </ChakraProvider>
  );
}

