"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  BellRing,
  CheckCircle2,
  Info,
  Loader2,
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

const toneClasses = {
  success: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  warning: "bg-amber-50 text-amber-600 ring-amber-100",
  error: "bg-red-50 text-red-600 ring-red-100",
  info: "bg-blue-50 text-blue-600 ring-blue-100",
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
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 shadow-sm transition hover:border-[#e2001a]/40 dark:hover:border-[#e2001a]/50 hover:bg-[#e2001a]/5 dark:hover:bg-[#e2001a]/10 hover:text-[#e2001a]"
        aria-label="Benachrichtigungen öffnen"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <Bell className="h-5 w-5 transition group-hover:scale-110" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#e2001a] px-1 text-[10px] font-bold text-white shadow-lg">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full z-50 mt-3 w-[30rem] overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 shadow-[0_20px_45px_-20px_rgba(15,23,42,0.3)]"
            >
              <div className="border-b border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e2001a]/10 ring-1 ring-[#e2001a]/15">
                      <BellRing className="h-5 w-5 text-[#e2001a]" />
                    </div>
                    <div>
                      <h3 className="font-db-screenhead text-base font-bold text-slate-900 dark:text-slate-100">
                        Benachrichtigungen
                      </h3>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {unreadCount > 0
                          ? `${unreadCount} ungelesen`
                          : "Alles gelesen"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => syncNotifications()}
                      className="rounded-lg border border-slate-200/60 dark:border-slate-700/60 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 transition hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-slate-100"
                    >
                      Aktualisieren
                    </button>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="rounded-lg bg-[#e2001a]/10 dark:bg-[#e2001a]/20 px-3 py-1.5 text-xs font-semibold text-[#e2001a] transition hover:bg-[#e2001a]/15 dark:hover:bg-[#e2001a]/25"
                      >
                        Alle lesen
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="max-h-96 divide-y divide-slate-100/70 dark:divide-slate-700/60 overflow-y-auto">
                {isLoading ? (
                  <div className="space-y-4 px-6 py-6">
                    {[0, 1, 2].map((item) => (
                      <div key={item} className="flex gap-3">
                        <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-700" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-100 dark:bg-slate-700" />
                          <div className="h-2.5 w-full animate-pulse rounded-full bg-slate-100 dark:bg-slate-700" />
                          <div className="h-2 w-1/2 animate-pulse rounded-full bg-slate-100 dark:bg-slate-700" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500">
                      <Bell className="h-6 w-6" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                      Keine Benachrichtigungen
                    </p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      Wir benachrichtigen dich, sobald etwas passiert.
                    </p>
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const Icon = iconComponents[notification.type];
                    return (
                      <div
                        key={notification.id}
                        className={`px-6 py-4 transition ${
                          !notification.read ? "bg-slate-50/80 dark:bg-slate-800/50" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl ring-1 ${toneClasses[notification.type]}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p
                                  className={`text-sm font-semibold ${
                                    !notification.read
                                      ? "text-slate-900 dark:text-slate-100"
                                      : "text-slate-700 dark:text-slate-300"
                                  }`}
                                >
                                  {notification.title}
                                </p>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                  {notification.message}
                                </p>
                              </div>
                              {!notification.read && (
                                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#e2001a]" />
                              )}
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                              <span>
                                {new Date(notification.createdAt).toLocaleString("de-DE")}
                              </span>
                              <div className="flex flex-1 justify-end gap-2">
                                {notification.actionUrl && (
                                  <Link
                                    href={notification.actionUrl}
                                    onClick={() => markAsRead(notification.id)}
                                    className="font-semibold text-[#e2001a] transition hover:text-[#c10015]"
                                  >
                                    Öffnen
                                  </Link>
                                )}
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-slate-500 dark:text-slate-400 transition hover:text-slate-900 dark:hover:text-slate-100"
                                  >
                                    Gelesen
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-slate-400 dark:text-slate-500 transition hover:text-red-500"
                                  aria-label="Benachrichtigung löschen"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

