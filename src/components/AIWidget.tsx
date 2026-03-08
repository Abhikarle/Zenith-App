import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Sparkles, TrendingUp, Zap, Lightbulb, X, RefreshCw } from "lucide-react"
import { Card, CardContent } from "./ui/Card"
import { getSmartReminders } from "../services/geminiService"
import { useTaskStore } from "../store"
import { cn } from "../lib/utils"

export function AIWidget() {
  const [reminders, setReminders] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const tasks = useTaskStore((state) => state.tasks)

  const fetchReminders = async () => {
    if (tasks.length === 0) return
    setIsLoading(true)
    const result = await getSmartReminders(tasks.slice(0, 5))
    setReminders(result)
    setIsLoading(false)
  }

  useEffect(() => {
    if (tasks.length > 0 && reminders.length === 0) {
      fetchReminders()
    }
  }, [tasks.length])

  if (!isVisible || reminders.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-8"
    >
      <Card className="relative overflow-hidden border-blue-500/20 bg-blue-500/5 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-indigo-500/10 blur-3xl" />
        
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight text-white">Zenith Intelligence</h3>
                <p className="text-[10px] uppercase tracking-widest text-blue-400/60 font-bold">Smart Productivity Insights</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={fetchReminders}
                disabled={isLoading}
                className="p-2 text-zinc-500 hover:text-white transition-colors"
              >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              </button>
              <button 
                onClick={() => setIsVisible(false)}
                className="p-2 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {reminders.map((reminder, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 rounded-xl bg-white/5 p-3 border border-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                  <Lightbulb className="h-3 w-3" />
                </div>
                <p className="text-xs leading-relaxed text-zinc-300">
                  {reminder}
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
