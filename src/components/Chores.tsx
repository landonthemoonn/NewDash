import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CheckCircle2, Circle, ListTodo, Plus, RotateCw, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { projectId, publicAnonKey } from '../utils/supabase/info.tsx';
import { motion } from 'motion/react';

interface Chore {
  id: string;
  task: string;
  assignedTo: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  lastCompleted?: string;
  completedBy?: string;
  completed: boolean;
}

interface ChoresProps {
  session: any;
  supabase: any;
  devMode?: boolean;
}

export function Chores({ session, supabase, devMode }: ChoresProps) {
  const [chores, setChores] = useState<Chore[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [newTask, setNewTask] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [newFrequency, setNewFrequency] = useState<'daily' | 'weekly' | 'biweekly' | 'monthly'>('weekly');

  const fetchChores = async () => {
    if (devMode) {
      setChores([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-90e9fafd/chores`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setChores(data.chores || []);
      }
    } catch (error) {
      console.error('Error fetching chores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChores();
  }, []);

  const addChore = async () => {
    if (!newTask.trim() || !newAssignee.trim()) return;

    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        console.error('No active session');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-90e9fafd/chores`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentSession.access_token}`,
          },
          body: JSON.stringify({ 
            task: newTask.trim(),
            assignedTo: newAssignee.trim(),
            frequency: newFrequency,
          }),
        }
      );

      if (response.ok) {
        setNewTask('');
        setNewAssignee('');
        setNewFrequency('weekly');
        setDialogOpen(false);
        await fetchChores();
      }
    } catch (error) {
      console.error('Error adding chore:', error);
    }
  };

  const toggleChore = async (choreId: string, completed: boolean) => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-90e9fafd/chores/${choreId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentSession.access_token}`,
          },
          body: JSON.stringify({ completed }),
        }
      );

      if (response.ok) {
        await fetchChores();
      }
    } catch (error) {
      console.error('Error toggling chore:', error);
    }
  };

  const deleteChore = async (choreId: string) => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-90e9fafd/chores/${choreId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${currentSession.access_token}`,
          },
        }
      );

      if (response.ok) {
        await fetchChores();
      }
    } catch (error) {
      console.error('Error deleting chore:', error);
    }
  };

  const rotateChores = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-90e9fafd/chores/rotate`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${currentSession.access_token}`,
          },
        }
      );

      if (response.ok) {
        await fetchChores();
      }
    } catch (error) {
      console.error('Error rotating chores:', error);
    }
  };

  return (
    <Card className="glass-strong border border-white/10 shadow-2xl hover:shadow-accent/20 transition-all duration-500">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/10 border border-accent/20">
              <ListTodo className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle className="text-lg">Chores & Responsibilities</CardTitle>
              <CardDescription>Shared household tasks</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={rotateChores}
              disabled={devMode || chores.length === 0}
              className="gap-2 glass border-white/20"
            >
              <RotateCw className="h-4 w-4" />
              Rotate
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="sm"
                  disabled={devMode}
                  className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-strong border-white/20">
                <DialogHeader>
                  <DialogTitle>Add New Chore</DialogTitle>
                  <DialogDescription>Create a new household task</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="task">Task</Label>
                    <Input
                      id="task"
                      placeholder="e.g. Take out trash"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      className="glass border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignee">Assigned To</Label>
                    <Input
                      id="assignee"
                      placeholder="Name"
                      value={newAssignee}
                      onChange={(e) => setNewAssignee(e.target.value)}
                      className="glass border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select value={newFrequency} onValueChange={(v: any) => setNewFrequency(v)}>
                      <SelectTrigger className="glass border-white/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Biweekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
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
                    onClick={addChore}
                    disabled={!newTask.trim() || !newAssignee.trim()}
                    className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Add Chore
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : chores.length > 0 ? (
          <div className="space-y-2">
            {chores.map((chore) => (
              <div
                key={chore.id}
                className={`p-4 glass rounded-xl border transition-all duration-300 group ${
                  chore.completed ? 'border-accent/30 bg-accent/5' : 'border-white/10 hover:border-accent/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleChore(chore.id, !chore.completed)}
                    className="flex-shrink-0"
                  >
                    {chore.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground hover:text-accent transition-colors" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${chore.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {chore.task}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">{chore.assignedTo}</p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground capitalize">{chore.frequency}</p>
                      {chore.lastCompleted && (
                        <>
                          <span className="text-xs text-muted-foreground">•</span>
                          <p className="text-xs text-muted-foreground">
                            Last: {format(new Date(chore.lastCompleted), 'MMM d')}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteChore(chore.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-destructive/20 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <div className="inline-block p-4 rounded-2xl glass border border-white/10 mb-3">
              <ListTodo className="h-10 w-10 text-muted" />
            </div>
            <p className="text-sm">No chores assigned yet</p>
            <p className="text-xs mt-1">Add tasks to keep the house running smoothly</p>
          </div>
        )}

        {devMode && (
          <div className="text-xs text-muted-foreground pt-4 border-t border-white/10 mt-4">
            <p>Chores tracking will work when you enable authentication</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
