import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Progress } from './ui/progress';
import { MessageSquare, Plus, X, ChevronRight, ChevronLeft, Check, Smile, Meh, Frown } from 'lucide-react';
import { format } from 'date-fns';
import { projectId, publicAnonKey } from '../utils/supabase/info.tsx';
import { motion, AnimatePresence } from 'motion/react';

interface CheckIn {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  mood?: string;
  wins?: string;
  concerns?: string;
  requests?: string;
}

interface CheckInsProps {
  session: any;
  supabase: any;
  devMode?: boolean;
}

export function CheckIns({ session, supabase, devMode }: CheckInsProps) {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newContent, setNewContent] = useState('');
  
  // Guided check-in state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [mood, setMood] = useState('');
  const [overview, setOverview] = useState('');
  const [wins, setWins] = useState('');
  const [concerns, setConcerns] = useState('');
  const [requests, setRequests] = useState('');
  
  const totalSteps = 5;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const fetchCheckIns = async () => {
    if (devMode) {
      setCheckIns([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-90e9fafd/checkins`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCheckIns(data.checkins || []);
      }
    } catch (error) {
      console.error('Error fetching check-ins:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckIns();
  }, []);

  const addCheckIn = async () => {
    if (!newContent.trim()) return;

    try {
      setAdding(true);
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        console.error('No active session');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-90e9fafd/checkins`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentSession.access_token}`,
          },
          body: JSON.stringify({ content: newContent.trim() }),
        }
      );

      if (response.ok) {
        setNewContent('');
        await fetchCheckIns();
      }
    } catch (error) {
      console.error('Error adding check-in:', error);
    } finally {
      setAdding(false);
    }
  };

  const submitGuidedCheckIn = async () => {
    try {
      setAdding(true);
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        console.error('No active session');
        return;
      }

      // Format the check-in content with sections
      let formattedContent = `**How I'm Feeling:** ${mood}\n\n`;
      if (overview.trim()) formattedContent += `**Overview:** ${overview}\n\n`;
      if (wins.trim()) formattedContent += `**✨ Wins:** ${wins}\n\n`;
      if (concerns.trim()) formattedContent += `**⚠️ Concerns:** ${concerns}\n\n`;
      if (requests.trim()) formattedContent += `**🙏 Requests:** ${requests}`;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-90e9fafd/checkins`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentSession.access_token}`,
          },
          body: JSON.stringify({ 
            content: formattedContent.trim(),
            mood,
            wins: wins.trim() || null,
            concerns: concerns.trim() || null,
            requests: requests.trim() || null,
          }),
        }
      );

      if (response.ok) {
        // Reset form
        setMood('');
        setOverview('');
        setWins('');
        setConcerns('');
        setRequests('');
        setCurrentStep(0);
        setDialogOpen(false);
        await fetchCheckIns();
      }
    } catch (error) {
      console.error('Error submitting guided check-in:', error);
    } finally {
      setAdding(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetGuidedForm = () => {
    setCurrentStep(0);
    setMood('');
    setOverview('');
    setWins('');
    setConcerns('');
    setRequests('');
  };

  const deleteCheckIn = async (id: string) => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-90e9fafd/checkins/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${currentSession.access_token}`,
          },
        }
      );

      if (response.ok) {
        await fetchCheckIns();
      }
    } catch (error) {
      console.error('Error deleting check-in:', error);
    }
  };

  if (loading) {
    return (
      <Card className="h-full border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <CardTitle>Weekly Check-Ins</CardTitle>
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
            <MessageSquare className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">Weekly Check-Ins</CardTitle>
            <CardDescription>Share updates, concerns, and wins</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        {/* Add New Check-In */}
        <div className="space-y-3">
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetGuidedForm();
          }}>
            <DialogTrigger asChild>
              <Button
                disabled={devMode}
                className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl shadow-lg hover:shadow-accent/30 transition-all duration-300"
              >
                <Plus className="h-4 w-4" />
                Start Weekly Check-In
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-strong border-white/20 max-w-lg">
              <DialogHeader>
                <DialogTitle>Weekly Check-In</DialogTitle>
                <DialogDescription>
                  Take a moment to reflect on your week
                </DialogDescription>
              </DialogHeader>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                  Step {currentStep + 1} of {totalSteps}
                </p>
              </div>

              {/* Step Content */}
              <div className="py-6 min-h-64">
                {/* Step 0: Mood */}
                {currentStep === 0 && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <h3 className="text-lg font-medium">How are you feeling this week?</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setMood('Great')}
                        className={`p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${
                          mood === 'Great' 
                            ? 'bg-accent/20 border-accent shadow-lg shadow-accent/20' 
                            : 'glass border-white/10 hover:border-white/30'
                        }`}
                      >
                        <Smile className="h-8 w-8" />
                        <span className="text-sm font-medium">Great</span>
                      </button>
                      <button
                        onClick={() => setMood('Okay')}
                        className={`p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${
                          mood === 'Okay' 
                            ? 'bg-accent/20 border-accent shadow-lg shadow-accent/20' 
                            : 'glass border-white/10 hover:border-white/30'
                        }`}
                      >
                        <Meh className="h-8 w-8" />
                        <span className="text-sm font-medium">Okay</span>
                      </button>
                      <button
                        onClick={() => setMood('Struggling')}
                        className={`p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${
                          mood === 'Struggling' 
                            ? 'bg-accent/20 border-accent shadow-lg shadow-accent/20' 
                            : 'glass border-white/10 hover:border-white/30'
                        }`}
                      >
                        <Frown className="h-8 w-8" />
                        <span className="text-sm font-medium">Struggling</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 1: Overview */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <h3 className="text-lg font-medium">What's been going on?</h3>
                    <p className="text-sm text-muted-foreground">
                      Give a quick overview of your week
                    </p>
                    <Textarea
                      placeholder="This week has been..."
                      value={overview}
                      onChange={(e) => setOverview(e.target.value)}
                      className="min-h-32 glass border-white/20 focus:border-accent/50 rounded-xl resize-none"
                    />
                  </div>
                )}

                {/* Step 2: Wins */}
                {currentStep === 2 && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <h3 className="text-lg font-medium">✨ Any wins or highlights?</h3>
                    <p className="text-sm text-muted-foreground">
                      What went well? Celebrate the good stuff!
                    </p>
                    <Textarea
                      placeholder="I'm proud of... / Something good that happened..."
                      value={wins}
                      onChange={(e) => setWins(e.target.value)}
                      className="min-h-32 glass border-white/20 focus:border-accent/50 rounded-xl resize-none"
                    />
                    <p className="text-xs text-muted-foreground">Optional - skip if nothing comes to mind</p>
                  </div>
                )}

                {/* Step 3: Concerns */}
                {currentStep === 3 && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <h3 className="text-lg font-medium">⚠️ Any concerns or challenges?</h3>
                    <p className="text-sm text-muted-foreground">
                      What's been difficult? Let's talk about it
                    </p>
                    <Textarea
                      placeholder="I'm struggling with... / Something that's bothering me..."
                      value={concerns}
                      onChange={(e) => setConcerns(e.target.value)}
                      className="min-h-32 glass border-white/20 focus:border-accent/50 rounded-xl resize-none"
                    />
                    <p className="text-xs text-muted-foreground">Optional - skip if all is good</p>
                  </div>
                )}

                {/* Step 4: Requests */}
                {currentStep === 4 && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <h3 className="text-lg font-medium">🙏 Any requests for roommates?</h3>
                    <p className="text-sm text-muted-foreground">
                      Is there anything you need help with or want to change?
                    </p>
                    <Textarea
                      placeholder="Could we... / I would appreciate if..."
                      value={requests}
                      onChange={(e) => setRequests(e.target.value)}
                      className="min-h-32 glass border-white/20 focus:border-accent/50 rounded-xl resize-none"
                    />
                    <p className="text-xs text-muted-foreground">Optional</p>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="gap-2 glass border-white/20"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>
                )}
                
                {currentStep < totalSteps - 1 ? (
                  <Button
                    onClick={nextStep}
                    disabled={currentStep === 0 && !mood}
                    className="flex-1 gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={submitGuidedCheckIn}
                    disabled={!mood || adding}
                    className="flex-1 gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <Check className="h-4 w-4" />
                    Submit Check-In
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Check-Ins List */}
        {checkIns.length > 0 ? (
          <div className="space-y-3 overflow-y-auto pr-2 flex-1 min-h-0">
            <h3 className="text-sm text-muted-foreground">Recent Check-Ins</h3>
            {checkIns.map((checkIn, index) => (
              <div 
                key={checkIn.id} 
                className="p-4 glass rounded-xl border border-white/10 relative group hover:border-accent/30 transition-all duration-300"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <button
                  onClick={() => deleteCheckIn(checkIn.id)}
                  className="absolute top-3 right-3 p-1.5 hover:bg-destructive/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 border border-destructive/30"
                  title="Delete check-in"
                >
                  <X className="h-3.5 w-3.5 text-destructive" />
                </button>
                <div className="pr-10">
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-sm font-medium">{checkIn.author}</p>
                    <span className="text-xs text-muted-foreground">•</span>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(checkIn.timestamp), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{checkIn.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <div className="inline-block p-4 rounded-2xl glass border border-white/10 mb-3">
              <MessageSquare className="h-10 w-10 text-muted" />
            </div>
            <p className="text-sm">No check-ins yet</p>
            <p className="text-xs mt-1">Share how things are going!</p>
          </div>
        )}

        {devMode && (
          <div className="text-xs text-muted-foreground pt-2 border-t">
            <p>Check-ins will sync when you enable authentication</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
