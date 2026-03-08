import { motion } from "motion/react"
import { CheckCircle2, Circle, Clock, Tag, MoreHorizontal, Trash2, Edit2 } from "lucide-react"
import { Task, Priority } from "../types"
import { cn } from "../lib/utils"
import { useTaskStore } from "../store"
import { format } from "date-fns"

interface TaskItemProps {
  task: Task
}

const priorityColors: Record<Priority, string> = {
  low: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  high: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  urgent: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
}

export function TaskItem({ task }: TaskItemProps) {
  const updateTask = useTaskStore((state) => state.updateTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)

  const toggleComplete = () => {
    updateTask(task.id, { completed: !task.completed })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={cn(
        "group relative flex items-center gap-4 rounded-xl border border-white/5 bg-zinc-900/40 p-4 transition-all duration-300",
        "hover:border-white/10 hover:bg-zinc-900/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
        task.completed && "opacity-60"
      )}
    >
      <button
        onClick={toggleComplete}
        className="flex h-6 w-6 items-center justify-center rounded-full transition-colors"
      >
        {task.completed ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        ) : (
          <Circle className="h-5 w-5 text-zinc-600 hover:text-zinc-400" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <h4 className={cn(
          "text-sm font-medium tracking-tight text-white transition-all",
          task.completed && "line-through text-zinc-500"
        )}>
          {task.title}
        </h4>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className={cn(
            "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
            priorityColors[task.priority]
          )}>
            {task.priority}
          </span>
          
          {task.dueDate && (
            <span className="flex items-center gap-1.5 text-[11px] text-zinc-500">
              <Clock className="h-3 w-3" />
              {format(new Date(task.dueDate), 'MMM d, h:mm a')}
            </span>
          )}

          {task.categoryId && (
            <span className="flex items-center gap-1.5 text-[11px] text-zinc-500">
              <Tag className="h-3 w-3" />
              {task.categoryId}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
          <Edit2 className="h-4 w-4" />
        </button>
        <button 
          onClick={() => deleteTask(task.id)}
          className="p-2 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <button className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}
