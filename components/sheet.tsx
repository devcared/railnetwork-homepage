"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  size?: "sm" | "md" | "lg" | "xl" | "full";
  ariaLabel?: string;
};

const horizontalSizeClasses = {
  sm: "w-full max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg",
  md: "w-full max-w-xl sm:max-w-xl lg:max-w-2xl",
  lg: "w-full max-w-2xl sm:max-w-3xl",
  xl: "w-full max-w-3xl sm:max-w-4xl",
  full: "w-full",
};

const sideClasses = {
  left: "left-0 top-0 h-full",
  right: "right-0 top-0 h-full",
  top: "top-4 left-1/2 -translate-x-1/2 w-full px-4",
  bottom: "bottom-4 left-1/2 -translate-x-1/2 w-full px-4",
};

const sideBorderClasses = {
  left: "border-r",
  right: "border-l",
  top: "border-b",
  bottom: "border-t",
} as const;

const cornerClasses = {
  left: "rounded-r-3xl",
  right: "rounded-l-3xl",
  top: "rounded-b-3xl",
  bottom: "rounded-t-3xl",
} as const;

const sideAnimations = {
  left: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
  },
  right: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
  },
  top: {
    initial: { y: "-100%" },
    animate: { y: 0 },
    exit: { y: "-100%" },
  },
  bottom: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
  },
};

export default function Sheet({
  open,
  onOpenChange,
  children,
  side = "right",
  size = "md",
  ariaLabel,
}: SheetProps) {
  const animation = sideAnimations[side];
  const isVertical = side === "top" || side === "bottom";
  const verticalHeights = {
    sm: "max-h-[45vh]",
    md: "max-h-[60vh]",
    lg: "max-h-[75vh]",
    xl: "max-h-[85vh]",
    full: "h-full",
  } as const;
  const sheetWidth = isVertical ? "w-full" : horizontalSizeClasses[size];
  const sheetHeight = isVertical ? verticalHeights[size] : "h-full";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={animation.initial}
            animate={animation.animate}
            exit={animation.exit}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel || "Sheet Panel"}
            data-sheet-side={side}
            className={`fixed z-50 ${sideClasses[side]} ${sheetWidth} ${sheetHeight} overflow-hidden ${cornerClasses[side]} ${sideBorderClasses[side]} border-slate-200/70 bg-white/95 shadow-[0_45px_120px_-40px_rgba(15,23,42,0.45)] ring-1 ring-slate-200/60 backdrop-blur-xl`}
          >
            <div className="relative flex h-full flex-col bg-gradient-to-b from-white/98 via-white to-white">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#e2001a] via-[#ff6f61] to-[#ffb347]" />
              <button
                onClick={() => onOpenChange(false)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/60 bg-white/80 text-slate-500 shadow-sm transition hover:border-[#e2001a]/40 hover:text-[#e2001a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e2001a]/40"
                aria-label="Sheet schließen"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex-1 overflow-hidden">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

type SheetContentProps = {
  children: ReactNode;
  className?: string;
};

export function SheetContent({ children, className = "" }: SheetContentProps) {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200">
      <div
        className={`mx-auto w-full max-w-4xl px-6 py-6 sm:px-10 sm:py-8 space-y-6 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

type SheetHeaderProps = {
  children: ReactNode;
  className?: string;
  sticky?: boolean;
};

export function SheetHeader({
  children,
  className = "",
  sticky = true,
}: SheetHeaderProps) {
  return (
    <div
      className={`flex-shrink-0 border-b border-slate-200/70 bg-gradient-to-r from-slate-50/70 to-white px-6 py-5 sm:px-10 ${
        sticky ? "sticky top-0 z-10" : ""
      } ${className}`}
    >
      <div className="mx-auto w-full max-w-4xl">{children}</div>
    </div>
  );
}

type SheetFooterProps = {
  children: ReactNode;
  className?: string;
};

export function SheetFooter({ children, className = "" }: SheetFooterProps) {
  return (
    <div
      className={`flex-shrink-0 border-t border-slate-200/70 bg-slate-50/90 px-6 py-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:px-10 ${className}`}
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        {children}
      </div>
    </div>
  );
}

type SheetTitleProps = {
  children: ReactNode;
  className?: string;
};

export function SheetTitle({ children, className = "" }: SheetTitleProps) {
  return (
    <h2
      className={`font-db-screenhead text-2xl font-bold tracking-tight text-slate-900 ${className}`}
    >
      {children}
    </h2>
  );
}

type SheetDescriptionProps = {
  children: ReactNode;
  className?: string;
};

export function SheetDescription({
  children,
  className = "",
}: SheetDescriptionProps) {
  return (
    <p className={`mt-1 text-sm text-slate-600 ${className}`}>{children}</p>
  );
}

