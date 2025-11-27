"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import Image from "next/image";
import {
  Box,
  Flex,
  VStack,
  Text,
  IconButton,
  Button,
  DrawerRoot,
  DrawerBackdrop,
  DrawerPositioner,
  DrawerContent,
  DrawerBody,
  CollapsibleRoot,
  CollapsibleContent,
  Separator,
  MenuRoot,
  MenuTrigger,
  MenuPositioner,
  MenuContent,
  MenuItem,
  MenuSeparator,
  TooltipRoot,
  TooltipTrigger,
  TooltipPositioner,
  TooltipContent,
} from "@chakra-ui/react";
import {
  ChevronLeft,
  ChevronRight,
  Menu as MenuIcon,
  X,
  Settings,
  Home,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { navSections, type DashboardNavItem } from "@/lib/dashboard-nav-data";

type DashboardSidebarProps = {
  session: Session;
  onCollapsedChange?: (collapsed: boolean) => void;
};

export default function DashboardSidebar({ session, onCollapsedChange }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [manualDropdowns, setManualDropdowns] = useState<Set<string>>(new Set());
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleToggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  };

  const handleLogout = () => {
    void signOut({ callbackUrl: "/" });
  };

  const toggleDropdown = (itemId: string) => {
    setManualDropdowns((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const isItemActive = (item: DashboardNavItem) => {
    if (pathname === item.href) return true;
    if (item.subItems) {
      return item.subItems.some((subItem) => pathname === subItem.href || pathname.startsWith(subItem.href + "/"));
    }
    return false;
  };

  const isSubItemActive = (subItemHref: string) => {
    return pathname === subItemHref || pathname.startsWith(subItemHref + "/");
  };

  // Auto-open dropdowns based on active path
  const autoOpenDropdowns = useMemo(() => {
    const open = new Set<string>();
    navSections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.subItems) {
          const hasActiveSubItem = item.subItems.some(
            (subItem) => pathname === subItem.href || pathname.startsWith(subItem.href + "/")
          );
          if (hasActiveSubItem || pathname === item.href || pathname.startsWith(item.href + "/")) {
            open.add(item.id);
          }
        }
      });
    });
    return open;
  }, [pathname]);

  const openDropdowns = useMemo(() => {
    const combined = new Set<string>(manualDropdowns);
    autoOpenDropdowns.forEach((id) => combined.add(id));
    return combined;
  }, [manualDropdowns, autoOpenDropdowns]);

  return (
    <>
      {/* Mobile Menu Button */}
      <IconButton
        aria-label="Menü öffnen"
        position="fixed"
        top={4}
        left={4}
        zIndex={50}
        display={{ base: "flex", lg: "none" }}
        onClick={() => setIsMobileOpen(true)}
        borderRadius="full"
        borderWidth="1px"
        borderColor="gray.200"
        bg="white"
        color="gray.600"
      >
        {isMobileOpen ? <X size={16} /> : <MenuIcon size={16} />}
      </IconButton>

      {/* Desktop Sidebar */}
      <Box
        as="aside"
        position="fixed"
        insetY={0}
        left={0}
        zIndex={40}
        borderRightWidth="1px"
        borderColor="gray.200"
        bg="white"
        w={{ base: "full", lg: isCollapsed ? "80px" : "288px" }}
        transition="width 0.3s ease"
        overflow={isCollapsed ? "visible" : "auto"}
        display={{ base: "none", lg: "block" }}
      >
        <SidebarContentInner
          session={session}
          isCollapsed={isCollapsed}
          openDropdowns={openDropdowns}
          toggleDropdown={toggleDropdown}
          isItemActive={isItemActive}
          isSubItemActive={isSubItemActive}
          handleLogout={handleLogout}
          handleToggleCollapse={handleToggleCollapse}
          theme={theme}
        />
      </Box>

      {/* Mobile Drawer */}
      <DrawerRoot open={isMobileOpen} onOpenChange={(e) => setIsMobileOpen(e.open)}>
        <DrawerBackdrop />
        <DrawerPositioner>
          <DrawerContent>
            <DrawerBody p={0}>
              <SidebarContentInner
                session={session}
                isCollapsed={false}
                openDropdowns={openDropdowns}
                toggleDropdown={toggleDropdown}
                isItemActive={isItemActive}
                isSubItemActive={isSubItemActive}
                handleLogout={handleLogout}
                handleToggleCollapse={handleToggleCollapse}
                setIsMobileOpen={setIsMobileOpen}
                theme={theme}
                isMobile
              />
            </DrawerBody>
          </DrawerContent>
        </DrawerPositioner>
      </DrawerRoot>
    </>
  );
}

type SidebarContentProps = {
  session: Session;
  isCollapsed: boolean;
  openDropdowns: Set<string>;
  toggleDropdown: (id: string) => void;
  isItemActive: (item: DashboardNavItem) => boolean;
  isSubItemActive: (href: string) => boolean;
  handleLogout: () => void;
  handleToggleCollapse: () => void;
  setIsMobileOpen?: (open: boolean) => void;
  theme: string;
  isMobile?: boolean;
};

function SidebarContentInner({
  session,
  isCollapsed,
  openDropdowns,
  toggleDropdown,
  isItemActive,
  isSubItemActive,
  handleLogout,
  handleToggleCollapse,
  setIsMobileOpen,
  theme,
  isMobile = false,
}: SidebarContentProps) {
  return (
    <VStack h="100%" gap={0} align="stretch">
      {/* Header */}
      <Box borderBottomWidth="1px" borderColor="gray.200" className="dark:border-gray-700 dark:bg-gray-900" px={4} py={4} bg="white">
        <Flex align="center" justify="space-between">
          {!isCollapsed && (
            <Link href="/" aria-label="Zur Startseite">
              <Image
                src={theme === "dark" ? "/Logo_darkmode.svg" : "/Logo.svg"}
                alt="Railnetwork.app"
                width={180}
                height={90}
                style={{ height: "40px", width: "auto", maxWidth: "180px" }}
                priority
              />
            </Link>
          )}
          {isCollapsed && (
            <Link href="/" aria-label="Zur Startseite">
              <Box
                h="40px"
                w="40px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="lg"
                bg="brand.500"
                opacity={0.1}
              >
                <Box h="24px" w="24px" borderRadius="md" bg="brand.500" />
              </Box>
            </Link>
          )}
          {!isMobile && (
            <IconButton
              aria-label={isCollapsed ? "Sidebar erweitern" : "Sidebar minimieren"}
              size="sm"
              variant="ghost"
              onClick={handleToggleCollapse}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </IconButton>
          )}
        </Flex>
      </Box>

      {/* Navigation */}
      <Box flex="1" overflowY="auto" px={2} py={6}>
        <VStack gap={8} align="stretch">
          {navSections.map((section) => (
            <Box key={section.title}>
              {!isCollapsed && (
                <Box px={4} pb={3}>
                  <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" color="gray.500" className="dark:text-gray-400">
                    {section.title}
                  </Text>
                  {section.subtitle && (
                    <Text fontSize="2xs" color="gray.400" className="dark:text-gray-400" mt={0.5}>
                      {section.subtitle}
                    </Text>
                  )}
                </Box>
              )}
              <VStack gap={0.5} align="stretch">
                {section.items.map((item) => {
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isActive = isItemActive(item);
                  const isOpen = openDropdowns.has(item.id);

                  return (
                    <Box key={item.id}>
                      <Flex align="center">
                        {isCollapsed ? (
                          <TooltipRoot openDelay={300}>
                            <TooltipTrigger asChild>
                              <Link
                                href={item.href}
                                onClick={() => {
                                  if (isMobile && setIsMobileOpen) {
                                    setIsMobileOpen(false);
                                  }
                                }}
                                style={{ flex: 1 }}
                              >
                                <Flex
                                  align="center"
                                  justify="center"
                                  px={0}
                                  py={2}
                                  borderRadius="lg"
                                  fontSize="sm"
                                  fontWeight="semibold"
                                  bg={isActive ? "gray.50" : "transparent"}
                                  color={isActive ? "gray.900" : "gray.600"}
                                  className={`${isActive ? "dark:bg-gray-800 dark:text-gray-100" : "dark:bg-transparent dark:text-gray-400"} dark:hover:bg-gray-800 dark:hover:text-gray-100`}
                                  _hover={{ bg: "gray.50" }}
                                >
                                  <Box
                                    flexShrink={0}
                                    p={1.5}
                                    borderRadius="md"
                                    color={isActive ? "brand.500" : "gray.400"}
                                    className={isActive ? "dark:text-brand-500" : "dark:text-gray-400"}
                                  >
                                    {item.icon}
                                  </Box>
                                </Flex>
                              </Link>
                            </TooltipTrigger>
                            <TooltipPositioner>
                              <TooltipContent>{item.label}</TooltipContent>
                            </TooltipPositioner>
                          </TooltipRoot>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={() => {
                              if (isMobile && setIsMobileOpen) {
                                setIsMobileOpen(false);
                              }
                            }}
                            style={{ flex: 1 }}
                          >
                            <Flex
                              align="center"
                              gap={2}
                              px={3}
                              py={2}
                              borderRadius="lg"
                              fontSize="sm"
                              fontWeight="semibold"
                              bg={isActive ? "gray.50" : "transparent"}
                              color={isActive ? "gray.900" : "gray.600"}
                              className={`${isActive ? "dark:bg-gray-800 dark:text-gray-100" : "dark:bg-transparent dark:text-gray-400"} dark:hover:bg-gray-800 dark:hover:text-gray-100`}
                              _hover={{ bg: "gray.50", color: "gray.900" }}
                              position="relative"
                            >
                              {isActive && (
                                <Box
                                  position="absolute"
                                  left={0}
                                  top="50%"
                                  transform="translateY(-50%)"
                                  h={4}
                                  w={1}
                                  bg="brand.500"
                                />
                              )}
                              <Box
                                flexShrink={0}
                                p={1.5}
                                borderRadius="md"
                                color={isActive ? "brand.500" : "gray.400"}
                                className={isActive ? "dark:text-brand-500" : "dark:text-gray-400"}
                              >
                                {item.icon}
                              </Box>
                              <Text flex={1}>{item.label}</Text>
                            </Flex>
                          </Link>
                        )}
                        {hasSubItems && !isCollapsed && (
                          <IconButton
                            aria-label={`${item.label} ${isOpen ? "schließen" : "öffnen"}`}
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleDropdown(item.id);
                            }}
                          >
                            <ChevronDown size={16} style={{ transform: isOpen ? "rotate(180deg)" : "none" }} />
                          </IconButton>
                        )}
                      </Flex>
                      {hasSubItems && !isCollapsed && (
                        <CollapsibleRoot open={isOpen}>
                          <CollapsibleContent>
                            <Box ml={4} borderLeftWidth="2px" borderColor="gray.200" className="dark:border-gray-700" pl={4} pt={1}>
                              <VStack gap={0.5} align="stretch">
                                {item.subItems!.map((subItem) => {
                                  const isSubActive = isSubItemActive(subItem.href);
                                  return (
                                    <Link
                                      key={subItem.href}
                                      href={subItem.href}
                                      onClick={() => {
                                  if (isMobile && setIsMobileOpen) {
                                    setIsMobileOpen(false);
                                  }
                                }}
                                    >
                                      <Box
                                        px={3}
                                        py={2}
                                        borderRadius="md"
                                        fontSize="sm"
                                        fontWeight="medium"
                                        bg={isSubActive ? "gray.50" : "transparent"}
                                        color={isSubActive ? "gray.900" : "gray.600"}
                                        className={`${isSubActive ? "dark:bg-gray-800 dark:text-gray-100" : "dark:bg-transparent dark:text-gray-400"} dark:hover:bg-gray-800 dark:hover:text-gray-100`}
                                        _hover={{ bg: "gray.50", color: "gray.900" }}
                                      >
                                        <Text>{subItem.label}</Text>
                                        {subItem.description && (
                                          <Text fontSize="xs" fontWeight="normal" color="gray.500" className="dark:text-gray-400" mt={0.5}>
                                            {subItem.description}
                                          </Text>
                                        )}
                                      </Box>
                                    </Link>
                                  );
                                })}
                              </VStack>
                            </Box>
                          </CollapsibleContent>
                        </CollapsibleRoot>
                      )}
                    </Box>
                  );
                })}
              </VStack>
              {isCollapsed && <Separator my={5} mx="auto" w={6} />}
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Footer - User Menu */}
      <Box borderTopWidth="1px" borderColor="gray.200" className="dark:border-gray-700 dark:bg-gray-900" p={3} bg="white">
        {!isCollapsed ? (
          <MenuRoot>
            <MenuTrigger asChild>
              <Button w="100%" variant="ghost">
                <Flex align="center" gap={3} w="100%">
                  <Box position="relative">
                    <Box
                      h={10}
                      w={10}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="full"
                      bg="brand.500"
                      color="white"
                      fontSize="sm"
                      fontWeight="bold"
                    >
                      {session.user?.name
                        ? session.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)
                        : "U"}
                    </Box>
                    <Box
                      position="absolute"
                      bottom={0}
                      right={0}
                      h={3}
                      w={3}
                      borderRadius="full"
                      borderWidth="2px"
                      borderColor="white"
                      bg="green.500"
                    />
                  </Box>
                  <VStack align="flex-start" gap={0} flex={1}>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.900" className="dark:text-gray-100">
                      {session.user?.name || "Benutzer"}
                    </Text>
                    <Text fontSize="xs" color="gray.500" className="dark:text-gray-400" truncate>
                      {session.user?.email || ""}
                    </Text>
                  </VStack>
                  <ChevronDown size={12} />
                </Flex>
              </Button>
            </MenuTrigger>
            <MenuPositioner>
              <MenuContent>
                <MenuItem value="settings" asChild>
                  <Link href="/dashboard/settings">
                    <Settings size={16} />
                    Einstellungen
                  </Link>
                </MenuItem>
                <MenuItem value="home" asChild>
                  <Link href="/">
                    <Home size={16} />
                    Zur Startseite
                  </Link>
                </MenuItem>
                <MenuSeparator />
                <MenuItem value="logout" onClick={handleLogout} color="red.600">
                  <LogOut size={16} />
                  Abmelden
                </MenuItem>
              </MenuContent>
            </MenuPositioner>
          </MenuRoot>
        ) : (
          <TooltipRoot openDelay={300}>
            <TooltipTrigger asChild>
              <MenuRoot>
                <MenuTrigger asChild>
                  <IconButton
                    aria-label="Benutzermenü"
                    variant="ghost"
                    w="100%"
                  >
                    <Box position="relative">
                      <Box
                        h={9}
                        w={9}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="full"
                        bg="brand.500"
                        color="white"
                        fontSize="xs"
                        fontWeight="bold"
                      >
                        {session.user?.name
                          ? session.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)
                          : "U"}
                      </Box>
                      <Box
                        position="absolute"
                        bottom={0}
                        right={0}
                        h={2.5}
                        w={2.5}
                        borderRadius="full"
                        borderWidth="2px"
                        borderColor="white"
                        bg="green.500"
                      />
                    </Box>
                  </IconButton>
                </MenuTrigger>
                <MenuPositioner>
                  <MenuContent>
                    <Box px={3} py={2} borderBottomWidth="1px" borderColor="gray.200" className="dark:border-gray-700">
                      <Text fontSize="sm" fontWeight="semibold" color="gray.900" className="dark:text-gray-100">
                        {session.user?.name || "Benutzer"}
                      </Text>
                      <Text fontSize="xs" color="gray.500" className="dark:text-gray-400" truncate>
                        {session.user?.email || ""}
                      </Text>
                    </Box>
                    <MenuItem value="settings" asChild>
                      <Link href="/dashboard/settings">
                        <Settings size={16} />
                        Einstellungen
                      </Link>
                    </MenuItem>
                    <MenuItem value="home" asChild>
                      <Link href="/">
                        <Home size={16} />
                        Zur Startseite
                      </Link>
                    </MenuItem>
                    <MenuSeparator />
                    <MenuItem value="logout" onClick={handleLogout} color="red.600">
                      <LogOut size={16} />
                      Abmelden
                    </MenuItem>
                  </MenuContent>
                </MenuPositioner>
              </MenuRoot>
            </TooltipTrigger>
            <TooltipPositioner>
              <TooltipContent>{session.user?.name || "Benutzer"}</TooltipContent>
            </TooltipPositioner>
          </TooltipRoot>
        )}
      </Box>
    </VStack>
  );
}
