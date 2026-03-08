import { AnimatePresence, motion } from "motion/react"
import { TaskItem } from "./TaskItem"
import { useTaskStore } from "../store"
import { cn } from "../lib/utils"
import { LayoutGrid, List as ListIcon, Filter, ArrowUpDown } from "lucide-react"
import { Button } from "./ui/Button"

export function TaskList() {
  const tasks = useTaskStore((state) => state.tasks)
  const searchQuery = useTaskStore((state) => state.searchQuery)
  const filterPriority = useTaskStore((state) => state.filterPriority)
  const filterCategory = useTaskStore((state) => state.filterCategory)
  const sortBy = useTaskStore((state) => state.sortBy)
  const setSortBy = useTaskStore((state) => state.setSortBy)
  const setFilterPriority = useTaskStore((state) => state.setFilterPriority)

  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
      const matchesCategory = filterCategory === 'all' || task.categoryId === filterCategory
      return matchesSearch && matchesPriority && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }
      if (sortBy === 'createdAt') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return a.order - b.order
    })

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold tracking-tight text-white">Tasks</h2>
          <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
            {filteredTasks.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="bg-zinc-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-zinc-400 focus:outline-none focus:ring-1 focus:ring-white/20"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-zinc-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-zinc-400 focus:outline-none focus:ring-1 focus:ring-white/20"
          >
            <option value="order">Custom Order</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
            <option value="createdAt">Newest First</option>
          </select>
          <div className="ml-2 flex items-center rounded-lg bg-zinc-900/50 p-1 border border-white/5">
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md bg-white/5 text-white">
              <ListIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md text-zinc-500">
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar pb-24">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                <LayoutGrid className="h-8 w-8 text-zinc-600" />
              </div>
              <h3 className="text-lg font-medium text-white">No tasks found</h3>
              <p className="mt-1 text-sm text-zinc-500">
                Try adjusting your filters or search query.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
