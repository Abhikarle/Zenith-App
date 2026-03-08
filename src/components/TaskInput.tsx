import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Plus, Calendar, Tag, Sparkles, Send, X, Clock, AlertCircle } from "lucide-react"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { useTaskStore } from "../store"
import { Priority } from "../types"
import { cn } from "../lib/utils"
import { getTaskSuggestions } from "../services/geminiService"

export function TaskInput() {
  const [title, setTitle] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [priority, setPriority] = useState<Priority>("medium")
  const [categoryId, setCategoryId] = useState("personal")
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])
  
  const addTask = useTaskStore((state) => state.addTask)
  const user = useTaskStore((state) => state.user)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!title.trim() || !user) return

    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      completed: false,
      priority,
      categoryId,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user.uid,
      order: Date.now(),
    }

    addTask(newTask)
    setTitle("")
    setSuggestions([])
    setIsExpanded(false)
  }

  const handleAiSuggest = async () => {
    if (!title.trim()) return
    setIsAiLoading(true)
    const result = await getTaskSuggestions(title)
    setSuggestions(result)
    setIsAiLoading(false)
  }

  const addSuggestion = (suggestion: any) => {
    if (!user) return
    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: suggestion.title,
      completed: false,
      priority: suggestion.priority as Priority,
      categoryId: suggestion.categoryId || categoryId,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user.uid,
      order: Date.now(),
    }
    addTask(newTask)
    setSuggestions(prev => prev.filter(s => s.title !== suggestion.title))
  }

  return (
    <div className="fixed bottom-8 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 px-4">
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-4 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-black/80 p-3 backdrop-blur-xl"
          >
            <div className="flex w-full items-center gap-2 px-2 mb-1">
              <Sparkles className="h-3 w-3 text-blue-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">AI Suggestions</span>
            </div>
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => addSuggestion(s)}
                className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition-all border border-white/5"
              >
                <Plus className="h-3 w-3" />
                {s.title}
              </button>
            ))}
            <button 
              onClick={() => setSuggestions([])}
              className="ml-auto p-1 text-zinc-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        className={cn(
          "relative flex flex-col rounded-2xl border border-white/10 bg-zinc-900/80 p-2 shadow-2xl backdrop-blur-2xl transition-all duration-500",
          isExpanded ? "ring-2 ring-white/10" : "hover:border-white/20"
        )}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-zinc-400">
              <Plus className="h-5 w-5" />
            </div>
            <Input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="What needs to be done?"
              className="h-12 border-none bg-transparent text-base focus-visible:ring-0 placeholder:text-zinc-600"
            />
            <Button 
              type="submit"
              disabled={!title.trim()}
              className="h-10 w-10 rounded-xl bg-white text-black p-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center justify-between border-t border-white/5 px-2 pt-3 pb-1">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 gap-2 text-xs text-zinc-400 hover:text-white">
                      <Calendar className="h-3.5 w-3.5" />
                      Today
                    </Button>
                    <div className="flex items-center gap-1 rounded-lg bg-white/5 p-1 border border-white/5">
                      {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={cn(
                            "rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-all",
                            priority === p 
                              ? "bg-white text-black shadow-lg" 
                              : "text-zinc-500 hover:text-zinc-300"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm" 
                      onClick={handleAiSuggest}
                      disabled={isAiLoading || !title.trim()}
                      className={cn(
                        "h-8 gap-2 text-xs",
                        isAiLoading ? "text-blue-400" : "text-zinc-400 hover:text-blue-400"
                      )}
                    >
                      <Sparkles className={cn("h-3.5 w-3.5", isAiLoading && "animate-pulse")} />
                      {isAiLoading ? "Thinking..." : "AI Suggest"}
                    </Button>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsExpanded(false)}
                      className="h-8 text-zinc-500 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  )
}
