"use client"

import { useState, useEffect, useCallback } from "react"

export function usePerformanceMode() {
  const [isHighPerformanceMode, setIsHighPerformanceMode] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  const detectPerformance = useCallback(() => {
    // First check for user preference
    const userPreference = localStorage.getItem("highPerformanceMode")
    if (userPreference !== null) {
      setIsHighPerformanceMode(userPreference === "true")
      setIsInitialized(true)
      return
    }

    // Check for WebGL support (proxy for GPU capabilities)
    const hasWebGL = (() => {
      try {
        const canvas = document.createElement("canvas")
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
        )
      } catch (e) {
        return false
      }
    })()

    // Check CPU core count (proxy for CPU power)
    const cpuCores = navigator.hardwareConcurrency || 2 // Default to 2 if not available

    // Check user's prefers-reduced-motion setting
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Define a heuristic for high performance:
    // - Has WebGL support
    // - Has at least 4 CPU cores (a common threshold for modern machines)
    // - User has not explicitly requested reduced motion
    const detectedHighPerformance = hasWebGL && cpuCores >= 4 && !prefersReducedMotion

    setIsHighPerformanceMode(detectedHighPerformance)
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    // Run detection only once on mount
    if (!isInitialized) {
      detectPerformance()
    }
  }, [detectPerformance, isInitialized])

  // Allow manual toggling
  const togglePerformanceMode = useCallback(() => {
    const newMode = !isHighPerformanceMode
    setIsHighPerformanceMode(newMode)
    localStorage.setItem("highPerformanceMode", newMode.toString())
  }, [isHighPerformanceMode])

  return { isHighPerformanceMode, togglePerformanceMode, isInitialized }
}
