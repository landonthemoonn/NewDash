import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dog } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginScreenProps {
  supabase: any;
  devMode?: boolean;
}

export function LoginScreen({ supabase, devMode }: LoginScreenProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          scopes: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events',
        },
      });

      if (error) {
        setError(error.message);
        console.error('Google sign-in error:', error);
      }
    } catch (err) {
      setError('Failed to sign in with Google');
      console.error('Sign-in error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="w-full max-w-md glass-strong border border-white/20 shadow-2xl relative">
        <CardHeader className="space-y-4">
          <motion.div 
            className="flex items-center justify-center mb-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2 
            }}
          >
            <motion.div 
              className="bg-accent/20 p-5 rounded-2xl border-2 border-accent/30 shadow-lg shadow-accent/20"
              animate={{
                boxShadow: [
                  "0 10px 40px rgba(244, 255, 0, 0.2)",
                  "0 10px 60px rgba(244, 255, 0, 0.3)",
                  "0 10px 40px rgba(244, 255, 0, 0.2)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Dog className="h-12 w-12 text-accent" />
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <CardTitle className="text-4xl text-center bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
              RM8 DASHBOARD
            </CardTitle>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <CardDescription className="text-center text-base">
              {devMode ? 'Development Mode - Building in progress' : 'Sign in with Google to access your roommate dashboard and calendar'}
            </CardDescription>
          </motion.div>
        </CardHeader>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <CardContent className="space-y-4">
          {devMode && (
            <div className="p-4 bg-accent/10 border border-accent/30 rounded-xl">
              <p className="text-sm">
                <strong>🚧 Dev Mode Active</strong>
              </p>
              <p className="text-xs mt-2 text-muted-foreground">
                Authentication is bypassed. You can build the dashboard without setting up Google OAuth yet.
                Set <code className="px-1 py-0.5 bg-white/10 rounded">DEV_MODE = false</code> in App.tsx when ready to enable real authentication.
              </p>
            </div>
          )}
          
          {!devMode && (
            <>
              <Button 
                onClick={handleGoogleSignIn} 
                className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg hover:shadow-accent/30 transition-all duration-300 rounded-xl"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>
            </>
          )}
          
          {!devMode && error && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
              <p className="text-xs text-destructive/80 mt-2">
                Please make sure Google OAuth is configured in your Supabase project settings.
              </p>
            </div>
          )}

          {!devMode && (
            <div className="text-xs text-center text-muted-foreground space-y-1">
              <p>This app needs access to:</p>
              <ul className="list-disc list-inside text-left">
                <li>Your Google Calendar (to display and manage events)</li>
                <li>Your profile information (name and email)</li>
              </ul>
            </div>
          )}
          </CardContent>
        </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
