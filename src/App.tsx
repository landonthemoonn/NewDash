import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { projectId, publicAnonKey } from './utils/supabase/info.tsx';
import { motion } from 'motion/react';
import { Toaster } from './components/ui/sonner';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// DEV MODE: Set to true to bypass authentication while building
const DEV_MODE = false;

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (DEV_MODE) {
      // Mock session for development
      setSession({
        user: {
          id: 'dev-user',
          email: 'dev@rm8dashboard.com',
          user_metadata: {
            name: 'Dev User',
          },
        },
        access_token: 'dev-token',
        provider_token: null,
      });
      setLoading(false);
      return;
    }

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (DEV_MODE) {
      setSession(null);
    } else {
      await supabase.auth.signOut();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        <motion.div 
          className="text-center relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="relative mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full"></div>
          </motion.div>
          <motion.p 
            className="text-muted-foreground"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading RM8 Dashboard...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!session) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <LoginScreen supabase={supabase} devMode={DEV_MODE} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Dashboard session={session} supabase={supabase} onLogout={handleLogout} devMode={DEV_MODE} />
      <Toaster position="top-right" theme="dark" />
    </motion.div>
  );
}