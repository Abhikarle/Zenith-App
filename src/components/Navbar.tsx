import { motion } from "motion/react"
import { Search, Bell, User, Plus } from "lucide-react"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { useTaskStore } from "../store"

export function Navbar() {
  const searchQuery = useTaskStore((state) => state.searchQuery)
  const setSearchQuery = useTaskStore((state) => state.setSearchQuery)

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-white/5 bg-black/50 px-6 backdrop-blur-xl"
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, tags, or categories..."
            className="pl-10 bg-zinc-900/30 border-white/5 focus-visible:ring-white/10"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-zinc-500 opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500" />
        </Button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-[1px]">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-900">
            <User className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
