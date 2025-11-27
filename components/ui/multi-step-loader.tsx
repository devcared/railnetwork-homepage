"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

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
    <div className="flex relative justify-start max-w-2xl mx-auto flex-col mt-40">
      {loadingStates.map((loadingState, index) => {
        const distance = Math.abs(index - value);
        const opacity = Math.max(1 - distance * 0.25, 0.3);

        return (
          <motion.div
            key={index}
            className={cn("text-left flex items-center gap-4 mb-6 px-5 py-4 rounded-xl transition-all", 
              index === value && "bg-[#e2001a]/10 backdrop-blur-sm border-2 border-[#e2001a]/30 shadow-lg ring-2 ring-[#e2001a]/10"
            )}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: opacity, 
              x: 0,
              scale: index === value ? 1.02 : 1
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="flex-shrink-0">
              {index < value ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e2001a] shadow-md ring-2 ring-[#e2001a]/20">
                  <CheckFilled className="h-5 w-5 text-white" />
                </div>
              ) : index === value ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e2001a] shadow-lg ring-4 ring-[#e2001a]/30">
                  <motion.div
                    className="h-5 w-5 rounded-full bg-white"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-300 bg-slate-50">
                  <div className="h-4 w-4 rounded-full bg-slate-300"></div>
                </div>
              )}
            </div>
            <span
              className={cn(
                "font-db-screensans text-base transition-all",
                index === value 
                  ? "text-slate-900 font-semibold" 
                  : index < value
                    ? "text-slate-700 font-medium"
                    : "text-slate-400 font-normal"
              )}
            >
              {loadingState.text}
            </span>
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
          className="w-full h-full fixed inset-0 z-[100] flex flex-col items-center justify-center backdrop-blur-xl"
          style={{
            background: "linear-gradient(135deg, #f3f6fb 0%, #ffffff 50%, #f3f6fb 100%)",
          }}
        >
          {/* DB-Style Header */}
          <div className="absolute top-0 left-0 right-0 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#e2001a] flex items-center justify-center shadow-md">
                <motion.div
                  className="h-6 w-6 rounded bg-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <div>
                <h2 className="font-db-screenhead text-xl font-bold text-slate-900">
                  Update wird installiert
                </h2>
                <p className="font-db-screensans text-xs text-slate-600 mt-0.5">
                  Bitte warten Sie, während die neue Version geladen wird
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative w-full max-w-4xl px-6 pt-24 pb-12">
            <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-2xl p-8">
              <LoaderCore value={currentState} loadingStates={loadingStates} />
            </div>
          </div>

          {/* DB-Style Footer Gradient */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
          
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#e2001a]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#e2001a]/5 rounded-full blur-3xl"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

