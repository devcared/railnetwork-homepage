"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

const CheckIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={cn("w-5 h-5", className)}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" 
      />
    </svg>
  );
};

const CheckFilled = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("w-5 h-5", className)}
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

type LoadingState = {
  text: string;
};

const LoaderCore = ({
  loadingStates,
  value = 0,
}: {
  loadingStates: LoadingState[];
  value?: number;
}) => {
  return (
    <div className="flex relative justify-start max-w-2xl mx-auto flex-col space-y-3">
      {loadingStates.map((loadingState, index) => {
        const distance = Math.abs(index - value);
        const opacity = Math.max(1 - distance * 0.3, 0.4);
        const isActive = index === value;
        const isCompleted = index < value;
        const isPending = index > value;

        return (
          <motion.div
            key={index}
            className={cn(
              "group relative flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300",
              isActive && "bg-gradient-to-r from-[#e2001a]/10 via-[#e2001a]/5 to-transparent dark:from-[#e2001a]/20 dark:via-[#e2001a]/10 border-l-4 border-[#e2001a] shadow-md",
              isCompleted && "bg-slate-50 dark:bg-slate-800/50 border-l-4 border-emerald-500",
              isPending && "bg-slate-50/50 dark:bg-slate-800/30 border-l-4 border-slate-200 dark:border-slate-700"
            )}
            initial={{ opacity: 0, x: -30 }}
            animate={{ 
              opacity: opacity, 
              x: 0,
              scale: isActive ? 1.01 : 1
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* DB-Style Indicator */}
            <div className="flex-shrink-0 relative">
              {isCompleted ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg ring-2 ring-emerald-200">
                  <CheckFilled className="h-6 w-6 text-white" />
                </div>
              ) : isActive ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#e2001a] to-[#c10015] shadow-xl ring-4 ring-[#e2001a]/20">
                  <motion.div
                    className="h-6 w-6 rounded-lg bg-white"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                  <div className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-600"></div>
                </div>
              )}
            </div>

            {/* Text with DB-Style */}
            <div className="flex-1 min-w-0">
              <span
                className={cn(
                  "font-db-screensans text-base transition-all block",
                  isActive && "text-slate-900 dark:text-slate-100 font-semibold",
                  isCompleted && "text-slate-700 dark:text-slate-300 font-medium",
                  isPending && "text-slate-400 dark:text-slate-500 font-normal"
                )}
              >
                {loadingState.text}
              </span>
              {isActive && (
                <motion.div
                  className="mt-1 h-0.5 bg-gradient-to-r from-[#e2001a] to-transparent"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export const MultiStepLoader = ({
  loadingStates,
  loading,
  duration = 2000,
  loop = true,
}: {
  loadingStates: LoadingState[];
  loading?: boolean;
  duration?: number;
  loop?: boolean;
}) => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }
    const timeout = setTimeout(() => {
      setCurrentState((prevState) =>
        loop
          ? prevState === loadingStates.length - 1
            ? 0
            : prevState + 1
          : Math.min(prevState + 1, loadingStates.length - 1)
      );
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentState, loading, loop, loadingStates.length, duration]);
  
  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="w-full h-full fixed inset-0 z-[100] flex flex-col items-center justify-center backdrop-blur-xl bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
        >
          {/* DB-Style Header */}
          <div className="absolute top-0 left-0 right-0 border-b-2 border-[#e2001a]/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm px-6 py-5">
            <div className="max-w-7xl mx-auto flex items-center gap-4">
              {/* DB Logo Box */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#e2001a] to-[#c10015] shadow-lg ring-2 ring-[#e2001a]/20">
                <motion.div
                  className="h-7 w-7 rounded-lg bg-white"
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="font-db-screenhead text-2xl font-bold text-slate-900 dark:text-slate-100 relative">
                    Update wird installiert
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#e2001a] to-transparent" />
                  </h2>
                </div>
                <p className="font-db-screensans text-sm text-slate-600 dark:text-slate-400 mt-1.5">
                  Bitte warten Sie, während die neue Version geladen wird
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative w-full max-w-4xl px-6 pt-28 pb-16">
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl border-2 border-slate-200/80 dark:border-slate-700/60 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.4)] dark:shadow-[0_25px_60px_-30px_rgba(0,0,0,0.5)] p-10">
              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-db-screensans text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Fortschritt
                  </span>
                  <span className="font-db-screenhead text-sm font-bold text-[#e2001a]">
                    {currentState + 1} / {loadingStates.length}
                  </span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#e2001a] via-[#ff6f61] to-[#e2001a]"
                    initial={{ width: "0%" }}
                    animate={{ 
                      width: `${((currentState + 1) / loadingStates.length) * 100}%` 
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Steps */}
              <LoaderCore value={currentState} loadingStates={loadingStates} />
            </div>
          </div>

          {/* DB-Style Footer with Gradient Line */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-slate-950 dark:via-slate-900/90 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#e2001a]/30 to-transparent" />
          </div>
          
          {/* Decorative DB Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Top Left Gradient */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#e2001a]/8 via-transparent to-transparent rounded-full blur-3xl"></div>
            {/* Bottom Right Gradient */}
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-[#e2001a]/8 via-transparent to-transparent rounded-full blur-3xl"></div>
            {/* Center Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#e2001a]/3 rounded-full blur-3xl"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

