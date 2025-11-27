// Dashboard Data Models

export type ActivityStatus = "success" | "info" | "warning" | "error";

export interface Activity {
  id: string;
  action: string;
  system: string;
  time: string;
  status: ActivityStatus;
  timestamp: Date;
  icon?: React.ReactNode;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  progress: number;
  status: "active" | "completed" | "archived" | "pending";
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "acknowledged" | "resolved";
  system: string;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface TelemetryData {
  id: string;
  system: string;
  component: string;
  value: number;
  unit: string;
  timestamp: Date;
  status: "normal" | "warning" | "critical";
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  network: number;
  storage: number;
  timestamp: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: Date;
  userId: string;
  actionUrl?: string;
}

export interface DashboardStats {
  activeProjects: number;
  totalComponents: number;
  alertsToday: number;
  systemStatus: "online" | "offline" | "degraded";
  uptime: number;
}

export interface Report {
  id: string;
  name: string;
  type: "telemetry" | "performance" | "alerts" | "custom";
  generatedAt: Date;
  fileUrl?: string;
  status: "pending" | "generating" | "completed" | "failed";
}

