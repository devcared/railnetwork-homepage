// In-Memory Data Store
// In production, this would be replaced with a real database

import type {
  Activity,
  Project,
  Alert,
  TelemetryData,
  SystemMetrics,
  Notification,
  DashboardStats,
  Report,
} from "./models";

// Mock Data Store
class DataStore {
  private activities: Activity[] = [];
  private projects: Project[] = [];
  private alerts: Alert[] = [];
  private telemetry: TelemetryData[] = [];
  private metrics: SystemMetrics[] = [];
  private notifications: Notification[] = [];
  private reports: Report[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize with mock data
    const now = new Date();
    
    this.activities = [
      {
        id: "1",
        action: "Neue Telemetrie-Daten empfangen",
        system: "Hamburg Hauptbahnhof",
        time: "Vor 5 Minuten",
        status: "success",
        timestamp: new Date(now.getTime() - 5 * 60000),
      },
      {
        id: "2",
        action: "Wartungsplan aktualisiert",
        system: "München Hbf",
        time: "Vor 12 Minuten",
        status: "info",
        timestamp: new Date(now.getTime() - 12 * 60000),
      },
      {
        id: "3",
        action: "Alert behoben",
        system: "Berlin Hbf",
        time: "Vor 23 Minuten",
        status: "success",
        timestamp: new Date(now.getTime() - 23 * 60000),
      },
      {
        id: "4",
        action: "Neues Projekt erstellt",
        system: "Frankfurt Hbf",
        time: "Vor 1 Stunde",
        status: "info",
        timestamp: new Date(now.getTime() - 60 * 60000),
      },
    ];

    this.projects = [
      {
        id: "1",
        name: "Hamburg Hbf Modernisierung",
        description: "Umfassende Modernisierung des Hauptbahnhofs",
        progress: 75,
        status: "active",
        createdAt: new Date(now.getTime() - 90 * 24 * 60 * 60000),
        updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60000),
        ownerId: "railnetwork-demo-user",
      },
      {
        id: "2",
        name: "München Signalnetz",
        description: "Erweiterung des Signalnetzes",
        progress: 45,
        status: "active",
        createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60000),
        updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60000),
        ownerId: "railnetwork-demo-user",
      },
      {
        id: "3",
        name: "Berlin Telemetrie",
        description: "Installation neuer Telemetrie-Sensoren",
        progress: 90,
        status: "active",
        createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60000),
        updatedAt: new Date(now.getTime() - 1 * 60 * 60000),
        ownerId: "railnetwork-demo-user",
      },
    ];

    this.alerts = [
      {
        id: "1",
        title: "Hohe CPU-Auslastung",
        message: "CPU-Auslastung über 80% für mehr als 5 Minuten",
        severity: "medium",
        status: "open",
        system: "Hamburg Hbf",
        createdAt: new Date(now.getTime() - 30 * 60000),
      },
      {
        id: "2",
        title: "Sensor-Ausfall",
        message: "Sensor #4521 antwortet nicht",
        severity: "high",
        status: "acknowledged",
        system: "München Hbf",
        createdAt: new Date(now.getTime() - 120 * 60000),
      },
      {
        id: "3",
        title: "Wartungsplan aktualisiert",
        message: "Neue Wartungstermine verfügbar",
        severity: "low",
        status: "resolved",
        system: "Berlin Hbf",
        createdAt: new Date(now.getTime() - 240 * 60000),
        resolvedAt: new Date(now.getTime() - 180 * 60000),
      },
    ];

    this.notifications = [
      {
        id: "1",
        title: "Neues Projekt erstellt",
        message: "Projekt 'Hamburg Hbf Modernisierung' wurde erfolgreich erstellt",
        type: "success",
        read: false,
        createdAt: new Date(now.getTime() - 60 * 60000),
        userId: "railnetwork-demo-user",
        actionUrl: "/dashboard/projects/1",
      },
      {
        id: "2",
        title: "Alert erkannt",
        message: "Neuer Alert in Hamburg Hbf: Hohe CPU-Auslastung",
        type: "warning",
        read: false,
        createdAt: new Date(now.getTime() - 30 * 60000),
        userId: "railnetwork-demo-user",
        actionUrl: "/dashboard/alerts/1",
      },
    ];

    this.metrics = [
      {
        cpu: 42,
        memory: 68,
        network: 23,
        storage: 55,
        timestamp: now,
      },
    ];
  }

  // Activities
  getActivities(limit?: number): Activity[] {
    const sorted = [...this.activities].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
    return limit ? sorted.slice(0, limit) : sorted;
  }

  addActivity(activity: Omit<Activity, "id" | "timestamp">): Activity {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    this.activities.unshift(newActivity);
    return newActivity;
  }

  // Projects
  getProjects(userId?: string): Project[] {
    let projects = [...this.projects];
    if (userId) {
      projects = projects.filter((p) => p.ownerId === userId);
    }
    return projects.sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  getProject(id: string): Project | undefined {
    return this.projects.find((p) => p.id === id);
  }

  createProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Project {
    const now = new Date();
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };
    this.projects.push(newProject);
    return newProject;
  }

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.projects[index] = {
      ...this.projects[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.projects[index];
  }

  deleteProject(id: string): boolean {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.projects.splice(index, 1);
    return true;
  }

  // Alerts
  getAlerts(status?: Alert["status"]): Alert[] {
    let alerts = [...this.alerts];
    if (status) {
      alerts = alerts.filter((a) => a.status === status);
    }
    return alerts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getAlert(id: string): Alert | undefined {
    return this.alerts.find((a) => a.id === id);
  }

  createAlert(alert: Omit<Alert, "id" | "createdAt">): Alert {
    const newAlert: Alert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    this.alerts.push(newAlert);
    return newAlert;
  }

  updateAlert(id: string, updates: Partial<Alert>): Alert | null {
    const index = this.alerts.findIndex((a) => a.id === id);
    if (index === -1) return null;
    this.alerts[index] = {
      ...this.alerts[index],
      ...updates,
    };
    if (updates.status === "resolved" && !this.alerts[index].resolvedAt) {
      this.alerts[index].resolvedAt = new Date();
    }
    return this.alerts[index];
  }

  // Notifications
  getNotifications(userId: string, unreadOnly?: boolean): Notification[] {
    let notifications = this.notifications.filter((n) => n.userId === userId);
    if (unreadOnly) {
      notifications = notifications.filter((n) => !n.read);
    }
    return notifications.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  createNotification(
    notification: Omit<Notification, "id" | "createdAt" | "read">
  ): Notification {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date(),
    };
    this.notifications.push(newNotification);
    return newNotification;
  }

  markNotificationAsRead(id: string, userId: string): boolean {
    const notification = this.notifications.find(
      (n) => n.id === id && n.userId === userId
    );
    if (!notification) return false;
    notification.read = true;
    return true;
  }

  markAllNotificationsAsRead(userId: string): number {
    let count = 0;
    this.notifications.forEach((n) => {
      if (n.userId === userId && !n.read) {
        n.read = true;
        count++;
      }
    });
    return count;
  }

  deleteNotification(id: string, userId: string): boolean {
    const index = this.notifications.findIndex(
      (n) => n.id === id && n.userId === userId
    );
    if (index === -1) return false;
    this.notifications.splice(index, 1);
    return true;
  }

  // Metrics
  getLatestMetrics(): SystemMetrics | null {
    return this.metrics.length > 0
      ? this.metrics[this.metrics.length - 1]
      : null;
  }

  updateMetrics(metrics: Omit<SystemMetrics, "timestamp">): SystemMetrics {
    const newMetrics: SystemMetrics = {
      ...metrics,
      timestamp: new Date(),
    };
    this.metrics.push(newMetrics);
    // Keep only last 100 entries
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }
    return newMetrics;
  }

  // Stats
  getDashboardStats(userId: string): DashboardStats {
    const userProjects = this.projects.filter((p) => p.ownerId === userId);
    const activeProjects = userProjects.filter((p) => p.status === "active");
    const todayAlerts = this.alerts.filter(
      (a) =>
        a.createdAt.toDateString() === new Date().toDateString() &&
        a.status !== "resolved"
    );

    return {
      activeProjects: activeProjects.length,
      totalComponents: 2100000,
      alertsToday: todayAlerts.length,
      systemStatus: "online",
      uptime: 99.8,
    };
  }

  // Reports
  getReports(userId?: string): Report[] {
    return [...this.reports].sort(
      (a, b) => b.generatedAt.getTime() - a.generatedAt.getTime()
    );
  }

  createReport(report: Omit<Report, "id" | "generatedAt">): Report {
    const newReport: Report = {
      ...report,
      id: Date.now().toString(),
      generatedAt: new Date(),
    };
    this.reports.push(newReport);
    return newReport;
  }
}

// Singleton instance
export const dataStore = new DataStore();

