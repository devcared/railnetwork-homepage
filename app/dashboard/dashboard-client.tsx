"use client";

import React, { useState, useMemo } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { useDashboard } from "@/hooks/useDashboard";
import { useAppVersion } from "@/hooks/useAppVersion";
import Notifications from "@/components/notifications";
import Breadcrumbs from "@/components/breadcrumbs";
import ThemeToggle from "@/components/theme-toggle";
import Sheet, {
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/sheet";
import type { Project } from "@/lib/models";
import Link from "next/link";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  ProgressRoot,
  ProgressTrack,
  ProgressRange,
  SimpleGrid,
  CardRoot,
  CardHeader,
  CardBody,
  Input,
  Textarea,
  Spinner,
  Center,
  Grid,
  GridItem,
  TableRoot,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
  TableColumnHeader,
} from "@chakra-ui/react";
import {
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FolderKanban,
  Activity as ActivityIcon,
  BarChart3,
  Cpu,
  HardDrive,
  Network,
  ChevronRight,
  Eye,
  Edit,
  Info,
} from "lucide-react";

type DashboardClientProps = {
  session: Session;
};

type FilterType = "all" | "active" | "completed" | "archived";
type SortType = "name" | "progress" | "updated" | "created";

export default function DashboardClient({ session }: DashboardClientProps) {
  const {
    loading,
    stats,
    metrics,
    activities,
    projects,
    alerts,
    notifications,
    unreadCount,
    actions,
    refresh,
  } = useDashboard({ session });

  const { currentVersion } = useAppVersion();

  // State Management
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  
  // Filter & Search
  const [projectFilter, setProjectFilter] = useState<FilterType>("all");
  const [projectSort, setProjectSort] = useState<SortType>("updated");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  
  // Alert Filters
  const [alertFilter, setAlertFilter] = useState<"all" | "open" | "acknowledged" | "resolved">("all");
  const [alertSeverityFilter, setAlertSeverityFilter] = useState<"all" | "critical" | "high" | "medium" | "low">("all");
  const [alertSearchQuery, setAlertSearchQuery] = useState("");

  // Filtered & Sorted Projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects;

    // Apply filter
    if (projectFilter !== "all") {
      filtered = filtered.filter((p) => p.status === projectFilter);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
      switch (projectSort) {
        case "name":
          return a.name.localeCompare(b.name);
        case "progress":
          return b.progress - a.progress;
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "updated":
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    return sorted;
  }, [projects, projectFilter, projectSort, searchQuery]);

  // Alert Statistics
  const alertStats = useMemo(() => {
    const critical = alerts.filter((a) => a.severity === "critical" && a.status === "open").length;
    const high = alerts.filter((a) => a.severity === "high" && a.status === "open").length;
    const medium = alerts.filter((a) => a.severity === "medium" && a.status === "open").length;
    const low = alerts.filter((a) => a.severity === "low" && a.status === "open").length;
    const open = alerts.filter((a) => a.status === "open").length;
    const acknowledged = alerts.filter((a) => a.status === "acknowledged").length;
    const resolved = alerts.filter((a) => a.status === "resolved").length;
    return { critical, high, medium, low, open, acknowledged, resolved };
  }, [alerts]);

  // Filtered Alerts
  const filteredAlerts = useMemo(() => {
    let filtered = alerts;

    // Apply status filter
    if (alertFilter !== "all") {
      filtered = filtered.filter((a) => a.status === alertFilter);
    }

    // Apply severity filter
    if (alertSeverityFilter !== "all") {
      filtered = filtered.filter((a) => a.severity === alertSeverityFilter);
    }

    // Apply search
    if (alertSearchQuery.trim()) {
      const query = alertSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.message.toLowerCase().includes(query) ||
          a.system.toLowerCase().includes(query)
      );
    }

    // Sort by severity and date
    return [...filtered].sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const severityDiff = (severityOrder[b.severity as keyof typeof severityOrder] || 0) - (severityOrder[a.severity as keyof typeof severityOrder] || 0);
      if (severityDiff !== 0) return severityDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [alerts, alertFilter, alertSeverityFilter, alertSearchQuery]);

  // Activity Statistics
  const activityStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayActivities = activities.filter(
      (a) => new Date(a.timestamp) >= today
    );
    return {
      today: todayActivities.length,
      success: todayActivities.filter((a) => a.status === "success").length,
      warning: todayActivities.filter((a) => a.status === "warning").length,
      error: todayActivities.filter((a) => a.status === "error").length,
    };
  }, [activities]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      await actions.createProject({
        name: newProjectName,
        description: newProjectDescription || undefined,
        status: "active",
      });
      setNewProjectName("");
      setNewProjectDescription("");
      setShowCreateProject(false);
      await refresh.projects();
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const formatTime = (timestamp: Date | string) => {
    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Gerade eben";
    if (minutes < 60) return `Vor ${minutes} Min`;
    if (hours < 24) return `Vor ${hours} Std`;
    return `Vor ${days} Tag${days > 1 ? "en" : ""}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return { bg: "green.100", color: "green.700", darkBg: "green.900/30", darkColor: "green.400" };
      case "completed":
        return { bg: "blue.100", color: "blue.700", darkBg: "blue.900/30", darkColor: "blue.400" };
      case "archived":
        return { bg: "gray.100", color: "gray.700", darkBg: "gray.800", darkColor: "gray.300" };
      default:
        return { bg: "amber.100", color: "amber.700", darkBg: "amber.900/30", darkColor: "amber.400" };
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return { bg: "red.100", color: "red.700", darkBg: "red.900/30", darkColor: "red.400" };
      case "high":
        return { bg: "orange.100", color: "orange.700", darkBg: "orange.900/30", darkColor: "orange.400" };
      case "medium":
        return { bg: "amber.100", color: "amber.700", darkBg: "amber.900/30", darkColor: "amber.400" };
      default:
        return { bg: "blue.100", color: "blue.700", darkBg: "blue.900/30", darkColor: "blue.400" };
    }
  };

  if (loading) {
    return (
      <Center minH="100vh">
        <VStack gap={4}>
          <Spinner size="xl" color="brand.500" />
          <Text fontSize="sm" color="gray.600" className="dark:text-gray-400">
            Lade Dashboard...
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <SessionProvider session={session}>
      <Box minH="100vh" bg="white" className="dark:bg-gray-950">
        {/* Header */}
        <Box
          as="header"
          position="sticky"
          top={0}
          zIndex={30}
          borderBottomWidth="1px"
          borderColor="gray.200"
          className="dark:border-gray-700/60 dark:bg-gray-900"
          bg="white"
        >
          <Box px={{ base: 6, lg: 8 }} py={4}>
            <Flex align="center" justify="space-between" gap={4}>
              <Breadcrumbs />
              <HStack gap={2}>
                {currentVersion && (
                  <Badge
                    display={{ base: "none", sm: "flex" }}
                    borderRadius="md"
                    px={2}
                    py={1}
                    fontSize="xs"
                    fontWeight="medium"
                    bg="emerald.50"
                    className="dark:bg-emerald-900/20 dark:text-emerald-400"
                    color="emerald.700"
                  >
                    <HStack gap={1}>
                      <Box h={1.5} w={1.5} borderRadius="full" bg="emerald.500" className="dark:bg-emerald-400" />
                      <Text>v{currentVersion.substring(0, 8)}</Text>
                    </HStack>
                  </Badge>
                )}
                <ThemeToggle />
                <Notifications
                  initialNotifications={notifications.map((n) => ({
                    ...n,
                    createdAt: typeof n.createdAt === "string" ? n.createdAt : n.createdAt.toISOString(),
                  }))}
                  initialUnreadCount={unreadCount}
                />
                <Button
                  size="sm"
                  onClick={() => setShowCreateProject(true)}
                  bg="brand.500"
                  color="white"
                  _hover={{ bg: "brand.600" }}
                  borderRadius="md"
                >
                  <HStack gap={1.5}>
                    <Plus size={14} />
                    <Text display={{ base: "none", sm: "block" }}>Neues Projekt</Text>
                  </HStack>
                </Button>
              </HStack>
            </Flex>
          </Box>
        </Box>

        {/* Main Content */}
        <Box px={{ base: 4, md: 6, lg: 8 }} py={{ base: 4, md: 6, lg: 8 }}>
          <Box mx="auto" maxW="7xl">
            <VStack gap={5} align="stretch">
              {/* Tab Navigation */}
              <HStack gap={2} borderBottomWidth="1px" borderColor="gray.200" className="dark:border-gray-700/60">
                {[
                  { id: "overview", label: "Übersicht" },
                  { id: "projects", label: "Projekte" },
                  { id: "alerts", label: "Alerts" },
                  { id: "activities", label: "Aktivitäten" },
                ].map((tab) => (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab(tab.id)}
                    borderRadius="none"
                    borderBottomWidth="2px"
                    borderColor={activeTab === tab.id ? "brand.500" : "transparent"}
                    color={activeTab === tab.id ? "brand.500" : "gray.600"}
                    className={activeTab === tab.id ? "dark:text-brand-400" : "dark:text-gray-400 dark:hover:bg-gray-800"}
                    _hover={{ bg: "gray.50" }}
                    px={4}
                    py={2}
                  >
                    {tab.label}
                  </Button>
                ))}
              </HStack>

              {/* Overview Tab */}
              {activeTab === "overview" && (
                <VStack gap={5} align="stretch">
                  {/* Key Metrics */}
                  <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
                    <CardRoot borderRadius="xl" borderWidth="1px" borderColor="gray.200" className="dark:border-gray-700/60 dark:bg-gray-900" bg="white" shadow="sm">
                      <CardBody p={4}>
                        <VStack align="flex-start" gap={2.5}>
                          <HStack justify="space-between" w="100%">
                            <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="gray.500" className="dark:text-gray-400">
                              Aktive Projekte
                            </Text>
                            <Box
                              h={10}
                              w={10}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              borderRadius="lg"
                              bg="brand.500"
                              opacity={0.1}
                            >
                              <FolderKanban size={20} color="#e2001a" />
                            </Box>
                          </HStack>
                          <Text fontSize="3xl" fontWeight="bold" color="gray.900" className="dark:text-gray-100">
                            {stats?.activeProjects || 0}
                          </Text>
                          <HStack gap={2}>
                            <Badge borderRadius="full" px={2} py={0.5} fontSize="xs" bg="green.50" className="dark:bg-green-900/20 dark:text-green-400" color="green.700">
                              <HStack gap={1}>
                                <TrendingUp size={12} />
                                <Text>+{projects.filter((p) => p.status === "active").length}</Text>
                              </HStack>
                            </Badge>
                            <Text fontSize="xs" color="gray.500" className="dark:text-gray-400">
                              Diese Woche
                            </Text>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </CardRoot>

                    <CardRoot borderRadius="xl" borderWidth="1px" borderColor="gray.200" className="dark:border-gray-700/60 dark:bg-gray-900" bg="white" shadow="sm">
                      <CardBody p={4}>
                        <VStack align="flex-start" gap={2.5}>
                          <HStack justify="space-between" w="100%">
                            <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="gray.500" className="dark:text-gray-400">
                              Offene Alerts
                            </Text>
                            <Box
                              h={10}
                              w={10}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              borderRadius="lg"
                              bg="red.500"
                              opacity={0.1}
                            >
                              <AlertTriangle size={20} color="#ef4444" />
                            </Box>
                          </HStack>
                          <Text fontSize="3xl" fontWeight="bold" color="gray.900" className="dark:text-gray-100">
                            {alertStats.open}
                          </Text>
                          <HStack gap={2}>
                            {alertStats.critical > 0 && (
                              <Badge borderRadius="full" px={2} py={0.5} fontSize="xs" bg="red.50" className="dark:bg-red-900/20 dark:text-red-400" color="red.700">
                                {alertStats.critical} Kritisch
                              </Badge>
                            )}
                            {alertStats.high > 0 && (
                              <Badge borderRadius="full" px={2} py={0.5} fontSize="xs" bg="orange.50" className="dark:bg-orange-900/20 dark:text-orange-400" color="orange.700">
                                {alertStats.high} Hoch
                              </Badge>
                            )}
                          </HStack>
                        </VStack>
                      </CardBody>
                    </CardRoot>

                    <CardRoot borderRadius="xl" borderWidth="1px" borderColor="gray.200" className="dark:border-gray-700/60 dark:bg-gray-900" bg="white" shadow="sm">
                      <CardBody p={4}>
                        <VStack align="flex-start" gap={2.5}>
                          <HStack justify="space-between" w="100%">
                            <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="gray.500" className="dark:text-gray-400">
                              Aktivitäten heute
                            </Text>
                            <Box
                              h={10}
                              w={10}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              borderRadius="lg"
                              bg="blue.500"
                              opacity={0.1}
                            >
                              <ActivityIcon size={20} color="#3b82f6" />
                            </Box>
                          </HStack>
                          <Text fontSize="3xl" fontWeight="bold" color="gray.900" className="dark:text-gray-100">
                            {activityStats.today}
                          </Text>
                          <HStack gap={2} flexWrap="wrap">
                            <Badge borderRadius="full" px={2} py={0.5} fontSize="xs" bg="green.50" className="dark:bg-green-900/20 dark:text-green-400" color="green.700">
                              {activityStats.success} Erfolg
                            </Badge>
                            {activityStats.warning > 0 && (
                              <Badge borderRadius="full" px={2} py={0.5} fontSize="xs" bg="amber.50" className="dark:bg-amber-900/20 dark:text-amber-400" color="amber.700">
                                {activityStats.warning} Warnung
                              </Badge>
                            )}
                            {activityStats.error > 0 && (
                              <Badge borderRadius="full" px={2} py={0.5} fontSize="xs" bg="red.50" className="dark:bg-red-900/20 dark:text-red-400" color="red.700">
                                {activityStats.error} Fehler
                              </Badge>
                            )}
                          </HStack>
                        </VStack>
                      </CardBody>
                    </CardRoot>

                    <CardRoot borderRadius="xl" borderWidth="1px" borderColor="gray.200" className="dark:border-gray-700/60 dark:bg-gray-900" bg="white" shadow="sm">
                      <CardBody p={4}>
                        <VStack align="flex-start" gap={2.5}>
                          <HStack justify="space-between" w="100%">
                            <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="gray.500" className="dark:text-gray-400">
                              System-Status
                            </Text>
                            <Box
                              h={10}
                              w={10}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              borderRadius="lg"
                              bg="green.500"
                              opacity={0.1}
                            >
                              <CheckCircle2 size={20} color="#10b981" />
                            </Box>
                          </HStack>
                          <Text fontSize="3xl" fontWeight="bold" color="green.600" className="dark:text-green-400">
                            {stats?.systemStatus === "online" ? "Online" : "Offline"}
                          </Text>
                          <HStack gap={2}>
                            <Box h={2} w={2} borderRadius="full" bg="green.500" className="dark:bg-green-400" />
                            <Text fontSize="xs" color="gray.500" className="dark:text-gray-400">
                              Uptime: {stats?.uptime || 0}%
                            </Text>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </CardRoot>
                  </SimpleGrid>

                  {/* System Performance */}
                  <CardRoot borderRadius="xl" borderWidth="1px" borderColor="gray.200" className="dark:border-gray-700/60 dark:bg-gray-900" bg="white" shadow="sm">
                    <CardHeader borderBottomWidth="1px" borderColor="gray.200" className="dark:border-gray-700/60" px={5} py={3.5}>
                      <Flex align="center" justify="space-between">
                        <VStack align="flex-start" gap={1}>
                          <Text fontSize="lg" fontWeight="bold" color="gray.900" className="dark:text-gray-100">
                            System-Performance
                          </Text>
                          <Text fontSize="xs" color="gray.500" className="dark:text-gray-400">
                            Echtzeit-Metriken
                          </Text>
                        </VStack>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => refresh.stats()}
                        >
                          <HStack gap={1.5}>
                            <RefreshCw size={14} />
                            <Text>Aktualisieren</Text>
                          </HStack>
                        </Button>
                      </Flex>
                    </CardHeader>
                    <CardBody p={5}>
                      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={5}>
                        <VStack align="stretch" gap={2}>
                          <HStack justify="space-between">
                            <HStack gap={2}>
                              <Cpu size={16} color="#9ca3af" />
                              <Text fontSize="sm" fontWeight="semibold" color="gray.700" className="dark:text-gray-300">
                                CPU
                              </Text>
                            </HStack>
                            <Badge borderRadius="full" px={2} py={1} fontSize="sm" fontWeight="bold" bg="gray.100" className="dark:bg-gray-700 dark:text-gray-100" color="gray.900">
                              {metrics?.cpu || 0}%
                            </Badge>
                          </HStack>
                          <ProgressRoot value={metrics?.cpu || 0} borderRadius="full" h={2}>
                            <ProgressTrack bg="gray.200" className="dark:bg-gray-700" borderRadius="full">
                              <ProgressRange bg="brand.500" borderRadius="full" />
                            </ProgressTrack>
                          </ProgressRoot>
                        </VStack>

                        <VStack align="stretch" gap={2}>
                          <HStack justify="space-between">
                            <HStack gap={2}>
                              <HardDrive size={16} color="#9ca3af" />
                              <Text fontSize="sm" fontWeight="semibold" color="gray.700" className="dark:text-gray-300">
                                Speicher
                              </Text>
                            </HStack>
                            <Badge borderRadius="full" px={2} py={1} fontSize="sm" fontWeight="bold" bg="blue.100" className="dark:bg-blue-900/30 dark:text-blue-400" color="blue.700">
                              {metrics?.memory || 0}%
                            </Badge>
                          </HStack>
                          <ProgressRoot value={metrics?.memory || 0} borderRadius="full" h={2}>
                            <ProgressTrack bg="gray.200" className="dark:bg-gray-700" borderRadius="full">
                              <ProgressRange bg="blue.600" className="dark:bg-blue-500" borderRadius="full" />
                            </ProgressTrack>
                          </ProgressRoot>
                        </VStack>

                        <VStack align="stretch" gap={2}>
                          <HStack justify="space-between">
                            <HStack gap={2}>
                              <Network size={16} color="#9ca3af" />
                              <Text fontSize="sm" fontWeight="semibold" color="gray.700" className="dark:text-gray-300">
                                Netzwerk
                              </Text>
                            </HStack>
                            <Badge borderRadius="full" px={2} py={1} fontSize="sm" fontWeight="bold" bg="emerald.100" className="dark:bg-emerald-900/30 dark:text-emerald-400" color="emerald.700">
                              {metrics?.network || 0}%
                            </Badge>
                          </HStack>
                          <ProgressRoot value={metrics?.network || 0} borderRadius="full" h={2}>
                            <ProgressTrack bg="gray.200" className="dark:bg-gray-700" borderRadius="full">
                              <ProgressRange bg="emerald.600" className="dark:bg-emerald-500" borderRadius="full" />
                            </ProgressTrack>
                          </ProgressRoot>
                        </VStack>

                        <VStack align="stretch" gap={2}>
                          <HStack justify="space-between">
                            <HStack gap={2}>
                              <HardDrive size={16} color="#9ca3af" />
                              <Text fontSize="sm" fontWeight="semibold" color="gray.700" className="dark:text-gray-300">
                                Storage
                              </Text>
                            </HStack>
                            <Badge borderRadius="full" px={2} py={1} fontSize="sm" fontWeight="bold" bg="amber.100" className="dark:bg-amber-900/30 dark:text-amber-400" color="amber.700">
                              {metrics?.storage || 0}%
                            </Badge>
                          </HStack>
                          <ProgressRoot value={metrics?.storage || 0} borderRadius="full" h={2}>
                            <ProgressTrack bg="gray.200" className="dark:bg-gray-700" borderRadius="full">
                              <ProgressRange bg="amber.600" className="dark:bg-amber-500" borderRadius="full" />
                            </ProgressTrack>
                          </ProgressRoot>
                        </VStack>
                      </SimpleGrid>
                    </CardBody>
                  </CardRoot>

                  {/* Recent Projects & Alerts */}
                  <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={5}>
                    {/* Recent Projects */}
                    <CardRoot borderRadius="xl" borderWidth="1px" borderColor="gray.200" className="dark:border-gray-700/60 dark:bg-gray-900" bg="white" shadow="sm">
                      <CardHeader borderBottomWidth="1px" borderColor="gray.200" className="dark:border-gray-700/60" px={5} py={3.5}>
                        <Flex align="center" justify="space-between">
                          <VStack align="flex-start" gap={1}>
                            <Text fontSize="lg" fontWeight="bold" color="gray.900" className="dark:text-gray-100">
                              Aktuelle Projekte
                            </Text>
                            <Text fontSize="xs" color="gray.500" className="dark:text-gray-400">
                              {projects.length} Gesamt
                            </Text>
                          </VStack>
                          <Button
                            asChild
                            size="sm"
                            variant="ghost"
                          >
                            <Link href="/dashboard/projects">
                              <HStack gap={1.5}>
                                <Text>Alle anzeigen</Text>
                                <ChevronRight size={14} />
                              </HStack>
                            </Link>
                          </Button>
                        </Flex>
                      </CardHeader>
                      <CardBody p={0}>
                        {projects.length === 0 ? (
                          <Center px={6} py={12}>
                            <VStack gap={3}>
                              <Box
                                h={12}
                                w={12}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                borderRadius="full"
                                bg="gray.100"
                                className="dark:bg-gray-700"
                              >
                                <FolderKanban size={24} color="#9ca3af" />
                              </Box>
                              <Text fontSize="sm" fontWeight="medium" color="gray.500" className="dark:text-gray-400">
                                Noch keine Projekte
                              </Text>
                            </VStack>
                          </Center>
                        ) : (
                          <VStack gap={0} align="stretch">
                            {projects.slice(0, 5).map((project, index) => {
                              const statusColor = getStatusColor(project.status);
                              return (
                                <Box key={project.id}>
                                  {index > 0 && (
                                    <Box h="1px" bg="gray.200" className="dark:bg-gray-700/60" />
                                  )}
                                  <Box
                                    px={5}
                                    py={3.5}
                                    _hover={{ bg: "gray.50" }}
                                    className="dark:hover:bg-gray-800/50"
                                    cursor="pointer"
                                    onClick={() => {
                                      setSelectedProject(project);
                                      setShowProjectDetails(true);
                                    }}
                                  >
                                    <Flex align="center" justify="space-between" gap={4}>
                                      <VStack align="flex-start" gap={2} flex={1} minW={0}>
                                        <HStack gap={2} w="100%">
                                          <Text fontSize="sm" fontWeight="semibold" color="gray.900" className="dark:text-gray-100" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {project.name}
                                          </Text>
                                          <Badge
                                            borderRadius="full"
                                            px={2}
                                            py={0.5}
                                            fontSize="xs"
                                            fontWeight="semibold"
                                            bg={statusColor.bg}
                                            className={`dark:bg-${statusColor.darkBg} dark:text-${statusColor.darkColor}`}
                                            color={statusColor.color}
                                          >
                                            {project.status === "active" ? "Aktiv" : project.status === "completed" ? "Abgeschlossen" : project.status}
                                          </Badge>
                                        </HStack>
                                        <ProgressRoot value={project.progress} borderRadius="full" h={2} w="100%">
                                          <ProgressTrack bg="gray.200" className="dark:bg-gray-700" borderRadius="full">
                                            <ProgressRange bg="brand.500" borderRadius="full" />
                                          </ProgressTrack>
                                        </ProgressRoot>
                                        <HStack gap={3} fontSize="xs" color="gray.500" className="dark:text-gray-400">
                                          <Text>{project.progress}% abgeschlossen</Text>
                                          <Text>•</Text>
                                          <Text>{formatTime(project.updatedAt)}</Text>
                                        </HStack>
                                      </VStack>
                                      <ChevronRight size={16} color="#9ca3af" />
                                    </Flex>
                                  </Box>
                                </Box>
                              );
                            })}
                          </VStack>
                        )}
                      </CardBody>
                    </CardRoot>

                    {/* Recent Alerts */}
                    <CardRoot borderRadius="xl" borderWidth="1px" borderColor="gray.200" className="dark:border-gray-700/60 dark:bg-gray-900" bg="white" shadow="sm">
                      <CardHeader borderBottomWidth="1px" borderColor="gray.200" className="dark:border-gray-700/60" px={5} py={3.5}>
                        <Flex align="center" justify="space-between">
                          <VStack align="flex-start" gap={1}>
                            <Text fontSize="lg" fontWeight="bold" color="gray.900" className="dark:text-gray-100">
                              Offene Alerts
                            </Text>
                            <Text fontSize="xs" color="gray.500" className="dark:text-gray-400">
                              {alerts.filter((a) => a.status === "open").length} Offen
                            </Text>
                          </VStack>
                          <Button
                            asChild
                            size="sm"
                            variant="ghost"
                          >
                            <Link href="/dashboard/alerts">
                              <HStack gap={1.5}>
                                <Text>Alle anzeigen</Text>
                                <ChevronRight size={14} />
                              </HStack>
                            </Link>
                          </Button>
                        </Flex>
                      </CardHeader>
                      <CardBody p={0}>
                        {alerts.filter((a) => a.status === "open").length === 0 ? (
                          <Center px={6} py={12}>
                            <VStack gap={3}>
                              <Box
                                h={12}
                                w={12}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                borderRadius="full"
                                bg="green.100"
                                className="dark:bg-green-900/20"
                              >
                                <CheckCircle2 size={24} color="#10b981" />
                              </Box>
                              <Text fontSize="sm" fontWeight="medium" color="gray.500" className="dark:text-gray-400">
                                Keine offenen Alerts
                              </Text>
                            </VStack>
                          </Center>
                        ) : (
                          <VStack gap={0} align="stretch">
                            {alerts
                              .filter((a) => a.status === "open")
                              .slice(0, 5)
                              .map((alert, index) => {
                                const severityColor = getSeverityColor(alert.severity);
                                return (
                                  <Box key={alert.id}>
                                    {index > 0 && (
                                      <Box h="1px" bg="gray.200" className="dark:bg-gray-700/60" />
                                    )}
                                    <Box
                                      px={5}
                                      py={3.5}
                                      _hover={{ bg: "gray.50" }}
                                      className="dark:hover:bg-gray-800/50"
                                      cursor="pointer"
                                      asChild
                                    >
                                      <Link href={`/dashboard/alerts/${alert.id}`}>
                                        <VStack align="flex-start" gap={2}>
                                          <HStack gap={2} w="100%">
                                            <Text fontSize="sm" fontWeight="semibold" color="gray.900" className="dark:text-gray-100" flex={1}>
                                              {alert.title}
                                            </Text>
                                            <Badge
                                              borderRadius="full"
                                              px={2}
                                              py={0.5}
                                              fontSize="xs"
                                              fontWeight="semibold"
                                              bg={severityColor.bg}
                                              className={`dark:bg-${severityColor.darkBg} dark:text-${severityColor.darkColor}`}
                                              color={severityColor.color}
                                            >
                                              {alert.severity}
                                            </Badge>
                                          </HStack>
                                          <Text fontSize="xs" color="gray.500" className="dark:text-gray-400" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {alert.message}
                                          </Text>
                                          <HStack gap={3} fontSize="xs" color="gray.500" className="dark:text-gray-400">
                                            <Text>{alert.system}</Text>
                                            <Text>•</Text>
                                            <Text>{formatTime(alert.createdAt)}</Text>
                                          </HStack>
                                        </VStack>
                                      </Link>
                                    </Box>
                                  </Box>
                                );
                              })}
                          </VStack>
                        )}
                      </CardBody>
                    </CardRoot>
                  </Grid>
                </VStack>
              )}

              {/* Projects Tab */}
              {activeTab === "projects" && (
                <VStack gap={5} align="stretch">
                  {/* Projects Header with Filters */}
                  <CardRoot borderRadius="xl" borderWidth="1px" borderColor="gray.200" className="dark:border-gray-700/60 dark:bg-gray-900" bg="white" shadow="sm">
                    <CardHeader borderBottomWidth="1px" borderColor="gray.200" className="dark:border-gray-700/60" px={5} py={3.5}>
                      <Flex align="center" justify="space-between" gap={4} flexWrap="wrap">
                        <VStack align="flex-start" gap={1}>
                          <Text fontSize="lg" fontWeight="bold" color="gray.900" className="dark:text-gray-100">
                            Projekte verwalten
                          </Text>
                          <Text fontSize="xs" color="gray.500" className="dark:text-gray-400">
                            {filteredAndSortedProjects.length} von {projects.length} Projekten
                          </Text>
                        </VStack>
                        <HStack gap={2}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const csv = [
                                ["Name", "Status", "Fortschritt", "Erstellt", "Aktualisiert"],
                                ...filteredAndSortedProjects.map((p) => [
                                  p.name,
                                  p.status,
                                  `${p.progress}%`,
                                  new Date(p.createdAt).toLocaleDateString("de-DE"),
                                  new Date(p.updatedAt).toLocaleDateString("de-DE"),
                                ]),
                              ].map((row) => row.join(",")).join("\n");
                              const blob = new Blob([csv], { type: "text/csv" });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = `projekte-${new Date().toISOString().split("T")[0]}.csv`;
                              a.click();
                            }}
                          >
                            <HStack gap={1.5}>
                              <Download size={14} />
                              <Text>Export</Text>
                            </HStack>
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setShowCreateProject(true)}
                            bg="brand.500"
                            color="white"
                            _hover={{ bg: "brand.600" }}
                          >
                            <HStack gap={1.5}>
                              <Plus size={14} />
                              <Text>Neues Projekt</Text>
                            </HStack>
                          </Button>
                        </HStack>
                      </Flex>
                    </CardHeader>
                    <CardBody p={5}>
                      <VStack gap={4} align="stretch">
                        {/* Search & Filters */}
                        <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
                          <Box>
                            <HStack gap={2} mb={2}>
                              <Search size={16} color="#9ca3af" />
                              <Text fontSize="xs" fontWeight="semibold" color="gray.600" className="dark:text-gray-400">
                                Suche
                              </Text>
                            </HStack>
                            <Input
                              placeholder="Projektname oder Beschreibung..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              borderRadius="md"
                              borderWidth="1px"
                              borderColor="gray.200"
                              className="dark:border-gray-700/60 dark:bg-gray-800 dark:text-gray-100"
                              bg="white"
                            />
                          </Box>
                          <Box>
                            <HStack gap={2} mb={2}>
                              <Filter size={16} color="#9ca3af" />
                              <Text fontSize="xs" fontWeight="semibold" color="gray.600" className="dark:text-gray-400">
                                Filter
                              </Text>
                            </HStack>
                            <Box
                              as="select"
                              defaultValue={projectFilter}
                              onChange={(e) => {
                                const target = e.target as HTMLSelectElement;
                                setProjectFilter(target.value as FilterType);
                              }}
                              borderRadius="md"
                              borderWidth="1px"
                              borderColor="gray.200"
                              className="dark:border-gray-700/60 dark:bg-gray-800 dark:text-gray-100"
                              bg="white"
                              px={3}
                              py={2}
                              fontSize="sm"
                              w="100%"
                            >
                              <option value="all">Alle Status</option>
                              <option value="active">Aktiv</option>
                              <option value="completed">Abgeschlossen</option>
                              <option value="archived">Archiviert</option>
                              <option value="pending">Ausstehend</option>
                            </Box>
                          </Box>
                          <Box>
                            <HStack gap={2} mb={2}>
                              <BarChart3 size={16} color="#9ca3af" />
                              <Text fontSize="xs" fontWeight="semibold" color="gray.600" className="dark:text-gray-400">
                                Sortierung
                              </Text>
                            </HStack>
                            <Box
                              as="select"
                              defaultValue={projectSort}
                              onChange={(e) => {
                                const target = e.target as HTMLSelectElement;
                                setProjectSort(target.value as SortType);
                              }}
                              borderRadius="md"
                              borderWidth="1px"
                              borderColor="gray.200"
                              className="dark:border-gray-700/60 dark:bg-gray-800 dark:text-gray-100"
                              bg="white"
                              px={3}
                              py={2}
                              fontSize="sm"
                              w="100%"
                            >
                              <option value="updated">Zuletzt aktualisiert</option>
                              <option value="created">Erstellungsdatum</option>
                              <option value="name">Name</option>
                              <option value="progress">Fortschritt</option>
                            </Box>
                          </Box>
                        </SimpleGrid>

                        {/* Projects Table */}
                        {filteredAndSortedProjects.length === 0 ? (
                          <Center py={12}>
                            <VStack gap={3}>
                              <Box
                                h={12}
                                w={12}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                borderRadius="full"
                                bg="gray.100"
                                className="dark:bg-gray-700"
                              >
                                <FolderKanban size={24} color="#9ca3af" />
                              </Box>
                              <Text fontSize="sm" fontWeight="medium" color="gray.500" className="dark:text-gray-400">
                                {searchQuery ? "Keine Projekte gefunden" : "Noch keine Projekte"}
                              </Text>
                              {!searchQuery && (
                                <Button
                                  size="sm"
                                  onClick={() => setShowCreateProject(true)}
                                  bg="brand.500"
                                  color="white"
                                  _hover={{ bg: "brand.600" }}
                                >
                                  <HStack gap={1.5}>
                                    <Plus size={14} />
                                    <Text>Erstes Projekt erstellen</Text>
                                  </HStack>
                                </Button>
                              )}
                            </VStack>
                          </Center>
                        ) : (
                          <Box borderRadius="md" borderWidth="1px" borderColor="gray.200" className="dark:border-gray-700/60" overflow="hidden">
                            <TableRoot>
                              <TableHeader>
                                <TableRow bg="gray.50" className="dark:bg-gray-800">
                                  <TableColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600" className="dark:text-gray-400" px={4} py={3}>
                                    Projekt
                                  </TableColumnHeader>
                                  <TableColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600" className="dark:text-gray-400" px={4} py={3}>
                                    Status
                                  </TableColumnHeader>
                                  <TableColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600" className="dark:text-gray-400" px={4} py={3}>
                                    Fortschritt
                                  </TableColumnHeader>
                                  <TableColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600" className="dark:text-gray-400" px={4} py={3}>
                                    Aktualisiert
                                  </TableColumnHeader>
                                  <TableColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600" className="dark:text-gray-400" px={4} py={3} textAlign="right">
                                    Aktionen
                                  </TableColumnHeader>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredAndSortedProjects.map((project) => {
                                  const statusColor = getStatusColor(project.status);
                                  return (
                                    <TableRow
                                      key={project.id}
                                      _hover={{ bg: "gray.50" }}
                                      className="dark:hover:bg-gray-800/50"
                                      cursor="pointer"
                                      onClick={() => {
                                        setSelectedProject(project);
                                        setShowProjectDetails(true);
                                      }}
                                    >
                                      <TableCell px={4} py={3}>
                                        <VStack align="flex-start" gap={1}>
                                          <Text fontSize="sm" fontWeight="semibold" color="gray.900" className="dark:text-gray-100">
                                            {project.name}
                                          </Text>
                                          {project.description && (
                                            <Text fontSize="xs" color="gray.500" className="dark:text-gray-400" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                              {project.description}
                                            </Text>
                                          )}
                                        </VStack>
                                      </TableCell>
                                      <TableCell px={4} py={3}>
                                        <Badge
                                          borderRadius="full"
                                          px={2.5}
                                          py={1}
                                          fontSize="xs"
                                          fontWeight="semibold"
                                          bg={statusColor.bg}
                                          className={`dark:bg-${statusColor.darkBg} dark:text-${statusColor.darkColor}`}
                                          color={statusColor.color}
                                        >
                                          {project.status === "active" ? "Aktiv" : project.status === "completed" ? "Abgeschlossen" : project.status}
                                        </Badge>
                                      </TableCell>
                                      <TableCell px={4} py={3} minW="200px">
                                        <VStack align="flex-start" gap={1}>
                                          <HStack justify="space-between" w="100%">
                                            <Text fontSize="xs" fontWeight="medium" color="gray.600" className="dark:text-gray-400">
                                              {project.progress}%
                                            </Text>
                                          </HStack>
                                          <ProgressRoot value={project.progress} borderRadius="full" h={2} w="100%">
                                            <ProgressTrack bg="gray.200" className="dark:bg-gray-700" borderRadius="full">
                                              <ProgressRange bg="brand.500" borderRadius="full" />
                                            </ProgressTrack>
                                          </ProgressRoot>
                                        </VStack>
                                      </TableCell>
                                      <TableCell px={4} py={3}>
                                        <Text fontSize="xs" color="gray.500" className="dark:text-gray-400">
                                          {formatTime(project.updatedAt)}
                                        </Text>
                                      </TableCell>
                                      <TableCell px={4} py={3} textAlign="right">
                                        <HStack gap={1} justify="flex-end">
                                          <Button
                                            size="xs"
                                            variant="ghost"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedProject(project);
                                              setShowProjectDetails(true);
                                            }}
                                          >
                                            <Eye size={14} />
                                          </Button>
                                          <Button
                                            size="xs"
                                            variant="ghost"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              window.location.href = `/dashboard/projects/${project.id}`;
                                            }}
                                          >
                                            <Edit size={14} />
                                          </Button>
                                        </HStack>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </TableRoot>
                          </Box>
                        )}
                      </VStack>
                    </CardBody>
                  </CardRoot>
                </VStack>
              )}

              {/* Alerts Tab */}
              {activeTab === "alerts" && (
                <VStack gap={5} align="stretch">
                  {/* Alert Statistics Cards */}
                  <SimpleGrid columns={{ base: 2, sm: 4, lg: 7 }} gap={3}>
                    <CardRoot borderRadius="lg" borderWidth="1px" borderColor="gray.200" className="dark:border-gray-700/60 dark:bg-gray-900" bg="white" shadow="sm">
                      <CardBody p={3}>
                        <VStack align="flex-start" gap={1.5}>
                          <Text fontSize="xs" fontWeight="semibold" color="gray.500" className="dark:text-gray-400">
                            Gesamt
                          </Text>
                          <Text fontSize="2xl" fontWeight="bold" color="gray.900" className="dark:text-gray-100">
                            {alerts.length}
                          </Text>
                        </VStack>
                      </CardBody>
                    </CardRoot>
                    <CardRoot borderRadius="lg" borderWidth="1px" borderColor="red.200" className="dark:border-red-800/40 dark:bg-gray-900" bg="white" shadow="sm">
                      <CardBody p={3}>
                        <VStack align="flex-start" gap={1.5}>
                          <Text fontSize="xs" fontWeight="semibold" color="red.600" className="dark:text-red-400">
                            Offen
                          </Text>
                          <Text fontSize="2xl" fontWeight="bold" color="red.700" className="dark:text-red-400">
                            {alertStats.open}
                          </Text>
                        </VStack>
                      </CardBody>
                    </CardRoot>
                    <CardRoot borderRadius="lg" borderWidth="1px" borderColor="red.300" className="dark:border-red-800/50 dark:bg-gray-900" bg="white" shadow="sm">
                      <CardBody p={3}>
                        <VStack align="flex-start" gap={1.5}>
                          <Text fontSize="xs" fontWeight="semibold" color="red.600" className="dark:text-red-400">
                            Kritisch
                          </Text>
                          <Text fontSize="2xl" fontWeight="bold" color="red.700" className="dark:text-red-400">
                            {alertStats.critical}
                          </Text>
                        </VStack>
                      </CardBody>
                    </CardRoot>
                    <CardRoot borderRadius="lg" borderWidth="1px" borderColor="orange.200" className="dark:border-orange-800/40 dark:bg-gray-900" bg="white" shadow="sm">
                      <CardBody p={3}>
                        <VStack align="flex-start" gap={1.5}>
                          <Text fontSize="xs" fontWeight="semibold" color="orange.600" className="dark:text-orange-400">
                            Hoch
                          </Text>
                          <Text fontSize="2xl" fontWeight="bold" color="orange.700" className="dark:text-orange-400">
                            {alertStats.high}
                          </Text>
                        </VStack>
                      </CardBody>
                    </CardRoot>
                    <CardRoot borderRadius="lg" borderWidth="1px" borderColor="amber.200" className="dark:border-amber-800/40 dark:bg-gray-900" bg="white" shadow="sm">
                      <CardBody p={3}>
                        <VStack align="flex-start" gap={1.5}>
                          <Text fontSize="xs" fontWeight="semibold" color="amber.600" className="dark:text-amber-400">
                            Mittel
                          </Text>
                          <Text fontSize="2xl" fontWeight="bold" color="amber.700" className="dark:text-amber-400">
                            {alertStats.medium}
                          </Text>
                        </VStack>
                      </CardBody>
                    </CardRoot>
                    <CardRoot borderRadius="lg" borderWidth="1px" borderColor="blue.200" className="dark:border-blue-800/40 dark:bg-gray-900" bg="white" shadow="sm">
                      <CardBody p={3}>
                        <VStack align="flex-start" gap={1.5}>
                          <Text fontSize="xs" fontWeight="semibold" color="blue.600" className="dark:text-blue-400">
                            Bestätigt
                          </Text>
                          <Text fontSize="2xl" fontWeight="bold" color="blue.700" className="dark:text-blue-400">
                            {alertStats.acknowledged}
                          </Text>
                        </VStack>
                      </CardBody>
                    </CardRoot>
                    <CardRoot borderRadius="lg" borderWidth="1px" borderColor="green.200" className="dark:border-green-800/40 dark:bg-gray-900" bg="white" shadow="sm">
                      <CardBody p={3}>
                        <VStack align="flex-start" gap={1.5}>
                          <Text fontSize="xs" fontWeight="semibold" color="green.600" className="dark:text-green-400">
                            Behoben
                          </Text>
                          <Text fontSize="2xl" fontWeight="bold" color="green.700" className="dark:text-green-400">
                            {alertStats.resolved}
                          </Text>
                        </VStack>
                      </CardBody>
                    </CardRoot>
                  </SimpleGrid>

                  {/* Alerts Management Card */}
                  <CardRoot borderRadius="xl" borderWidth="1px" borderColor="gray.200" className="dark:border-gray-700/60 dark:bg-gray-900" bg="white" shadow="sm">
                    <CardHeader borderBottomWidth="1px" borderColor="gray.200" className="dark:border-gray-700/60" px={5} py={3.5}>
                      <Flex align="center" justify="space-between" gap={4} flexWrap="wrap">
                        <VStack align="flex-start" gap={1}>
                          <Text fontSize="lg" fontWeight="bold" color="gray.900" className="dark:text-gray-100">
                            Störungsmeldungen
                          </Text>
                          <Text fontSize="xs" color="gray.500" className="dark:text-gray-400">
                            {filteredAlerts.length} von {alerts.length} Alerts
                          </Text>
                        </VStack>
                        <HStack gap={2}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => refresh.alerts()}
                          >
                            <HStack gap={1.5}>
                              <RefreshCw size={14} />
                              <Text display={{ base: "none", sm: "block" }}>Aktualisieren</Text>
                            </HStack>
                          </Button>
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                          >
                            <Link href="/dashboard/alerts">
                              <HStack gap={1.5}>
                                <Text>Alle anzeigen</Text>
                                <ChevronRight size={14} />
                              </HStack>
                            </Link>
                          </Button>
                        </HStack>
                      </Flex>
                    </CardHeader>
                    <CardBody p={5}>
                      <VStack gap={4} align="stretch">
                        {/* Search & Filters */}
                        <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
                          <Box>
                            <HStack gap={2} mb={2}>
                              <Search size={16} color="#9ca3af" />
                              <Text fontSize="xs" fontWeight="semibold" color="gray.600" className="dark:text-gray-400">
                                Suche
                              </Text>
                            </HStack>
                            <Input
                              placeholder="Titel, Nachricht oder System..."
                              value={alertSearchQuery}
                              onChange={(e) => setAlertSearchQuery(e.target.value)}
                              borderRadius="md"
                              borderWidth="1px"
                              borderColor="gray.200"
                              className="dark:border-gray-700/60 dark:bg-gray-800 dark:text-gray-100"
                              bg="white"
                            />
                          </Box>
                          <Box>
                            <HStack gap={2} mb={2}>
                              <Filter size={16} color="#9ca3af" />
                              <Text fontSize="xs" fontWeight="semibold" color="gray.600" className="dark:text-gray-400">
                                Status
                              </Text>
                            </HStack>
                            <Box
                              as="select"
                              defaultValue={alertFilter}
                              onChange={(e) => {
                                const target = e.target as HTMLSelectElement;
                                setAlertFilter(target.value as typeof alertFilter);
                              }}
                              borderRadius="md"
                              borderWidth="1px"
                              borderColor="gray.200"
                              className="dark:border-gray-700/60 dark:bg-gray-800 dark:text-gray-100"
                              bg="white"
                              px={3}
                              py={2}
                              fontSize="sm"
                              w="100%"
                            >
                              <option value="all">Alle Status</option>
                              <option value="open">Offen</option>
                              <option value="acknowledged">Bestätigt</option>
                              <option value="resolved">Behoben</option>
                            </Box>
                          </Box>
                          <Box>
                            <HStack gap={2} mb={2}>
                              <AlertTriangle size={16} color="#9ca3af" />
                              <Text fontSize="xs" fontWeight="semibold" color="gray.600" className="dark:text-gray-400">
                                Schweregrad
                              </Text>
                            </HStack>
                            <Box
                              as="select"
                              defaultValue={alertSeverityFilter}
                              onChange={(e) => {
                                const target = e.target as HTMLSelectElement;
                                setAlertSeverityFilter(target.value as typeof alertSeverityFilter);
                              }}
                              borderRadius="md"
                              borderWidth="1px"
                              borderColor="gray.200"
                              className="dark:border-gray-700/60 dark:bg-gray-800 dark:text-gray-100"
                              bg="white"
                              px={3}
                              py={2}
                              fontSize="sm"
                              w="100%"
                            >
                              <option value="all">Alle Schweregrade</option>
                              <option value="critical">Kritisch</option>
                              <option value="high">Hoch</option>
                              <option value="medium">Mittel</option>
                              <option value="low">Niedrig</option>
                            </Box>
                          </Box>
                        </SimpleGrid>

                        {/* Alerts List */}
                        {filteredAlerts.length === 0 ? (
                          <Center py={12}>
                            <VStack gap={3}>
                              <Box
                                h={12}
                                w={12}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                borderRadius="full"
                                bg="green.100"
                                className="dark:bg-green-900/20"
                              >
                                <CheckCircle2 size={24} color="#10b981" />
                              </Box>
                              <Text fontSize="sm" fontWeight="medium" color="gray.500" className="dark:text-gray-400">
                                {alertSearchQuery || alertFilter !== "all" || alertSeverityFilter !== "all" ? "Keine Alerts gefunden" : "Keine Alerts vorhanden"}
                              </Text>
                            </VStack>
                          </Center>
                        ) : (
                          <VStack gap={0} align="stretch">
                            {filteredAlerts.map((alert, index) => {
                              const severityColor = getSeverityColor(alert.severity);
                              return (
                                <Box key={alert.id}>
                                  {index > 0 && (
                                    <Box h="1px" bg="gray.200" className="dark:bg-gray-700/60" />
                                  )}
                                  <Box
                                    px={5}
                                    py={3.5}
                                    _hover={{ bg: "gray.50" }}
                                    className="dark:hover:bg-gray-800/50"
                                    asChild
                                  >
                                    <Link href={`/dashboard/alerts/${alert.id}`}>
                                      <Flex align="flex-start" gap={3}>
                                        <Box
                                          h={12}
                                          w={12}
                                          flexShrink={0}
                                          display="flex"
                                          alignItems="center"
                                          justifyContent="center"
                                          borderRadius="lg"
                                          bg={severityColor.bg}
                                          className={`dark:bg-${severityColor.darkBg}`}
                                        >
                                          <AlertTriangle size={22} color={severityColor.color} />
                                        </Box>
                                        <VStack align="flex-start" gap={1.5} flex={1} minW={0}>
                                          <HStack gap={2} w="100%" flexWrap="wrap">
                                            <Text fontSize="sm" fontWeight="semibold" color="gray.900" className="dark:text-gray-100" flex={1} minW="200px">
                                              {alert.title}
                                            </Text>
                                            <Badge
                                              borderRadius="full"
                                              px={2.5}
                                              py={1}
                                              fontSize="xs"
                                              fontWeight="semibold"
                                              bg={severityColor.bg}
                                              className={`dark:bg-${severityColor.darkBg} dark:text-${severityColor.darkColor}`}
                                              color={severityColor.color}
                                            >
                                              {alert.severity === "critical" ? "Kritisch" : alert.severity === "high" ? "Hoch" : alert.severity === "medium" ? "Mittel" : "Niedrig"}
                                            </Badge>
                                            <Badge
                                              borderRadius="full"
                                              px={2.5}
                                              py={1}
                                              fontSize="xs"
                                              fontWeight="semibold"
                                              bg={alert.status === "open" ? "red.50" : alert.status === "resolved" ? "green.50" : "blue.50"}
                                              className={alert.status === "open" ? "dark:bg-red-900/20 dark:text-red-400" : alert.status === "resolved" ? "dark:bg-green-900/20 dark:text-green-400" : "dark:bg-blue-900/20 dark:text-blue-400"}
                                              color={alert.status === "open" ? "red.700" : alert.status === "resolved" ? "green.700" : "blue.700"}
                                            >
                                              {alert.status === "open" ? "Offen" : alert.status === "resolved" ? "Behoben" : "Bestätigt"}
                                            </Badge>
                                          </HStack>
                                          <Text fontSize="xs" color="gray.500" className="dark:text-gray-400" style={{ overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                                            {alert.message}
                                          </Text>
                                          <HStack gap={3} fontSize="xs" color="gray.500" className="dark:text-gray-400">
                                            <HStack gap={1}>
                                              <Box h={1.5} w={1.5} borderRadius="full" bg="gray.400" className="dark:bg-gray-500" />
                                              <Text fontWeight="medium">{alert.system}</Text>
                                            </HStack>
                                            <Text>•</Text>
                                            <Text>{formatTime(alert.createdAt)}</Text>
                                          </HStack>
                                        </VStack>
                                        <ChevronRight size={16} color="#9ca3af" className="flex-shrink-0" />
                                      </Flex>
                                    </Link>
                                  </Box>
                                </Box>
                              );
                            })}
                          </VStack>
                        )}
                      </VStack>
                    </CardBody>
                  </CardRoot>
                </VStack>
              )}

              {/* Activities Tab */}
              {activeTab === "activities" && (
                <VStack gap={5} align="stretch">
                  <CardRoot borderRadius="xl" borderWidth="1px" borderColor="gray.200" className="dark:border-gray-700/60 dark:bg-gray-900" bg="white" shadow="sm">
                    <CardHeader borderBottomWidth="1px" borderColor="gray.200" className="dark:border-gray-700/60" px={5} py={3.5}>
                      <Flex align="center" justify="space-between" gap={4} flexWrap="wrap">
                        <VStack align="flex-start" gap={1}>
                          <Text fontSize="lg" fontWeight="bold" color="gray.900" className="dark:text-gray-100">
                            System-Aktivitäten
                          </Text>
                          <Text fontSize="xs" color="gray.500" className="dark:text-gray-400">
                            Echtzeit-Log aller Systemereignisse
                          </Text>
                        </VStack>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => refresh.activities()}
                        >
                          <HStack gap={1.5}>
                            <RefreshCw size={14} />
                            <Text>Aktualisieren</Text>
                          </HStack>
                        </Button>
                      </Flex>
                    </CardHeader>
                    <CardBody p={0}>
                      {activities.length === 0 ? (
                        <Center px={6} py={12}>
                          <VStack gap={3}>
                            <Box
                              h={12}
                              w={12}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              borderRadius="full"
                              bg="gray.100"
                              className="dark:bg-gray-700"
                            >
                              <ActivityIcon size={24} color="#9ca3af" />
                            </Box>
                            <Text fontSize="sm" fontWeight="medium" color="gray.500" className="dark:text-gray-400">
                              Keine Aktivitäten vorhanden
                            </Text>
                          </VStack>
                        </Center>
                      ) : (
                        <VStack gap={0} align="stretch">
                          {activities.map((activity, index) => {
                            const statusColors = {
                              success: { bg: "green.50", color: "green.600", darkBg: "green.900/30", darkColor: "green.400" },
                              warning: { bg: "amber.50", color: "amber.600", darkBg: "amber.900/30", darkColor: "amber.400" },
                              error: { bg: "red.50", color: "red.600", darkBg: "red.900/30", darkColor: "red.400" },
                              info: { bg: "blue.50", color: "blue.600", darkBg: "blue.900/30", darkColor: "blue.400" },
                            };
                            const colors = statusColors[activity.status] || statusColors.info;
                            return (
                              <Box key={activity.id}>
                                {index > 0 && (
                                  <Box h="1px" bg="gray.200" className="dark:bg-gray-700/60" />
                                )}
                                <Box
                                  px={5}
                                  py={3.5}
                                  _hover={{ bg: "gray.50" }}
                                  className="dark:hover:bg-gray-800/50"
                                >
                                  <Flex align="flex-start" gap={4}>
                                    <Box
                                      h={10}
                                      w={10}
                                      flexShrink={0}
                                      display="flex"
                                      alignItems="center"
                                      justifyContent="center"
                                      borderRadius="lg"
                                      bg={colors.bg}
                                      className={`dark:bg-${colors.darkBg}`}
                                    >
                                      {activity.status === "success" ? (
                                        <CheckCircle2 size={20} color={colors.color} />
                                      ) : activity.status === "error" ? (
                                        <AlertTriangle size={20} color={colors.color} />
                                      ) : (
                                        <Info size={20} color={colors.color} />
                                      )}
                                    </Box>
                                    <VStack align="flex-start" gap={2} flex={1} minW={0}>
                                      <Text fontSize="sm" fontWeight="semibold" color="gray.900" className="dark:text-gray-100">
                                        {activity.action}
                                      </Text>
                                      <HStack gap={3} fontSize="xs" color="gray.500" className="dark:text-gray-400">
                                        <Text fontWeight="semibold" color="gray.600" className="dark:text-gray-300">
                                          {activity.system}
                                        </Text>
                                        <Text>•</Text>
                                        <Text>{formatTime(activity.timestamp)}</Text>
                                      </HStack>
                                    </VStack>
                                  </Flex>
                                </Box>
                              </Box>
                            );
                          })}
                        </VStack>
                      )}
                    </CardBody>
                  </CardRoot>
                </VStack>
              )}
            </VStack>
          </Box>
        </Box>

        {/* Create Project Sheet */}
        <Sheet
          open={showCreateProject}
          onOpenChange={setShowCreateProject}
          side="right"
          size="md"
        >
          <SheetHeader>
            <SheetTitle>Neues Projekt erstellen</SheetTitle>
            <SheetDescription>
              Erstellen Sie ein neues Projekt für Ihr Dashboard
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleCreateProject}>
            <SheetContent>
              <VStack gap={4} align="stretch">
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700" className="dark:text-gray-300" mb={1}>
                    Projektname *
                  </Text>
                  <Input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="z.B. Hamburg Hbf Modernisierung"
                    required
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="gray.200"
                    className="dark:border-gray-700/60 dark:bg-gray-800 dark:text-gray-100"
                    bg="white"
                    _focus={{ borderColor: "brand.500" }}
                  />
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700" className="dark:text-gray-300" mb={1}>
                    Beschreibung
                  </Text>
                  <Textarea
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Optionale Beschreibung..."
                    rows={4}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="gray.200"
                    className="dark:border-gray-700/60 dark:bg-gray-800 dark:text-gray-100"
                    bg="white"
                    _focus={{ borderColor: "brand.500" }}
                  />
                </Box>
              </VStack>
            </SheetContent>
            <SheetFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateProject(false);
                  setNewProjectName("");
                  setNewProjectDescription("");
                }}
                borderRadius="md"
                borderWidth="1px"
                borderColor="gray.200"
                className="dark:border-gray-700/60 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                bg="white"
                color="gray.700"
                _hover={{ bg: "gray.50" }}
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                bg="brand.500"
                color="white"
                _hover={{ bg: "brand.600" }}
                borderRadius="md"
              >
                Erstellen
              </Button>
            </SheetFooter>
          </form>
        </Sheet>

        {/* Project Details Sheet */}
        {selectedProject && (
          <Sheet
            open={showProjectDetails}
            onOpenChange={setShowProjectDetails}
            side="right"
            size="lg"
          >
            <SheetHeader>
              <SheetTitle>{selectedProject.name}</SheetTitle>
              <SheetDescription>
                Projekt-Details und Informationen
              </SheetDescription>
            </SheetHeader>
            <SheetContent>
              <VStack gap={6} align="stretch">
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="gray.500" className="dark:text-gray-400" mb={2}>
                    Beschreibung
                  </Text>
                  <Text fontSize="sm" color="gray.700" className="dark:text-gray-300">
                    {selectedProject.description || "Keine Beschreibung vorhanden"}
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="gray.500" className="dark:text-gray-400" mb={2}>
                    Fortschritt
                  </Text>
                  <VStack gap={2} align="stretch">
                    <Flex align="center" justify="space-between">
                      <Text fontSize="sm" fontWeight="semibold" color="gray.900" className="dark:text-gray-100">
                        {selectedProject.progress}%
                      </Text>
                    </Flex>
                    <ProgressRoot value={selectedProject.progress} borderRadius="full" h={3}>
                      <ProgressTrack bg="gray.200" className="dark:bg-gray-700" borderRadius="full">
                        <ProgressRange bg="brand.500" borderRadius="full" />
                      </ProgressTrack>
                    </ProgressRoot>
                  </VStack>
                </Box>

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="gray.500" className="dark:text-gray-400" mb={2}>
                      Status
                    </Text>
                    <Badge
                      borderRadius="full"
                      px={3}
                      py={1}
                      fontSize="xs"
                      fontWeight="semibold"
                      bg={getStatusColor(selectedProject.status).bg}
                      className={`dark:bg-${getStatusColor(selectedProject.status).darkBg} dark:text-${getStatusColor(selectedProject.status).darkColor}`}
                      color={getStatusColor(selectedProject.status).color}
                    >
                      {selectedProject.status === "active"
                        ? "Aktiv"
                        : selectedProject.status === "completed"
                          ? "Abgeschlossen"
                          : selectedProject.status}
                    </Badge>
                  </GridItem>
                  <GridItem>
                    <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="gray.500" className="dark:text-gray-400" mb={2}>
                      Erstellt
                    </Text>
                    <Text fontSize="sm" color="gray.700" className="dark:text-gray-300">
                      {new Date(selectedProject.createdAt).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </Text>
                  </GridItem>
                </Grid>
              </VStack>
            </SheetContent>
            <SheetFooter>
              <Button
                variant="outline"
                onClick={() => setShowProjectDetails(false)}
                borderRadius="md"
                borderWidth="1px"
                borderColor="gray.200"
                className="dark:border-gray-700/60 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                bg="white"
                color="gray.700"
                _hover={{ bg: "gray.50" }}
              >
                Schließen
              </Button>
              <Button
                asChild
                bg="brand.500"
                color="white"
                _hover={{ bg: "brand.600" }}
                borderRadius="md"
              >
                <Link href={`/dashboard/projects/${selectedProject.id}`}>
                  Vollständige Ansicht
                </Link>
              </Button>
            </SheetFooter>
          </Sheet>
        )}
      </Box>
    </SessionProvider>
  );
}
