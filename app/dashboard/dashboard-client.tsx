"use client";

import React, { useState } from "react";
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
  IconButton,
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
  Separator,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import {
  Plus,
  BarChart3,
  CheckCircle2,
  Info,
  FolderKanban,
  AlertTriangle,
  Activity,
  ChevronRight,
  TrendingUp,
  Zap,
  FileText,
  Cpu,
  HardDrive,
  Network,
  CheckCircle,
} from "lucide-react";

type DashboardClientProps = {
  session: Session;
};

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
  } = useDashboard({ session });

  const { currentVersion } = useAppVersion();

  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

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
    if (minutes < 60) return `Vor ${minutes} Minute${minutes > 1 ? "n" : ""}`;
    if (hours < 24) return `Vor ${hours} Stunde${hours > 1 ? "n" : ""}`;
    return `Vor ${days} Tag${days > 1 ? "en" : ""}`;
  };

  const getActivityIcon = (status: string) => {
    switch (status) {
      case "success":
        return <BarChart3 size={20} />;
      case "info":
        return <Info size={20} />;
      default:
        return <CheckCircle2 size={20} />;
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
          className="dark:border-gray-700/60"
          bg="white"
          className="dark:bg-gray-900"
        >
          <Box px={{ base: 6, lg: 8 }} py={3}>
            <Flex align="center" justify="space-between">
              <Breadcrumbs />
              <HStack gap={2}>
                {currentVersion && (
                  <HStack
                    display={{ base: "none", sm: "flex" }}
                    gap={1.5}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="gray.200"
                    className="dark:border-gray-700/60"
                    bg="white"
                    className="dark:bg-gray-800"
                    px={2}
                    py={1}
                  >
                    <Box h={1.5} w={1.5} borderRadius="full" bg="emerald.500" />
                    <Text fontSize="xs" fontWeight="medium" color="gray.600" className="dark:text-gray-400">
                      v{currentVersion.substring(0, 8)}
                    </Text>
                  </HStack>
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
                  display={{ base: "none", sm: "flex" }}
                  size="sm"
                  variant="outline"
                  onClick={() => setShowCreateProject(true)}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="gray.200"
                  className="dark:border-gray-700/60 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  bg="white"
                  color="gray.700"
                  _hover={{ bg: "gray.50" }}
                  fontSize="xs"
                  fontWeight="medium"
                >
                  <HStack gap={1.5}>
                    <Plus size={14} />
                    <Text>Neues Projekt</Text>
                  </HStack>
                </Button>
              </HStack>
            </Flex>
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
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="gray.200"
                    className="dark:border-gray-700/60 dark:bg-gray-800 dark:text-gray-100"
                    bg="white"
                    color="gray.900"
                    _focus={{ borderColor: "brand.500", ring: "2px", ringColor: "brand.500", ringOpacity: 0.2 }}
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
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="gray.200"
                    className="dark:border-gray-700/60 dark:bg-gray-800 dark:text-gray-100"
                    bg="white"
                    color="gray.900"
                    _focus={{ borderColor: "brand.500", ring: "2px", ringColor: "brand.500", ringOpacity: 0.2 }}
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
                borderRadius="lg"
                borderWidth="1px"
                borderColor="gray.200"
                className="dark:border-gray-700/60"
                bg="white"
                className="dark:bg-gray-800"
                color="gray.700"
                className="dark:text-gray-300"
                _hover={{ bg: "gray.50" }}
                className="dark:hover:bg-gray-700"
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                bg="brand.500"
                color="white"
                _hover={{ bg: "brand.600" }}
                borderRadius="lg"
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
                  <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="gray.500" className="dark:text-gray-400">
                    Beschreibung
                  </Text>
                  <Text mt={2} fontSize="sm" color="gray.700" className="dark:text-gray-300">
                    {selectedProject.description || "Keine Beschreibung vorhanden"}
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="gray.500" className="dark:text-gray-400">
                    Fortschritt
                  </Text>
                  <VStack gap={2} mt={2} align="stretch">
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

                <Box>
                  <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="gray.500" className="dark:text-gray-400">
                    Status
                  </Text>
                  <Box mt={2}>
                    <Badge
                      borderRadius="full"
                      px={3}
                      py={1}
                      fontSize="xs"
                      fontWeight="semibold"
                      bg={
                        selectedProject.status === "active"
                          ? "green.100"
                          : selectedProject.status === "completed"
                            ? "blue.100"
                            : "gray.100"
                      }
                      className={
                        selectedProject.status === "active"
                          ? "dark:bg-green-900/30"
                          : selectedProject.status === "completed"
                            ? "dark:bg-blue-900/30"
                            : "dark:bg-gray-800"
                      }
                      color={
                        selectedProject.status === "active"
                          ? "green.700"
                          : selectedProject.status === "completed"
                            ? "blue.700"
                            : "gray.700"
                      }
                      className={
                        selectedProject.status === "active"
                          ? "dark:text-green-400"
                          : selectedProject.status === "completed"
                            ? "dark:text-blue-400"
                            : "dark:text-gray-300"
                      }
                    >
                      {selectedProject.status === "active"
                        ? "Aktiv"
                        : selectedProject.status === "completed"
                          ? "Abgeschlossen"
                          : selectedProject.status}
                    </Badge>
                  </Box>
                </Box>

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="gray.500" className="dark:text-gray-400">
                      Erstellt am
                    </Text>
                    <Text mt={2} fontSize="sm" color="gray.700" className="dark:text-gray-300">
                      {new Date(selectedProject.createdAt).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="gray.500" className="dark:text-gray-400">
                      Zuletzt aktualisiert
                    </Text>
                    <Text mt={2} fontSize="sm" color="gray.700" className="dark:text-gray-300">
                      {new Date(selectedProject.updatedAt).toLocaleDateString("de-DE", {
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
                borderRadius="lg"
                borderWidth="1px"
                borderColor="gray.200"
                className="dark:border-gray-700/60"
                bg="white"
                className="dark:bg-gray-800"
                color="gray.700"
                className="dark:text-gray-300"
                _hover={{ bg: "gray.50" }}
                className="dark:hover:bg-gray-700"
              >
                Schließen
              </Button>
              <Button
                asChild
                bg="brand.500"
                color="white"
                _hover={{ bg: "brand.600" }}
                borderRadius="lg"
              >
                <Link href={`/dashboard/projects/${selectedProject.id}`}>
                  Vollständige Ansicht
                </Link>
              </Button>
            </SheetFooter>
          </Sheet>
        )}

        {/* Dashboard Content */}
        <Box px={{ base: 6, lg: 8 }} py={{ base: 6, lg: 8 }}>
          <Box mx="auto" maxW="7xl">
            <VStack gap={{ base: 6, lg: 8 }} align="stretch">
              {/* Stats Cards */}
              <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={5}>
                <CardRoot
                  borderRadius="2xl"
                  borderWidth="1px"
                  borderColor="gray.200"
                  className="dark:border-gray-700/60"
                  bg="white"
                  className="dark:bg-gray-900"
                  shadow="sm"
                  _hover={{ borderColor: "brand.500", borderOpacity: 0.3 }}
                  className="dark:hover:border-brand-500/40"
                  transition="all 0.3s"
                >
                  <CardBody p={6}>
                    <Flex align="flex-start" justify="space-between">
                      <VStack align="flex-start" gap={4} flex={1}>
                        <Text fontSize="2xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="widest" color="gray.400" className="dark:text-gray-400">
                          Aktive Projekte
                        </Text>
                        <Text fontSize="4xl" fontWeight="bold" color="gray.900" className="dark:text-gray-100">
                          {stats?.activeProjects || 0}
                        </Text>
                        <HStack gap={2}>
                          <Badge
                            borderRadius="full"
                            px={2.5}
                            py={1}
                            fontSize="xs"
                            fontWeight="semibold"
                            bg="emerald.50"
                            className="dark:bg-emerald-900/20"
                            color="emerald.700"
                            className="dark:text-emerald-400"
                            ringWidth="1px"
                            ringColor="emerald.200"
                            className="dark:ring-emerald-800/30"
                          >
                            <HStack gap={1}>
                              <TrendingUp size={12} />
                              <Text>+{projects.filter((p) => p.status === "active").length}</Text>
                            </HStack>
                          </Badge>
                        </HStack>
                      </VStack>
                      <Box
                        h={14}
                        w={14}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="2xl"
                        bg="brand.500"
                        opacity={0.1}
                        ringWidth="1px"
                        ringColor="brand.500"
                        ringOpacity={0.2}
                        className="dark:ring-brand-500/20"
                      >
                        <FolderKanban size={28} color="#e2001a" />
                      </Box>
                    </Flex>
                  </CardBody>
                </CardRoot>

                <CardRoot
                  borderRadius="2xl"
                  borderWidth="1px"
                  borderColor="gray.200"
                  className="dark:border-gray-700/60"
                  bg="white"
                  className="dark:bg-gray-900"
                  shadow="sm"
                  _hover={{ borderColor: "blue.300", borderOpacity: 0.5 }}
                  className="dark:hover:border-blue-600/50"
                  transition="all 0.3s"
                >
                  <CardBody p={6}>
                    <Flex align="flex-start" justify="space-between">
                      <VStack align="flex-start" gap={4} flex={1}>
                        <Text fontSize="2xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="widest" color="gray.400" className="dark:text-gray-400">
                          Komponenten
                        </Text>
                        <Text fontSize="4xl" fontWeight="bold" color="gray.900" className="dark:text-gray-100">
                          {stats?.totalComponents
                            ? (stats.totalComponents / 1000000).toFixed(1) + "M"
                            : "0"}
                        </Text>
                        <HStack gap={2}>
                          <Badge
                            borderRadius="full"
                            px={2.5}
                            py={1}
                            fontSize="xs"
                            fontWeight="semibold"
                            bg="blue.50"
                            className="dark:bg-blue-900/20"
                            color="blue.700"
                            className="dark:text-blue-400"
                            ringWidth="1px"
                            ringColor="blue.200"
                            className="dark:ring-blue-800/30"
                          >
                            {stats?.uptime || 0}%
                          </Badge>
                          <Text fontSize="xs" fontWeight="medium" color="gray.500" className="dark:text-gray-400">
                            Uptime
                          </Text>
                        </HStack>
                      </VStack>
                      <Box
                        h={14}
                        w={14}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="2xl"
                        bg="blue.50"
                        className="dark:bg-blue-900/20"
                        ringWidth="1px"
                        ringColor="blue.200"
                        className="dark:ring-blue-800/30"
                      >
                        <Cpu size={28} color="#2563eb" />
                      </Box>
                    </Flex>
                  </CardBody>
                </CardRoot>

                <CardRoot
                  borderRadius="2xl"
                  borderWidth="1px"
                  borderColor="gray.200"
                  className="dark:border-gray-700/60"
                  bg="white"
                  className="dark:bg-gray-900"
                  shadow="sm"
                  _hover={{ borderColor: "amber.300", borderOpacity: 0.5 }}
                  className="dark:hover:border-amber-600/50"
                  transition="all 0.3s"
                >
                  <CardBody p={6}>
                    <Flex align="flex-start" justify="space-between">
                      <VStack align="flex-start" gap={4} flex={1}>
                        <Text fontSize="2xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="widest" color="gray.400" className="dark:text-gray-400">
                          Alerts heute
                        </Text>
                        <Text fontSize="4xl" fontWeight="bold" color="gray.900" className="dark:text-gray-100">
                          {stats?.alertsToday || 0}
                        </Text>
                        <HStack gap={2}>
                          <Badge
                            borderRadius="full"
                            px={2.5}
                            py={1}
                            fontSize="xs"
                            fontWeight="semibold"
                            bg="emerald.50"
                            className="dark:bg-emerald-900/20"
                            color="emerald.700"
                            className="dark:text-emerald-400"
                            ringWidth="1px"
                            ringColor="emerald.200"
                            className="dark:ring-emerald-800/30"
                          >
                            <HStack gap={1}>
                              <TrendingUp size={12} />
                              <Text>{alerts.filter((a) => a.status === "resolved").length}</Text>
                            </HStack>
                          </Badge>
                          <Text fontSize="xs" fontWeight="medium" color="gray.500" className="dark:text-gray-400">
                            behoben
                          </Text>
                        </HStack>
                      </VStack>
                      <Box
                        h={14}
                        w={14}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="2xl"
                        bg="amber.50"
                        className="dark:bg-amber-900/20"
                        ringWidth="1px"
                        ringColor="amber.200"
                        className="dark:ring-amber-800/30"
                      >
                        <AlertTriangle size={28} color="#d97706" />
                      </Box>
                    </Flex>
                  </CardBody>
                </CardRoot>

                <CardRoot
                  borderRadius="2xl"
                  borderWidth="1px"
                  borderColor="gray.200"
                  className="dark:border-gray-700/60"
                  bg="white"
                  className="dark:bg-gray-900"
                  shadow="sm"
                  _hover={{ borderColor: "emerald.300", borderOpacity: 0.5 }}
                  className="dark:hover:border-emerald-600/50"
                  transition="all 0.3s"
                >
                  <CardBody p={6}>
                    <Flex align="flex-start" justify="space-between">
                      <VStack align="flex-start" gap={4} flex={1}>
                        <Text fontSize="2xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="widest" color="gray.400" className="dark:text-gray-400">
                          System-Status
                        </Text>
                        <Text fontSize="4xl" fontWeight="bold" color="emerald.600" className="dark:text-emerald-400">
                          {stats?.systemStatus === "online" ? "Online" : "Offline"}
                        </Text>
                        <HStack gap={1.5}>
                          <Box
                            h={2}
                            w={2}
                            borderRadius="full"
                            bg="emerald.500"
                            className="dark:bg-emerald-400"
                            ringWidth="2px"
                            ringColor="emerald.200"
                            className="dark:ring-emerald-800"
                            animation="pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
                          />
                          <Text fontSize="xs" fontWeight="medium" color="gray.500" className="dark:text-gray-400">
                            Alle Systeme operativ
                          </Text>
                        </HStack>
                      </VStack>
                      <Box
                        h={14}
                        w={14}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="2xl"
                        bg="emerald.50"
                        className="dark:bg-emerald-900/20"
                        ringWidth="1px"
                        ringColor="emerald.200"
                        className="dark:ring-emerald-800/30"
                      >
                        <CheckCircle size={28} color="#10b981" />
                      </Box>
                    </Flex>
                  </CardBody>
                </CardRoot>
              </SimpleGrid>

              {/* Main Content Grid */}
              <Grid templateColumns={{ base: "1fr", lg: "repeat(12, 1fr)" }} gap={6}>
                {/* Main Content - Left Side */}
                <GridItem colSpan={{ base: 1, lg: 8 }}>
                  <VStack gap={6} align="stretch">
                    {/* Recent Activity */}
                    <CardRoot
                      borderRadius="2xl"
                      borderWidth="1px"
                      borderColor="gray.200"
                      className="dark:border-gray-700/60"
                      bg="white"
                      className="dark:bg-gray-900"
                      shadow="sm"
                      overflow="hidden"
                    >
                      <CardHeader
                        borderBottomWidth="1px"
                        borderColor="gray.200"
                        className="dark:border-gray-700/60"
                        bg="white"
                        className="dark:bg-gray-800"
                        px={6}
                        py={5}
                      >
                        <Flex align="center" justify="space-between">
                          <VStack align="flex-start" gap={1.5}>
                            <Text fontSize="xl" fontWeight="bold" color="gray.900" className="dark:text-gray-100">
                              Letzte Aktivitäten
                            </Text>
                            <Text fontSize="xs" fontWeight="medium" color="gray.500" className="dark:text-gray-400">
                              Echtzeit-Updates aus allen Systemen
                            </Text>
                          </VStack>
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            rightIcon={<ChevronRight size={16} />}
                            color="brand.500"
                            _hover={{ bg: "brand.500", opacity: 0.05 }}
                            className="dark:hover:bg-brand-500/10"
                            borderRadius="lg"
                          >
                            <Link href="/dashboard/activities">
                              Alle anzeigen
                            </Link>
                          </Button>
                        </Flex>
                      </CardHeader>
                      <CardBody p={0}>
                        {activities.length === 0 ? (
                          <Center px={6} py={16}>
                            <VStack gap={4}>
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
                                <Activity size={24} color="#9ca3af" />
                              </Box>
                              <Text fontSize="sm" fontWeight="medium" color="gray.500" className="dark:text-gray-400">
                                Keine Aktivitäten vorhanden
                              </Text>
                            </VStack>
                          </Center>
                        ) : (
                          <VStack gap={0} align="stretch" divider={<Separator />}>
                            {activities.map((activity) => (
                              <Box
                                key={activity.id}
                                px={6}
                                py={4}
                                _hover={{ bg: "gray.50" }}
                                className="dark:hover:bg-gray-800/50"
                                transition="all 0.2s"
                              >
                                <Flex align="flex-start" gap={4}>
                                  <Box
                                    h={11}
                                    w={11}
                                    flexShrink={0}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    borderRadius="xl"
                                    borderWidth="1px"
                                    borderColor="inset"
                                    bg={
                                      activity.status === "success"
                                        ? "emerald.50"
                                        : activity.status === "info"
                                          ? "blue.50"
                                          : "amber.50"
                                    }
                                    className={
                                      activity.status === "success"
                                        ? "dark:bg-emerald-900/30"
                                        : activity.status === "info"
                                          ? "dark:bg-blue-900/30"
                                          : "dark:bg-amber-900/30"
                                    }
                                    color={
                                      activity.status === "success"
                                        ? "emerald.600"
                                        : activity.status === "info"
                                          ? "blue.600"
                                          : "amber.600"
                                    }
                                    className={
                                      activity.status === "success"
                                        ? "dark:text-emerald-400"
                                        : activity.status === "info"
                                          ? "dark:text-blue-400"
                                          : "dark:text-amber-400"
                                    }
                                  >
                                    {getActivityIcon(activity.status)}
                                  </Box>
                                  <VStack align="flex-start" gap={2} flex={1} minW={0}>
                                    <Text fontSize="sm" fontWeight="semibold" color="gray.900" className="dark:text-gray-100">
                                      {activity.action}
                                    </Text>
                                    <HStack gap={2} fontSize="xs" color="gray.500" className="dark:text-gray-400">
                                      <Text fontWeight="semibold" color="gray.600" className="dark:text-gray-300">
                                        {activity.system}
                                      </Text>
                                      <Text color="gray.300" className="dark:text-gray-600">•</Text>
                                      <Text fontWeight="medium">
                                        {formatTime(activity.timestamp)}
                                      </Text>
                                    </HStack>
                                  </VStack>
                                  <Box flexShrink={0} opacity={0} _groupHover={{ opacity: 1 }} transition="opacity 0.2s">
                                    <ChevronRight size={16} color="#9ca3af" />
                                  </Box>
                                </Flex>
                              </Box>
                            ))}
                          </VStack>
                        )}
                      </CardBody>
                    </CardRoot>

                    {/* Performance Overview */}
                    <CardRoot
                      borderRadius="2xl"
                      borderWidth="1px"
                      borderColor="gray.200"
                      className="dark:border-gray-700/60"
                      bg="white"
                      className="dark:bg-gray-900"
                      shadow="sm"
                      overflow="hidden"
                    >
                      <CardHeader
                        borderBottomWidth="1px"
                        borderColor="gray.200"
                        className="dark:border-gray-700/60"
                        bg="white"
                        className="dark:bg-gray-800"
                        px={6}
                        py={5}
                      >
                        <VStack align="flex-start" gap={1.5}>
                          <Text fontSize="xl" fontWeight="bold" color="gray.900" className="dark:text-gray-100">
                            Performance-Übersicht
                          </Text>
                          <Text fontSize="xs" fontWeight="medium" color="gray.500" className="dark:text-gray-400">
                            Systemleistung der letzten 24 Stunden
                          </Text>
                        </VStack>
                      </CardHeader>
                      <CardBody p={6}>
                        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={6}>
                          <VStack gap={3} align="stretch">
                            <Flex align="center" justify="space-between">
                              <HStack gap={2}>
                                <Cpu size={16} color="#9ca3af" />
                                <Text fontSize="sm" fontWeight="semibold" color="gray.700" className="dark:text-gray-300">
                                  CPU-Auslastung
                                </Text>
                              </HStack>
                              <Badge
                                borderRadius="full"
                                px={2.5}
                                py={1}
                                fontSize="sm"
                                fontWeight="bold"
                                bg="gray.100"
                                className="dark:bg-gray-700"
                                color="gray.900"
                                className="dark:text-gray-100"
                              >
                                {metrics?.cpu || 0}%
                              </Badge>
                            </Flex>
                            <ProgressRoot value={metrics?.cpu || 0} borderRadius="full" h={2.5}>
                              <ProgressTrack bg="gray.200" className="dark:bg-gray-700" borderRadius="full">
                                <ProgressRange bg="brand.500" borderRadius="full" />
                              </ProgressTrack>
                            </ProgressRoot>
                          </VStack>
                          <VStack gap={3} align="stretch">
                            <Flex align="center" justify="space-between">
                              <HStack gap={2}>
                                <HardDrive size={16} color="#9ca3af" />
                                <Text fontSize="sm" fontWeight="semibold" color="gray.700" className="dark:text-gray-300">
                                  Speicher
                                </Text>
                              </HStack>
                              <Badge
                                borderRadius="full"
                                px={2.5}
                                py={1}
                                fontSize="sm"
                                fontWeight="bold"
                                bg="blue.100"
                                className="dark:bg-blue-900/30"
                                color="blue.700"
                                className="dark:text-blue-400"
                              >
                                {metrics?.memory || 0}%
                              </Badge>
                            </Flex>
                            <ProgressRoot value={metrics?.memory || 0} borderRadius="full" h={2.5}>
                              <ProgressTrack bg="gray.200" className="dark:bg-gray-700" borderRadius="full">
                                <ProgressRange bg="blue.600" className="dark:bg-blue-500" borderRadius="full" />
                              </ProgressTrack>
                            </ProgressRoot>
                          </VStack>
                          <VStack gap={3} align="stretch">
                            <Flex align="center" justify="space-between">
                              <HStack gap={2}>
                                <Network size={16} color="#9ca3af" />
                                <Text fontSize="sm" fontWeight="semibold" color="gray.700" className="dark:text-gray-300">
                                  Netzwerk
                                </Text>
                              </HStack>
                              <Badge
                                borderRadius="full"
                                px={2.5}
                                py={1}
                                fontSize="sm"
                                fontWeight="bold"
                                bg="emerald.100"
                                className="dark:bg-emerald-900/30"
                                color="emerald.700"
                                className="dark:text-emerald-400"
                              >
                                {metrics?.network || 0}%
                              </Badge>
                            </Flex>
                            <ProgressRoot value={metrics?.network || 0} borderRadius="full" h={2.5}>
                              <ProgressTrack bg="gray.200" className="dark:bg-gray-700" borderRadius="full">
                                <ProgressRange bg="emerald.600" className="dark:bg-emerald-500" borderRadius="full" />
                              </ProgressTrack>
                            </ProgressRoot>
                          </VStack>
                          <VStack gap={3} align="stretch">
                            <Flex align="center" justify="space-between">
                              <HStack gap={2}>
                                <HardDrive size={16} color="#9ca3af" />
                                <Text fontSize="sm" fontWeight="semibold" color="gray.700" className="dark:text-gray-300">
                                  Storage
                                </Text>
                              </HStack>
                              <Badge
                                borderRadius="full"
                                px={2.5}
                                py={1}
                                fontSize="sm"
                                fontWeight="bold"
                                bg="amber.100"
                                className="dark:bg-amber-900/30"
                                color="amber.700"
                                className="dark:text-amber-400"
                              >
                                {metrics?.storage || 0}%
                              </Badge>
                            </Flex>
                            <ProgressRoot value={metrics?.storage || 0} borderRadius="full" h={2.5}>
                              <ProgressTrack bg="gray.200" className="dark:bg-gray-700" borderRadius="full">
                                <ProgressRange bg="amber.600" className="dark:bg-amber-500" borderRadius="full" />
                              </ProgressTrack>
                            </ProgressRoot>
                          </VStack>
                        </SimpleGrid>
                      </CardBody>
                    </CardRoot>
                  </VStack>
                </GridItem>

                {/* Sidebar Widgets */}
                <GridItem colSpan={{ base: 1, lg: 4 }}>
                  <VStack gap={6} align="stretch">
                    {/* Quick Actions */}
                    <CardRoot
                      borderRadius="2xl"
                      borderWidth="1px"
                      borderColor="gray.200"
                      className="dark:border-gray-700/60"
                      bg="white"
                      className="dark:bg-gray-900"
                      shadow="sm"
                      overflow="hidden"
                    >
                      <CardHeader
                        borderBottomWidth="1px"
                        borderColor="gray.200"
                        className="dark:border-gray-700/60"
                        bg="white"
                        className="dark:bg-gray-800"
                        px={6}
                        py={5}
                      >
                        <Text fontSize="lg" fontWeight="bold" color="gray.900" className="dark:text-gray-100">
                          Schnellzugriff
                        </Text>
                      </CardHeader>
                      <CardBody p={4}>
                        <VStack gap={2.5} align="stretch">
                          <Button
                            w="100%"
                            variant="outline"
                            justifyContent="space-between"
                            onClick={() => setShowCreateProject(true)}
                            borderRadius="xl"
                            borderWidth="1px"
                            borderColor="gray.200"
                            className="dark:border-gray-700/60"
                            bg="white"
                            className="dark:bg-gray-800"
                            color="gray.700"
                            className="dark:text-gray-100"
                            _hover={{ borderColor: "brand.500", borderOpacity: 0.4, bg: "brand.500", opacity: 0.05 }}
                            className="dark:hover:border-brand-500/50 dark:hover:bg-brand-500/10 dark:hover:text-brand-500"
                            fontSize="sm"
                            fontWeight="semibold"
                            transition="all 0.2s"
                          >
                            <HStack gap={3}>
                              <Box
                                h={9}
                                w={9}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                borderRadius="xl"
                                bg="brand.500"
                                opacity={0.1}
                                ringWidth="1px"
                                ringColor="brand.500"
                                ringOpacity={0.2}
                                className="dark:ring-brand-500/20"
                              >
                                <Plus size={16} color="#e2001a" />
                              </Box>
                              <Text>Neues Projekt</Text>
                            </HStack>
                            <ChevronRight size={16} color="#9ca3af" />
                          </Button>
                          <Button
                            asChild
                            w="100%"
                            variant="outline"
                            justifyContent="space-between"
                            borderRadius="xl"
                            borderWidth="1px"
                            borderColor="gray.200"
                            className="dark:border-gray-700/60"
                            bg="white"
                            className="dark:bg-gray-800"
                            color="gray.700"
                            className="dark:text-gray-100"
                            _hover={{ borderColor: "blue.300", borderOpacity: 0.5, bg: "blue.50", opacity: 0.5 }}
                            className="dark:hover:border-blue-600/50 dark:hover:bg-blue-900/20"
                            fontSize="sm"
                            fontWeight="semibold"
                            transition="all 0.2s"
                          >
                            <Link href="/dashboard/telemetry">
                              <HStack gap={3}>
                                <Box
                                  h={9}
                                  w={9}
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  borderRadius="xl"
                                  bg="blue.50"
                                  className="dark:bg-blue-900/20"
                                  ringWidth="1px"
                                  ringColor="blue.200"
                                  className="dark:ring-blue-800/30"
                                >
                                  <BarChart3 size={16} color="#2563eb" />
                                </Box>
                                <Text>Telemetrie anzeigen</Text>
                              </HStack>
                              <ChevronRight size={16} color="#9ca3af" />
                            </Link>
                          </Button>
                          <Button
                            asChild
                            w="100%"
                            variant="outline"
                            justifyContent="space-between"
                            borderRadius="xl"
                            borderWidth="1px"
                            borderColor="gray.200"
                            className="dark:border-gray-700/60"
                            bg="white"
                            className="dark:bg-gray-800"
                            color="gray.700"
                            className="dark:text-gray-100"
                            _hover={{ borderColor: "emerald.300", borderOpacity: 0.5, bg: "emerald.50", opacity: 0.5 }}
                            className="dark:hover:border-emerald-600/50 dark:hover:bg-emerald-900/20"
                            fontSize="sm"
                            fontWeight="semibold"
                            transition="all 0.2s"
                          >
                            <Link href="/dashboard/reports">
                              <HStack gap={3}>
                                <Box
                                  h={9}
                                  w={9}
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  borderRadius="xl"
                                  bg="emerald.50"
                                  className="dark:bg-emerald-900/20"
                                  ringWidth="1px"
                                  ringColor="emerald.200"
                                  className="dark:ring-emerald-800/30"
                                >
                                  <FileText size={16} color="#10b981" />
                                </Box>
                                <Text>Reports generieren</Text>
                              </HStack>
                              <ChevronRight size={16} color="#9ca3af" />
                            </Link>
                          </Button>
                        </VStack>
                      </CardBody>
                    </CardRoot>

                    {/* System Status Widget */}
                    <CardRoot
                      borderRadius="2xl"
                      borderWidth="1px"
                      borderColor="gray.200"
                      className="dark:border-gray-700/60"
                      bg="white"
                      className="dark:bg-gray-900"
                      shadow="sm"
                      ringWidth="1px"
                      ringColor="gray.200"
                      className="dark:ring-gray-800"
                      p={6}
                    >
                      <Flex align="center" gap={3} mb={5}>
                        <Box
                          h={14}
                          w={14}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          borderRadius="2xl"
                          bg="emerald.50"
                          className="dark:bg-emerald-900/20"
                          ringWidth="1px"
                          ringColor="emerald.200"
                          className="dark:ring-emerald-800/30"
                        >
                          <Zap size={28} color="#10b981" />
                        </Box>
                        <VStack align="flex-start" gap={0}>
                          <Text fontSize="sm" fontWeight="bold" color="gray.900" className="dark:text-gray-100">
                            System bereit
                          </Text>
                          <Text fontSize="xs" fontWeight="medium" color="gray.500" className="dark:text-gray-400">
                            Alle Services online
                          </Text>
                        </VStack>
                      </Flex>
                      <VStack gap={3.5} align="stretch" borderTopWidth="1px" borderColor="gray.200" className="dark:border-gray-700/60" pt={5}>
                        <Flex
                          align="center"
                          justify="space-between"
                          borderRadius="lg"
                          bg="white"
                          opacity={0.6}
                          className="dark:bg-gray-800/60"
                          px={3}
                          py={2.5}
                          ringWidth="1px"
                          ringColor="gray.200"
                          className="dark:ring-gray-700/50"
                        >
                          <Text fontSize="xs" fontWeight="semibold" color="gray.600" className="dark:text-gray-300">
                            API-Status
                          </Text>
                          <HStack gap={1.5}>
                            <Box
                              h={1.5}
                              w={1.5}
                              borderRadius="full"
                              bg="emerald.500"
                              className="dark:bg-emerald-400"
                              ringWidth="1px"
                              ringColor="emerald.200"
                              className="dark:ring-emerald-800"
                            />
                            <Text fontSize="xs" fontWeight="bold" color="emerald.600" className="dark:text-emerald-400">
                              Online
                            </Text>
                          </HStack>
                        </Flex>
                        <Flex
                          align="center"
                          justify="space-between"
                          borderRadius="lg"
                          bg="white"
                          opacity={0.6}
                          className="dark:bg-gray-800/60"
                          px={3}
                          py={2.5}
                          ringWidth="1px"
                          ringColor="gray.200"
                          className="dark:ring-gray-700/50"
                        >
                          <Text fontSize="xs" fontWeight="semibold" color="gray.600" className="dark:text-gray-300">
                            Datenbank
                          </Text>
                          <HStack gap={1.5}>
                            <Box
                              h={1.5}
                              w={1.5}
                              borderRadius="full"
                              bg="emerald.500"
                              className="dark:bg-emerald-400"
                              ringWidth="1px"
                              ringColor="emerald.200"
                              className="dark:ring-emerald-800"
                            />
                            <Text fontSize="xs" fontWeight="bold" color="emerald.600" className="dark:text-emerald-400">
                              Verbunden
                            </Text>
                          </HStack>
                        </Flex>
                        <Flex
                          align="center"
                          justify="space-between"
                          borderRadius="lg"
                          bg="white"
                          opacity={0.6}
                          className="dark:bg-gray-800/60"
                          px={3}
                          py={2.5}
                          ringWidth="1px"
                          ringColor="gray.200"
                          className="dark:ring-gray-700/50"
                        >
                          <Text fontSize="xs" fontWeight="semibold" color="gray.600" className="dark:text-gray-300">
                            Cache
                          </Text>
                          <HStack gap={1.5}>
                            <Box
                              h={1.5}
                              w={1.5}
                              borderRadius="full"
                              bg="emerald.500"
                              className="dark:bg-emerald-400"
                              ringWidth="1px"
                              ringColor="emerald.200"
                              className="dark:ring-emerald-800"
                            />
                            <Text fontSize="xs" fontWeight="bold" color="emerald.600" className="dark:text-emerald-400">
                              Aktiv
                            </Text>
                          </HStack>
                        </Flex>
                      </VStack>
                    </CardRoot>

                    {/* Recent Projects */}
                    <CardRoot
                      borderRadius="2xl"
                      borderWidth="1px"
                      borderColor="gray.200"
                      className="dark:border-gray-700/60"
                      bg="white"
                      className="dark:bg-gray-900"
                      shadow="sm"
                      overflow="hidden"
                    >
                      <CardHeader
                        borderBottomWidth="1px"
                        borderColor="gray.200"
                        className="dark:border-gray-700/60"
                        bg="white"
                        className="dark:bg-gray-800"
                        px={6}
                        py={5}
                      >
                        <Text fontSize="lg" fontWeight="bold" color="gray.900" className="dark:text-gray-100">
                          Aktuelle Projekte
                        </Text>
                      </CardHeader>
                      <CardBody p={4}>
                        <VStack gap={3} align="stretch">
                          {projects.length === 0 ? (
                            <Center py={8}>
                              <VStack gap={4}>
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
                            projects.slice(0, 3).map((project) => (
                              <Button
                                key={project.id}
                                w="100%"
                                variant="outline"
                                onClick={() => {
                                  setSelectedProject(project);
                                  setShowProjectDetails(true);
                                }}
                                borderRadius="xl"
                                borderWidth="1px"
                                borderColor="gray.200"
                                className="dark:border-gray-700/60"
                                bg="white"
                                className="dark:bg-gray-800"
                                p={4}
                                textAlign="left"
                                _hover={{ borderColor: "brand.500", borderOpacity: 0.4, bg: "brand.500", opacity: 0.05 }}
                                className="dark:hover:border-brand-500/50 dark:hover:bg-brand-500/10"
                                shadow="sm"
                                transition="all 0.2s"
                              >
                                <VStack gap={3} align="stretch" w="100%">
                                  <Flex align="center" justify="space-between">
                                    <Text fontSize="sm" fontWeight="bold" color="gray.900" className="dark:text-gray-100">
                                      {project.name}
                                    </Text>
                                    <Badge
                                      borderRadius="full"
                                      px={2.5}
                                      py={1}
                                      fontSize="xs"
                                      fontWeight="bold"
                                      bg="gray.100"
                                      className="dark:bg-gray-700"
                                      color="gray.700"
                                      className="dark:text-gray-300"
                                      ringWidth="1px"
                                      ringColor="gray.200"
                                      className="dark:ring-gray-600/50"
                                    >
                                      {project.progress}%
                                    </Badge>
                                  </Flex>
                                  <ProgressRoot value={project.progress} borderRadius="full" h={2}>
                                    <ProgressTrack bg="gray.200" className="dark:bg-gray-700" borderRadius="full">
                                      <ProgressRange bg="brand.500" borderRadius="full" />
                                    </ProgressTrack>
                                  </ProgressRoot>
                                </VStack>
                              </Button>
                            ))
                          )}
                        </VStack>
                      </CardBody>
                    </CardRoot>
                  </VStack>
                </GridItem>
              </Grid>
            </VStack>
          </Box>
        </Box>
      </Box>
    </SessionProvider>
  );
}
