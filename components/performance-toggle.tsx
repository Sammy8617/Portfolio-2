"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Settings, Zap, ZapOff } from "lucide-react"
import { useState, useEffect } from "react"

export function PerformanceToggle() {
  const [isHighPerformanceMode, setIsHighPerformanceMode] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  // Toggle performance mode
  const togglePerformanceMode = () => {
    const newMode = !isHighPerformanceMode
    setIsHighPerformanceMode(newMode)

    // Store user preference
    localStorage.setItem("highPerformanceMode", newMode.toString())

    // Reload the page to apply changes
    window.location.reload()
  }

  // Initialize from stored preference
  useEffect(() => {
    const storedPreference = localStorage.getItem("highPerformanceMode")
    if (storedPreference !== null) {
      setIsHighPerformanceMode(storedPreference === "true")
    }

    // Show toggle after a delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <Card className="fixed bottom-4 left-4 z-50 bg-white/10 backdrop-blur-lg border-purple-300/20 shadow-xl">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Settings className="h-5 w-5 text-purple-300" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-purple-100">3D Background</span>
            <span className="text-xs text-purple-300">{isHighPerformanceMode ? "Enabled" : "Disabled"}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={togglePerformanceMode}
            className="border-purple-400/30 text-purple-200 hover:bg-purple-600/20 bg-transparent"
          >
            {isHighPerformanceMode ? <Zap className="h-4 w-4" /> : <ZapOff className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
