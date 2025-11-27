"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  IconButton,
  Button,
  Badge,
  PopoverRoot,
  PopoverTrigger,
  PopoverPositioner,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import {
  AlertTriangle,
  Bell,
  BellRing,
  CheckCircle2,
  Info,
  Trash2,
  XCircle,
} from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
  actionUrl?: string;
};

type NotificationsProps = {
  initialNotifications?: Notification[];
  initialUnreadCount?: number;
};

const iconComponents = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
} as const;

const toneColors = {
  success: { bg: "emerald.50", color: "emerald.600", ring: "emerald.100" },
  warning: { bg: "amber.50", color: "amber.600", ring: "amber.100" },
  error: { bg: "red.50", color: "red.600", ring: "red.100" },
  info: { bg: "blue.50", color: "blue.600", ring: "blue.100" },
} as const;

export default function Notifications({
  initialNotifications = [],
  initialUnreadCount = 0,
}: NotificationsProps) {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  useEffect(() => {
    setUnreadCount(initialUnreadCount);
  }, [initialUnreadCount]);

  const syncNotifications = async (options: { silent?: boolean } = {}) => {
    if (!session?.user?.id) return;

    if (!options.silent) {
      setIsLoading(true);
    }
    try {
      const response = await fetch("/api/dashboard/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      if (!options.silent) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!session?.user?.id) return;
    syncNotifications({ silent: true });
    const interval = setInterval(() => syncNotifications({ silent: true }), 30000);
    return () => clearInterval(interval);
  }, [session]);

  useEffect(() => {
    if (isOpen) {
      void syncNotifications();
    }
  }, [isOpen]);

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/dashboard/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/dashboard/notifications/read-all", {
        method: "POST",
      });

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/dashboard/notifications/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotifications((prev) => {
          let removedUnread = false;
          const next = prev.filter((n) => {
            if (n.id === id && !n.read) {
              removedUnread = true;
            }
            return n.id !== id;
          });
          if (removedUnread) {
            setUnreadCount((prevCount) => Math.max(0, prevCount - 1));
          }
          return next;
        });
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <PopoverRoot open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
      <PopoverTrigger asChild>
        <Box position="relative">
          <IconButton
            aria-label="Benachrichtigungen öffnen"
            size="sm"
            variant="outline"
            borderRadius="md"
            borderWidth="1px"
            borderColor="gray.200"
            className="dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-700"
            bg="white"
            color="gray.600"
            _hover={{ borderColor: "gray.300", bg: "gray.50" }}
          >
            <Bell size={14} />
          </IconButton>
          {unreadCount > 0 && (
            <Badge
              position="absolute"
              top="-2px"
              right="-2px"
              minW="1rem"
              h="1rem"
              borderRadius="full"
              bg="brand.500"
              color="white"
              fontSize="2xs"
              fontWeight="bold"
              display="flex"
              alignItems="center"
              justifyContent="center"
              px={0.5}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Box>
      </PopoverTrigger>
      <PopoverPositioner>
          <PopoverContent w="30rem" maxH="96" overflow="hidden" borderRadius="2xl" borderWidth="1px" borderColor="gray.200" className="dark:border-gray-700 dark:bg-gray-900" bg="white" shadow="xl">
          <PopoverHeader borderBottomWidth="1px" borderColor="gray.200" className="dark:border-gray-700 dark:bg-gray-800" bg="white" px={6} py={4}>
            <Flex align="center" justify="space-between">
              <Flex align="center" gap={3}>
                <Box
                  h={10}
                  w={10}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="xl"
                  bg="brand.500"
                  opacity={0.1}
                  borderWidth="1px"
                  borderColor="brand.500"
                  style={{ borderColor: "rgba(226, 0, 26, 0.15)" }}
                >
                  <BellRing size={20} color="#e2001a" />
                </Box>
                <VStack align="flex-start" gap={0}>
                  <Text fontSize="base" fontWeight="bold" color="gray.900" className="dark:text-gray-100">
                    Benachrichtigungen
                  </Text>
                  <Text fontSize="xs" fontWeight="medium" color="gray.500" className="dark:text-gray-400">
                    {unreadCount > 0 ? `${unreadCount} ungelesen` : "Alles gelesen"}
                  </Text>
                </VStack>
              </Flex>
              <HStack gap={2}>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => syncNotifications()}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="gray.200"
                  className="dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-100"
                  color="gray.600"
                  _hover={{ borderColor: "gray.300", color: "gray.900" }}
                >
                  Aktualisieren
                </Button>
                {unreadCount > 0 && (
                  <Button
                    size="xs"
                    onClick={markAllAsRead}
                    borderRadius="lg"
                  bg="brand.500"
                  opacity={0.1}
                  className="dark:opacity-20 dark:hover:opacity-25"
                  color="brand.500"
                  _hover={{ opacity: 0.15 }}
                  >
                    Alle lesen
                  </Button>
                )}
              </HStack>
            </Flex>
          </PopoverHeader>
          <PopoverBody maxH="96" overflowY="auto" p={0}>
            {isLoading ? (
              <VStack gap={4} px={6} py={6}>
                {[0, 1, 2].map((item) => (
                  <Flex key={item} gap={3}>
                    <Skeleton h={10} w={10} borderRadius="xl" />
                    <VStack align="flex-start" gap={2} flex={1}>
                      <SkeletonText w="2/3" />
                      <SkeletonText w="full" />
                      <SkeletonText w="1/2" />
                    </VStack>
                  </Flex>
                ))}
              </VStack>
            ) : notifications.length === 0 ? (
              <VStack gap={4} px={6} py={12} textAlign="center">
                <Box
                  h={12}
                  w={12}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="full"
                  bg="gray.100"
                  className="dark:bg-gray-700 dark:text-gray-500"
                  color="gray.400"
                >
                  <Bell size={24} />
                </Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.500" className="dark:text-gray-400">
                  Keine Benachrichtigungen
                </Text>
                <Text fontSize="xs" color="gray.400" className="dark:text-gray-500">
                  Wir benachrichtigen dich, sobald etwas passiert.
                </Text>
              </VStack>
            ) : (
              <VStack gap={0} align="stretch">
                {notifications.map((notification) => {
                  const Icon = iconComponents[notification.type];
                  const tone = toneColors[notification.type];
                  return (
                    <Box
                      key={notification.id}
                      px={6}
                      py={4}
                      bg={!notification.read ? "gray.50" : "transparent"}
                      className={`${!notification.read ? "dark:bg-gray-800/50" : ""} dark:hover:bg-gray-800/50`}
                      _hover={{ bg: "gray.50" }}
                    >
                      <Flex align="flex-start" gap={3}>
                        <Box
                          h={11}
                          w={11}
                          flexShrink={0}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          borderRadius="2xl"
                          borderWidth="1px"
                          bg={tone.bg}
                          color={tone.color}
                          borderColor={tone.ring}
                        >
                          <Icon size={20} />
                        </Box>
                        <VStack align="flex-start" gap={1} flex={1} minW={0}>
                          <Flex align="flex-start" justify="space-between" gap={2} w="100%">
                            <VStack align="flex-start" gap={1}>
                              <Text
                                fontSize="sm"
                                fontWeight="semibold"
                                color={!notification.read ? "gray.900" : "gray.700"}
                                className={`${!notification.read ? "dark:text-gray-100" : "dark:text-gray-300"}`}
                              >
                                {notification.title}
                              </Text>
                              <Text fontSize="xs" color="gray.500" className="dark:text-gray-400">
                                {notification.message}
                              </Text>
                            </VStack>
                            {!notification.read && (
                              <Box
                                h={2}
                                w={2}
                                flexShrink={0}
                                borderRadius="full"
                                bg="brand.500"
                                mt={1}
                              />
                            )}
                          </Flex>
                          <HStack gap={3} mt={3} fontSize="xs" color="gray.400" className="dark:text-gray-500" w="100%">
                            <Text>
                              {new Date(notification.createdAt).toLocaleString("de-DE")}
                            </Text>
                            <HStack gap={2} ml="auto">
                              {notification.actionUrl && (
                                <Link
                                  href={notification.actionUrl}
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Text fontWeight="semibold" color="brand.500" _hover={{ color: "brand.600" }}>
                                    Öffnen
                                  </Text>
                                </Link>
                              )}
                              {!notification.read && (
                                <Button
                                  size="xs"
                                  variant="ghost"
                                  onClick={() => markAsRead(notification.id)}
                                  color="gray.500"
                                  className="dark:text-gray-400 dark:hover:text-gray-100"
                                  _hover={{ color: "gray.900" }}
                                >
                                  Gelesen
                                </Button>
                              )}
                              <IconButton
                                size="xs"
                                variant="ghost"
                                aria-label="Benachrichtigung löschen"
                                onClick={() => deleteNotification(notification.id)}
                                color="gray.400"
                                className="dark:text-gray-500"
                                _hover={{ color: "red.500" }}
                              >
                                <Trash2 size={16} />
                              </IconButton>
                            </HStack>
                          </HStack>
                        </VStack>
                      </Flex>
                    </Box>
                  );
                })}
              </VStack>
            )}
          </PopoverBody>
        </PopoverContent>
      </PopoverPositioner>
    </PopoverRoot>
  );
}
