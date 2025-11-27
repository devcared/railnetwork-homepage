"use client";

import type { Session } from "next-auth";
import { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import DashboardSidebar from "@/components/dashboard-sidebar";
import DashboardChakraProvider from "@/components/dashboard-chakra-provider";

type DashboardLayoutProps = {
  session: Session;
  children: React.ReactNode;
};

export default function DashboardLayout({
  session,
  children,
}: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <DashboardChakraProvider>
      <Flex minH="100vh" bg="white" className="dark:bg-gray-950">
        <DashboardSidebar session={session} onCollapsedChange={setIsCollapsed} />
        <Box
          flex="1"
          ml={{ base: 0, lg: isCollapsed ? "80px" : "288px" }}
          transition="margin-left 0.3s ease"
        >
          <Box minH="100vh">{children}</Box>
        </Box>
      </Flex>
    </DashboardChakraProvider>
  );
}

