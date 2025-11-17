import { useState } from 'react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CalendarSection } from './CalendarSection';
import { DogWalkTracker } from './DogWalkTracker';
import { HouseRules } from './HouseRules';
import { CheckIns } from './CheckIns';
import { Chores } from './Chores';
import { Financials } from './Financials';
import { CrisisPlans } from './CrisisPlans';
import { LogOut, Calendar, Dog, MessageSquare, Home, ListTodo, DollarSign, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardProps {
  session: any;
  supabase: any;
  onLogout: () => void;
  devMode?: boolean;
}

export function Dashboard({ session, supabase, onLogout, devMode }: DashboardProps) {
  const userName = session?.user?.user_metadata?.name || session?.user?.email || 'User';
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen relative">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 7.5
          }}
        />
      </div>

      {/* Header */}
      <motion.header 
        className="glass-strong sticky top-0 z-10 shadow-xl border-b border-white/10"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-2xl tracking-tight bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent text-[48px] text-left">
                RM8 DASHBOARD{activeTab !== 'home' && <> <span className="opacity-60">×</span> {activeTab.toUpperCase()}</>}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Welcome back, {userName}!
                {devMode && <span className="ml-2 px-2 py-0.5 bg-accent/20 text-accent rounded text-xs border border-accent/30">DEV MODE</span>}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Button 
                variant="outline" 
                onClick={onLogout} 
                className="gap-2 glass border-white/20 hover:bg-white/10 hover:border-accent/50 transition-all duration-300"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <TabsList className="glass-strong border border-white/10 p-1 h-auto flex-wrap justify-start">
            <TabsTrigger value="home" className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="kepler" className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <Dog className="h-4 w-4" />
              <span className="hidden sm:inline">Kepler</span>
            </TabsTrigger>
            <TabsTrigger value="checkins" className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Check-Ins</span>
            </TabsTrigger>
            <TabsTrigger value="chores" className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <ListTodo className="h-4 w-4" />
              <span className="hidden sm:inline">Chores</span>
            </TabsTrigger>
            <TabsTrigger value="money" className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Expenses</span>
            </TabsTrigger>
            <TabsTrigger value="rules" className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">House Rules</span>
            </TabsTrigger>
            <TabsTrigger value="crisis" className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Crisis Plans</span>
            </TabsTrigger>
          </TabsList>
          </motion.div>

          {/* Home - Dashboard Overview */}
          <TabsContent value="home" className="space-y-6">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <CalendarSection session={session} supabase={supabase} devMode={devMode} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <DogWalkTracker session={session} supabase={supabase} devMode={devMode} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <CheckIns session={session} supabase={supabase} devMode={devMode} />
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <CalendarSection session={session} supabase={supabase} devMode={devMode} />
            </motion.div>
          </TabsContent>

          {/* Kepler Tab */}
          <TabsContent value="kepler">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <DogWalkTracker session={session} supabase={supabase} devMode={devMode} />
            </motion.div>
          </TabsContent>

          {/* Check-Ins Tab */}
          <TabsContent value="checkins">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <CheckIns session={session} supabase={supabase} devMode={devMode} />
            </motion.div>
          </TabsContent>

          {/* Chores Tab */}
          <TabsContent value="chores">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Chores session={session} supabase={supabase} devMode={devMode} />
            </motion.div>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="money">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Financials session={session} supabase={supabase} devMode={devMode} />
            </motion.div>
          </TabsContent>

          {/* House Rules Tab */}
          <TabsContent value="rules">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <HouseRules />
            </motion.div>
          </TabsContent>

          {/* Crisis Plans Tab */}
          <TabsContent value="crisis">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <CrisisPlans />
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
