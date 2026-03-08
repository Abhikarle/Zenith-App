import { motion } from "motion/react"
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Calendar, 
  Tag, 
  Settings, 
  Zap,
  TrendingUp,
  Clock,
  Briefcase,
  User as UserIcon,
  ShoppingCart,
  Heart
} from "lucide-react"
import { cn } from "../lib/utils"
import { useTaskStore } from "../store"

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
  { name: 'My Tasks', icon: CheckCircle2, id: 'tasks' },
  { name: 'Calendar', icon: Calendar, id: 'calendar' },
  { name: 'Analytics', icon: TrendingUp, id: 'analytics' },
]

const categories = [
  { name: 'Work', icon: Briefcase, color: 'text-blue-400', id: 'work' },
  { name: 'Personal', icon: UserIcon, color: 'text-emerald-400', id: 'personal' },
  { name: 'Shopping', icon: ShoppingCart, color: 'text-amber-400', id: 'shopping' },
  { name: 'Health', icon: Heart, color: 'text-rose-400', id: 'health' },
]

export function Sidebar() {
  const filterCategory = useTaskStore((state) => state.filterCategory)
  const setFilterCategory = useTaskStore((state) => state.setFilterCategory)

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="flex h-full w-64 flex-col border-r border-white/5 bg-black/40 backdrop-blur-xl"
    >
      <div className="flex h-16 items-center px-6 gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
          <Zap className="h-5 w-5 fill-current" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">Zenith</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        <div>
          <h3 className="mb-4 px-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            Navigation
          </h3>
          <div className="space-y-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  "hover:bg-white/5 hover:text-white",
                  "text-zinc-400"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 px-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            Categories
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => setFilterCategory('all')}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                filterCategory === 'all' 
                  ? "bg-white/5 text-white shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]" 
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              All Tasks
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilterCategory(category.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  filterCategory === category.id 
                    ? "bg-white/5 text-white shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]" 
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <category.icon className={cn("h-4 w-4", category.color)} />
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 px-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            Recent
          </h3>
          <div className="space-y-3 px-2">
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <Clock className="h-3 w-3" />
              <span>Project Alpha</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <Clock className="h-3 w-3" />
              <span>Design Review</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-all">
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </div>
    </motion.aside>
  )
}
