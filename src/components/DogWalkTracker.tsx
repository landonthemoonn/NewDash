import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dog, Clock, User, Plus, Calendar } from 'lucide-react';
import { format, formatDistanceToNow, addHours } from 'date-fns';
import { projectId, publicAnonKey } from '../utils/supabase/info.tsx';
import { motion } from 'motion/react';

interface Walk {
  id: string;
  walker: string;
  timestamp: string;
  duration: number;
}

interface DogWalkTrackerProps {
  session: any;
  supabase: any;
  devMode?: boolean;
}

export function DogWalkTracker({ session, supabase, devMode }: DogWalkTrackerProps) {
  const [walks, setWalks] = useState<Walk[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Custom walk form state
  const [customWalker, setCustomWalker] = useState('');
  const [customDuration, setCustomDuration] = useState('');
  const [customDate, setCustomDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [customTime, setCustomTime] = useState(format(new Date(), 'HH:mm'));

  const fetchWalks = async () => {
    if (devMode) {
      setWalks([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-90e9fafd/walks`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setWalks(data.walks || []);
      }
    } catch (error) {
      console.error('Error fetching walks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalks();
  }, []);

  const addQuickWalk = async (duration: number) => {
    try {
      setAdding(true);
      
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        console.error('No active session');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-90e9fafd/walks`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentSession.access_token}`,
          },
          body: JSON.stringify({ duration }),
        }
      );

      if (response.ok) {
        await fetchWalks();
      }
    } catch (error) {
      console.error('Error adding walk:', error);
    } finally {
      setAdding(false);
    }
  };

  const addCustomWalk = async () => {
    try {
      setAdding(true);
      
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        console.error('No active session');
        return;
      }

      // Combine date and time into a timestamp
      const timestamp = new Date(`${customDate}T${customTime}`).toISOString();

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-90e9fafd/walks/custom`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentSession.access_token}`,
          },
          body: JSON.stringify({ 
            walker: customWalker,
            duration: parseInt(customDuration),
            timestamp 
          }),
        }
      );

      if (response.ok) {
        await fetchWalks();
        // Reset form
        setCustomWalker('');
        setCustomDuration('');
        setCustomDate(format(new Date(), 'yyyy-MM-dd'));
        setCustomTime(format(new Date(), 'HH:mm'));
        setDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding custom walk:', error);
    } finally {
      setAdding(false);
    }
  };

  const getLastWalk = () => {
    return walks.length > 0 ? walks[0] : null;
  };

  const getNextWalkTime = () => {
    const lastWalk = getLastWalk();
    if (!lastWalk) return null;
    return addHours(new Date(lastWalk.timestamp), 4);
  };

  const lastWalk = getLastWalk();
  const nextWalkTime = getNextWalkTime();
  const now = new Date();
  const isWalkDue = nextWalkTime && now >= nextWalkTime;

  if (loading) {
    return (
      <Card className="h-full border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Dog className="h-6 w-6 text-primary" />
            <CardTitle>Kepler's Walks</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-strong border border-white/10 shadow-2xl hover:shadow-accent/20 transition-all duration-500 flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent/10 border border-accent/20">
            <Dog className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">Kepler's Walks</CardTitle>
            <CardDescription>Quick log walks and track schedule</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 flex-1 flex flex-col">
        {/* Quick Add Buttons */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Quick Add Walk:</p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1 text-xs hover:bg-accent/20 hover:text-accent rounded-lg"
                  disabled={devMode}
                >
                  <Plus className="h-3 w-3" />
                  Custom
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-strong border-white/20">
                <DialogHeader>
                  <DialogTitle>Add Custom Walk</DialogTitle>
                  <DialogDescription>Log a walk with specific details</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="walker">Who walked Kepler?</Label>
                    <Input
                      id="walker"
                      placeholder="Enter name"
                      value={customWalker}
                      onChange={(e) => setCustomWalker(e.target.value)}
                      className="glass border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="e.g. 20"
                      value={customDuration}
                      onChange={(e) => setCustomDuration(e.target.value)}
                      className="glass border-white/20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={customDate}
                        onChange={(e) => setCustomDate(e.target.value)}
                        className="glass border-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        className="glass border-white/20"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    className="flex-1 glass border-white/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={addCustomWalk}
                    disabled={!customWalker.trim() || !customDuration || adding}
                    className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Add Walk
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => addQuickWalk(10)}
                variant="outline"
                className="w-full flex flex-col items-center py-7 glass border-white/20 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 rounded-xl group"
                disabled={adding || devMode}
              >
                <Clock className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium">10 min</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => addQuickWalk(20)}
                variant="outline"
                className="w-full flex flex-col items-center py-7 glass border-white/20 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 rounded-xl group"
                disabled={adding || devMode}
              >
                <Clock className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium">20 min</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => addQuickWalk(30)}
                variant="outline"
                className="w-full flex flex-col items-center py-7 glass border-white/20 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 rounded-xl group"
                disabled={adding || devMode}
              >
                <Clock className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium">30 min</span>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Next Walk Due */}
        {nextWalkTime && (
          <div className={`p-5 rounded-2xl border transition-all duration-500 ${
            isWalkDue 
              ? 'bg-accent/20 border-accent shadow-lg shadow-accent/30 animate-pulse' 
              : 'glass border-white/20'
          }`}>
            <h3 className="text-sm mb-2 font-medium">
              {isWalkDue ? '⚠️ Walk is Due!' : '✅ Next Walk'}
            </h3>
            <p className="text-sm">
              {isWalkDue ? 'Kepler needs a walk now!' : `Due ${format(nextWalkTime, 'h:mm a')}`}
            </p>
            {!isWalkDue && (
              <p className="text-xs text-muted-foreground mt-1">
                In {formatDistanceToNow(nextWalkTime)}
              </p>
            )}
          </div>
        )}

        {/* Recent Walks */}
        {walks.length > 0 && (
          <div className="space-y-3 flex-1 flex flex-col min-h-0">
            <h3 className="text-sm text-muted-foreground">Recent Walks</h3>
            <div className="space-y-2 overflow-y-auto pr-2 flex-1">
              {walks.slice(0, 10).map((walk, index) => (
                <motion.div 
                  key={walk.id} 
                  className="flex items-center justify-between p-3 glass rounded-xl border border-white/10 hover:border-accent/30 transition-all duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5">
                      <User className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{walk.walker}</p>
                      <p className="text-xs text-muted-foreground">{walk.duration} minutes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(walk.timestamp), 'h:mm a')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(walk.timestamp), 'MMM d')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {walks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Dog className="h-12 w-12 mx-auto mb-2 text-muted" />
            <p className="text-sm">No walks logged yet</p>
            <p className="text-xs">Click a button above to log a walk</p>
          </div>
        )}

        {devMode && (
          <div className="text-xs text-muted-foreground pt-2 border-t">
            <p>Walk tracking will work when you enable authentication</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
