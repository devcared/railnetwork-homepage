"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

type LoadingState = {
  text: string;
};

export const MultiStepLoader = ({
  loadingStates,
  loading,
  duration = 2000,
  loop = false,
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950">
          <div className="w-full max-w-md px-6">
            {/* Header */}
            <div className="mb-8 text-center">
              <h2 className="font-db-screenhead text-xl font-bold text-slate-100 mb-2">
                Update wird installiert
              </h2>
              <p className="font-db-screensans text-sm text-slate-400">
                Schritt {currentState + 1} von {loadingStates.length}
              </p>
            </div>

            {/* Minimalistischer Loader */}
            <div className="space-y-3">
              {loadingStates.map((state, index) => {
                const isActive = index === currentState;
                const isCompleted = index < currentState;
                const isPending = index > currentState;

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-4 px-4 py-3 rounded-lg border transition-all duration-200 ${
                      isActive
                        ? "bg-slate-900 border-slate-700/60"
                        : isCompleted
                          ? "bg-slate-900 border-slate-700/60 opacity-60"
                          : "bg-slate-950 border-slate-800 opacity-40"
                    }`}
                  >
                    {/* Minimal Dot Indicator */}
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <div className="h-2 w-2 rounded-full bg-[#e2001a]" />
                      ) : isActive ? (
                        <div className="h-2 w-2 rounded-full bg-[#e2001a] animate-pulse" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-slate-700" />
                      )}
                    </div>

                    {/* Text */}
                    <span
                      className={`font-db-screensans text-sm transition-colors ${
                        isActive
                          ? "text-slate-100 font-medium"
                          : isCompleted
                            ? "text-slate-400 font-normal"
                            : "text-slate-500 font-normal"
                      }`}
                    >
                      {state.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Minimal Progress Line */}
            <div className="mt-8 h-px bg-slate-800 relative overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-[#e2001a] transition-all duration-500"
                style={{
                  width: `${((currentState + 1) / loadingStates.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
