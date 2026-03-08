import { motion } from "motion/react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Zap,
  Activity,
  Calendar as CalendarIcon
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { useTaskStore } from "../store"
import { cn } from "../lib/utils"

const data = [
  { name: 'Mon', completed: 4, total: 6 },
  { name: 'Tue', completed: 3, total: 5 },
  { name: 'Wed', completed: 7, total: 8 },
  { name: 'Thu', completed: 5, total: 7 },
  { name: 'Fri', completed: 6, total: 6 },
  { name: 'Sat', completed: 2, total: 3 },
  { name: 'Sun', completed: 1, total: 2 },
]

export function Dashboard() {
  const tasks = useTaskStore((state) => state.tasks)
  const completedTasks = tasks.filter(t => t.completed).length
  const pendingTasks = tasks.length - completedTasks
  const urgentTasks = tasks.filter(t => t.priority === 'urgent' && !t.completed).length

  const stats = [
    { 
      label: 'Completed', 
      value: completedTasks, 
      icon: CheckCircle2, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-400/10',
      trend: '+12%'
    },
    { 
      label: 'Pending', 
      value: pendingTasks, 
      icon: Clock, 
      color: 'text-blue-400', 
      bg: 'bg-blue-400/10',
      trend: '-5%'
    },
    { 
      label: 'Urgent', 
      value: urgentTasks, 
      icon: AlertCircle, 
      color: 'text-rose-400', 
      bg: 'bg-rose-400/10',
      trend: '+2'
    },
    { 
      label: 'Efficiency', 
      value: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0, 
      icon: Zap, 
      color: 'text-amber-400', 
      bg: 'bg-amber-400/10',
      suffix: '%',
      trend: '+8%'
    },
  ]

  return (
    <div className="space-y-8 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Zenith Dashboard</h1>
          <p className="text-sm text-zinc-500">Welcome back, here's your productivity overview.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-zinc-900/50 p-1 border border-white/5">
          <button className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-white">Day</button>
          <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-white transition-colors">Week</button>
          <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-white transition-colors">Month</button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="relative overflow-hidden hover:border-white/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", stat.bg)}>
                    <stat.icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    stat.trend.startsWith('+') ? "text-emerald-400" : "text-rose-400"
                  )}>
                    {stat.trend}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                  <h3 className="mt-1 text-2xl font-bold text-white">
                    {stat.value}{stat.suffix}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400">
                <Activity className="h-4 w-4 text-blue-400" />
                Activity Overview
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Total</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Completed</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#71717a" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181b', 
                    borderColor: '#ffffff10',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCompleted)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400">
              <CalendarIcon className="h-4 w-4 text-purple-400" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.filter(t => t.dueDate && !t.completed).slice(0, 4).map((task, i) => (
                <div key={task.id} className="flex items-center justify-between rounded-xl bg-white/5 p-3 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <div>
                      <p className="text-xs font-medium text-white">{task.title}</p>
                      <p className="text-[10px] text-zinc-500">Due in 2 hours</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">High</span>
                </div>
              ))}
              {tasks.filter(t => t.dueDate && !t.completed).length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="mb-2 h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-zinc-600" />
                  </div>
                  <p className="text-xs text-zinc-500">No upcoming deadlines</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
