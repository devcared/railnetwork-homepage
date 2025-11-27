"use client";

import { useState, useEffect } from "react";
import type { Session } from "next-auth";
import type {
  Activity,
  Project,
  Alert,
  SystemMetrics,
  DashboardStats,
  Notification,
} from "@/lib/models";

type UseDashboardProps = {
  session: Session | null;
};

export function useDashboard({ session }: UseDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setMetrics(data.metrics);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch("/api/dashboard/activities?limit=10");
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities);
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/dashboard/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await fetch("/api/dashboard/alerts");
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.alerts);
      }
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/dashboard/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const createProject = async (projectData: {
    name: string;
    description?: string;
    status?: "active" | "completed" | "archived" | "pending";
  }) => {
    try {
      const response = await fetch("/api/dashboard/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const data = await response.json();
        await fetchProjects();
        await fetchStats();
        await fetchNotifications();
        return data.project;
      }
      throw new Error("Failed to create project");
    } catch (error) {
      console.error("Failed to create project:", error);
      throw error;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const response = await fetch(`/api/dashboard/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        await fetchProjects();
        await fetchStats();
        return true;
      }
      throw new Error("Failed to update project");
    } catch (error) {
      console.error("Failed to update project:", error);
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/dashboard/projects/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchProjects();
        await fetchStats();
        return true;
      }
      throw new Error("Failed to delete project");
    } catch (error) {
      console.error("Failed to delete project:", error);
      throw error;
    }
  };

  const updateAlert = async (id: string, updates: Partial<Alert>) => {
    try {
      const response = await fetch(`/api/dashboard/alerts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        await fetchAlerts();
        await fetchStats();
        return true;
      }
      throw new Error("Failed to update alert");
    } catch (error) {
      console.error("Failed to update alert:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (!session?.user) return;

    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchStats(),
        fetchActivities(),
        fetchProjects(),
        fetchAlerts(),
        fetchNotifications(),
      ]);
      setLoading(false);
    };

    loadData();

    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchStats();
      fetchActivities();
      fetchAlerts();
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [session]);

  return {
    loading,
    stats,
    metrics,
    activities,
    projects,
    alerts,
    notifications,
    unreadCount,
    refresh: {
      stats: fetchStats,
      activities: fetchActivities,
      projects: fetchProjects,
      alerts: fetchAlerts,
      notifications: fetchNotifications,
    },
    actions: {
      createProject,
      updateProject,
      deleteProject,
      updateAlert,
    },
  };
}

