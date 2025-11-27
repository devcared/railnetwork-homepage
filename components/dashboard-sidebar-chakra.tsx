"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import Image from "next/image";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  IconButton,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
  Collapse,
  useColorModeValue,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  Badge,
} from "@chakra-ui/react";
import {
  ChevronLeft,
  ChevronRight,
  Menu as MenuIcon,
  X,
  User,
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
  const { isOpen: isMobileOpen, onOpen: onMobileOpen, onClose: onMobileClose } = useDisclosure();

  const bgColor = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const activeBg = useColorModeValue("gray.50", "gray.800");
  const activeText = useColorModeValue("gray.900", "gray.100");
  const hoverBg = useColorModeValue("gray.50", "gray.800");

  const handleToggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  };

  const handleLogout = () => {
    void signOut({ callbackUrl: "/" });
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

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <VStack h="100%" spacing={0} align="stretch">
      {/* Header */}
      <Box borderBottom="1px" borderColor={borderColor} px={4} py={4} bg={bgColor}>
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
              icon={isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              size="sm"
              variant="ghost"
              onClick={handleToggleCollapse}
            />
          )}
        </Flex>
      </Box>

      {/* Navigation */}
      <Box flex="1" overflowY="auto" px={2} py={6}>
        <VStack spacing={8} align="stretch">
          {navSections.map((section) => (
            <Box key={section.title}>
              {!isCollapsed && (
                <Box px={4} pb={3}>
                  <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" color={textColor}>
                    {section.title}
                  </Text>
                  {section.subtitle && (
                    <Text fontSize="2xs" color={textColor} mt={0.5}>
                      {section.subtitle}
                    </Text>
                  )}
                </Box>
              )}
              <VStack spacing={0.5} align="stretch">
                {section.items.map((item) => {
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isActive = isItemActive(item);
                  const isOpen = openDropdowns.has(item.id);

                  return (
                    <Box key={item.id}>
                      <Flex align="center">
                        {isCollapsed ? (
                          <Tooltip label={item.label} placement="right" hasArrow>
                            <Link
                              href={item.href}
                              onClick={() => isMobile && onMobileClose()}
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
                                bg={isActive ? activeBg : "transparent"}
                                color={isActive ? activeText : textColor}
                                _hover={{ bg: hoverBg, color: activeText }}
                              >
                                <Box
                                  flexShrink={0}
                                  p={1.5}
                                  borderRadius="md"
                                  color={isActive ? "brand.500" : textColor}
                                >
                                  {item.icon}
                                </Box>
                              </Flex>
                            </Link>
                          </Tooltip>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={() => isMobile && onMobileClose()}
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
                              bg={isActive ? activeBg : "transparent"}
                              color={isActive ? activeText : textColor}
                              _hover={{ bg: hoverBg, color: activeText }}
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
                                color={isActive ? "brand.500" : textColor}
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
                            icon={<ChevronDown size={16} style={{ transform: isOpen ? "rotate(180deg)" : "none" }} />}
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleDropdown(item.id);
                            }}
                          />
                        )}
                      </Flex>
                      {hasSubItems && !isCollapsed && (
                        <Collapse in={isOpen} animateOpacity>
                          <Box ml={4} borderLeft="2px" borderColor={borderColor} pl={4} pt={1}>
                            <VStack spacing={0.5} align="stretch">
                              {item.subItems!.map((subItem) => {
                                const isSubActive = isSubItemActive(subItem.href);
                                return (
                                  <Link
                                    key={subItem.href}
                                    href={subItem.href}
                                    onClick={() => isMobile && onMobileClose()}
                                  >
                                    <Box
                                      px={3}
                                      py={2}
                                      borderRadius="md"
                                      fontSize="sm"
                                      fontWeight="medium"
                                      bg={isSubActive ? activeBg : "transparent"}
                                      color={isSubActive ? activeText : textColor}
                                      _hover={{ bg: hoverBg, color: activeText }}
                                    >
                                      <Text>{subItem.label}</Text>
                                      {subItem.description && (
                                        <Text fontSize="xs" fontWeight="normal" color={textColor} mt={0.5}>
                                          {subItem.description}
                                        </Text>
                                      )}
                                    </Box>
                                  </Link>
                                );
                              })}
                            </VStack>
                          </Box>
                        </Collapse>
                      )}
                    </Box>
                  );
                })}
              </VStack>
              {isCollapsed && <Divider my={5} mx="auto" w={6} />}
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Footer - User Menu */}
      <Box borderTop="1px" borderColor={borderColor} p={3} bg={bgColor}>
        {!isCollapsed ? (
          <Menu>
            <MenuButton
              as={Button}
              w="100%"
              variant="ghost"
              leftIcon={
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
                    border="2px"
                    borderColor="white"
                    bg="green.500"
                  />
                </Box>
              }
              rightIcon={<ChevronDown size={12} />}
            >
              <VStack align="flex-start" spacing={0} flex={1}>
                <Text fontSize="sm" fontWeight="semibold" color={activeText}>
                  {session.user?.name || "Benutzer"}
                </Text>
                <Text fontSize="xs" color={textColor} isTruncated>
                  {session.user?.email || ""}
                </Text>
              </VStack>
            </MenuButton>
            <MenuList>
              <MenuItem icon={<Settings size={16} />} as={Link} href="/dashboard/settings">
                Einstellungen
              </MenuItem>
              <MenuItem icon={<Home size={16} />} as={Link} href="/">
                Zur Startseite
              </MenuItem>
              <Divider />
              <MenuItem icon={<LogOut size={16} />} onClick={handleLogout} color="red.600">
                Abmelden
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <Tooltip label={session.user?.name || "Benutzer"} placement="right">
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Benutzermenü"
                icon={
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
                      border="2px"
                      borderColor="white"
                      bg="green.500"
                    />
                  </Box>
                }
                variant="ghost"
                w="100%"
              />
              <MenuList>
                <Box px={3} py={2} borderBottom="1px" borderColor={borderColor}>
                  <Text fontSize="sm" fontWeight="semibold" color={activeText}>
                    {session.user?.name || "Benutzer"}
                  </Text>
                  <Text fontSize="xs" color={textColor} isTruncated>
                    {session.user?.email || ""}
                  </Text>
                </Box>
                <MenuItem icon={<Settings size={16} />} as={Link} href="/dashboard/settings">
                  Einstellungen
                </MenuItem>
                <MenuItem icon={<Home size={16} />} as={Link} href="/">
                  Zur Startseite
                </MenuItem>
                <Divider />
                <MenuItem icon={<LogOut size={16} />} onClick={handleLogout} color="red.600">
                  Abmelden
                </MenuItem>
              </MenuList>
            </Menu>
          </Tooltip>
        )}
      </Box>
    </VStack>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <IconButton
        aria-label="Menü öffnen"
        icon={isMobileOpen ? <X size={16} /> : <MenuIcon size={16} />}
        position="fixed"
        top={4}
        left={4}
        zIndex={50}
        display={{ base: "flex", lg: "none" }}
        onClick={onMobileOpen}
        borderRadius="full"
        border="1px"
        borderColor={borderColor}
        bg={bgColor}
        color={textColor}
      />

      {/* Desktop Sidebar */}
      <Box
        as="aside"
        position="fixed"
        insetY={0}
        left={0}
        zIndex={40}
        borderRight="1px"
        borderColor={borderColor}
        bg={bgColor}
        w={{ base: "full", lg: isCollapsed ? "80px" : "288px" }}
        transition="width 0.3s ease"
        overflow={isCollapsed ? "visible" : "auto"}
        display={{ base: "none", lg: "block" }}
      >
        <SidebarContent />
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isMobileOpen} placement="left" onClose={onMobileClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody p={0}>
            <SidebarContent isMobile />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

