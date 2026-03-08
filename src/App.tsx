/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Sidebar } from './components/Sidebar'
import { Navbar } from './components/Navbar'
import { TaskList } from './components/TaskList'
import { TaskInput } from './components/TaskInput'
import { Dashboard } from './components/Dashboard'
import { AIWidget } from './components/AIWidget'
import { useTaskStore } from './store'
import { cn } from './lib/utils'
import { auth, onAuthStateChanged, signInWithPopup, googleProvider, signOut } from './firebase'
import { Button } from './components/ui/Button'
import { Zap, LogIn, LogOut } from 'lucide-react'

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks'>('dashboard')
  const [isAuthReady, setIsAuthReady] = useState(false)
  const user = useTaskStore((state) => state.user)
  const setUser = useTaskStore((state) => state.setUser)
  const syncUser = useTaskStore((state) => state.syncUser)
  const fetchTasks = useTaskStore((state) => state.fetchTasks)
  const isLoading = useTaskStore((state) => state.isLoading)

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userProfile = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || undefined,
          preferences: { theme: 'dark' as const, compactMode: false }
        };
        syncUser(userProfile);
      } else {
        setUser(null)
      }
      setIsAuthReady(true)
    })

    return () => unsubscribeAuth()
  }, [setUser, syncUser])

  useEffect(() => {
    if (user) {
      const unsubscribeTasks = fetchTasks(user.uid)
      return () => unsubscribeTasks()
    }
  }, [user, fetchTasks])

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error('Login Error:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Logout Error:', error)
    }
  }

  if (!isAuthReady) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-white" />
          <p className="text-sm font-medium text-white tracking-widest uppercase">Initializing Zenith...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-black px-6">
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
          <div className="absolute -right-[10%] bottom-[10%] h-[40%] w-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="z-10 flex flex-col items-center text-center"
        >
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-black shadow-[0_0_50px_rgba(255,255,255,0.2)]">
            <Zap className="h-10 w-10 fill-current" />
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl">ZENITH</h1>
          <p className="mt-4 max-w-md text-lg text-zinc-400">
            The futuristic task management system designed for high-performance teams and individuals.
          </p>
          <Button 
            onClick={handleLogin}
            size="lg" 
            className="mt-10 h-14 px-10 text-lg gap-3"
          >
            <LogIn className="h-5 w-5" />
            Get Started with Google
          </Button>
          <p className="mt-6 text-xs text-zinc-600 uppercase tracking-widest font-bold">
            Secure • Real-time • AI-Powered
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-black font-sans selection:bg-white selection:text-black">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute -right-[10%] bottom-[10%] h-[40%] w-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute left-[20%] top-[40%] h-[30%] w-[30%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <Sidebar />

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2 rounded-2xl bg-zinc-900/30 p-1 border border-white/5 w-fit">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={cn(
                    "rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300",
                    activeTab === 'dashboard' 
                      ? "bg-white text-black shadow-lg shadow-white/10" 
                      : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={cn(
                    "rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300",
                    activeTab === 'tasks' 
                      ? "bg-white text-black shadow-lg shadow-white/10" 
                      : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  Tasks
                </button>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-zinc-500 hover:text-rose-500 gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' ? (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <AIWidget />
                  <Dashboard />
                </motion.div>
              ) : (
                <motion.div
                  key="tasks"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full"
                >
                  <TaskList />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        <TaskInput />
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-white" />
              <p className="text-sm font-medium text-white tracking-widest uppercase">Syncing Zenith...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

