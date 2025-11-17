import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Get all dog walks
app.get('/make-server-90e9fafd/walks', async (c) => {
  try {
    const walks = await kv.getByPrefix('walk:');
    // Sort by timestamp descending (newest first)
    const sortedWalks = walks
      .map(w => w.value)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return c.json({ walks: sortedWalks });
  } catch (error) {
    console.error('Error fetching walks:', error);
    return c.json({ error: 'Failed to fetch walks', details: String(error) }, 500);
  }
});

// Add a new dog walk (quick add)
app.post('/make-server-90e9fafd/walks', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { duration } = body;

    if (!duration || typeof duration !== 'number') {
      return c.json({ error: 'Duration is required and must be a number' }, 400);
    }

    const walk = {
      id: Date.now().toString(),
      walker: user.user_metadata?.name || user.email || 'Unknown',
      timestamp: new Date().toISOString(),
      duration,
    };

    await kv.set(`walk:${walk.id}`, walk);

    return c.json({ walk });
  } catch (error) {
    console.error('Error adding walk:', error);
    return c.json({ error: 'Failed to add walk', details: String(error) }, 500);
  }
});

// Add a custom dog walk with specific details
app.post('/make-server-90e9fafd/walks/custom', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { walker, duration, timestamp } = body;

    if (!walker || typeof walker !== 'string') {
      return c.json({ error: 'Walker name is required and must be a string' }, 400);
    }

    if (!duration || typeof duration !== 'number') {
      return c.json({ error: 'Duration is required and must be a number' }, 400);
    }

    if (!timestamp || typeof timestamp !== 'string') {
      return c.json({ error: 'Timestamp is required and must be a string' }, 400);
    }

    const walk = {
      id: Date.now().toString(),
      walker,
      timestamp,
      duration,
    };

    await kv.set(`walk:${walk.id}`, walk);

    return c.json({ walk });
  } catch (error) {
    console.error('Error adding custom walk:', error);
    return c.json({ error: 'Failed to add custom walk', details: String(error) }, 500);
  }
});

// Delete a dog walk
app.delete('/make-server-90e9fafd/walks/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const walkId = c.req.param('id');
    await kv.del(`walk:${walkId}`);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting walk:', error);
    return c.json({ error: 'Failed to delete walk', details: String(error) }, 500);
  }
});

// Get all check-ins
app.get('/make-server-90e9fafd/checkins', async (c) => {
  try {
    const checkins = await kv.getByPrefix('checkin:');
    // Sort by timestamp descending (newest first)
    const sortedCheckIns = checkins
      .map(ci => ci.value)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return c.json({ checkins: sortedCheckIns });
  } catch (error) {
    console.error('Error fetching check-ins:', error);
    return c.json({ error: 'Failed to fetch check-ins', details: String(error) }, 500);
  }
});

// Add a new check-in
app.post('/make-server-90e9fafd/checkins', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { content } = body;

    if (!content || typeof content !== 'string') {
      return c.json({ error: 'Content is required and must be a string' }, 400);
    }

    const checkIn = {
      id: Date.now().toString(),
      author: user.user_metadata?.name || user.email || 'Unknown',
      content,
      timestamp: new Date().toISOString(),
    };

    await kv.set(`checkin:${checkIn.id}`, checkIn);

    return c.json({ checkIn });
  } catch (error) {
    console.error('Error adding check-in:', error);
    return c.json({ error: 'Failed to add check-in', details: String(error) }, 500);
  }
});

// Delete a check-in
app.delete('/make-server-90e9fafd/checkins/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const checkInId = c.req.param('id');
    await kv.del(`checkin:${checkInId}`);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting check-in:', error);
    return c.json({ error: 'Failed to delete check-in', details: String(error) }, 500);
  }
});

// Get all chores
app.get('/make-server-90e9fafd/chores', async (c) => {
  try {
    const chores = await kv.getByPrefix('chore:');
    const sortedChores = chores.map(ch => ch.value);
    return c.json({ chores: sortedChores });
  } catch (error) {
    console.error('Error fetching chores:', error);
    return c.json({ error: 'Failed to fetch chores', details: String(error) }, 500);
  }
});

// Add a new chore
app.post('/make-server-90e9fafd/chores', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { task, assignedTo, frequency } = body;

    if (!task || !assignedTo || !frequency) {
      return c.json({ error: 'Task, assignedTo, and frequency are required' }, 400);
    }

    const chore = {
      id: Date.now().toString(),
      task,
      assignedTo,
      frequency,
      completed: false,
      lastCompleted: null,
      completedBy: null,
    };

    await kv.set(`chore:${chore.id}`, chore);

    return c.json({ chore });
  } catch (error) {
    console.error('Error adding chore:', error);
    return c.json({ error: 'Failed to add chore', details: String(error) }, 500);
  }
});

// Toggle chore completion
app.patch('/make-server-90e9fafd/chores/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const choreId = c.req.param('id');
    const body = await c.req.json();
    const { completed } = body;

    const chores = await kv.get(`chore:${choreId}`);
    if (!chores) {
      return c.json({ error: 'Chore not found' }, 404);
    }

    const updatedChore = {
      ...chores,
      completed,
      lastCompleted: completed ? new Date().toISOString() : chores.lastCompleted,
      completedBy: completed ? (user.user_metadata?.name || user.email) : chores.completedBy,
    };

    await kv.set(`chore:${choreId}`, updatedChore);

    return c.json({ chore: updatedChore });
  } catch (error) {
    console.error('Error toggling chore:', error);
    return c.json({ error: 'Failed to toggle chore', details: String(error) }, 500);
  }
});

// Delete a chore
app.delete('/make-server-90e9fafd/chores/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const choreId = c.req.param('id');
    await kv.del(`chore:${choreId}`);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting chore:', error);
    return c.json({ error: 'Failed to delete chore', details: String(error) }, 500);
  }
});

// Rotate chores
app.post('/make-server-90e9fafd/chores/rotate', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const chores = await kv.getByPrefix('chore:');
    const choresList = chores.map(ch => ch.value);
    
    // Get unique assignees
    const assignees = Array.from(new Set(choresList.map(ch => ch.assignedTo)));
    
    // Rotate assignments
    choresList.forEach(async (chore, index) => {
      const currentAssigneeIndex = assignees.indexOf(chore.assignedTo);
      const nextAssigneeIndex = (currentAssigneeIndex + 1) % assignees.length;
      
      const rotatedChore = {
        ...chore,
        assignedTo: assignees[nextAssigneeIndex],
        completed: false,
      };
      
      await kv.set(`chore:${chore.id}`, rotatedChore);
    });

    return c.json({ success: true });
  } catch (error) {
    console.error('Error rotating chores:', error);
    return c.json({ error: 'Failed to rotate chores', details: String(error) }, 500);
  }
});

// Get all expenses
app.get('/make-server-90e9fafd/expenses', async (c) => {
  try {
    const expenses = await kv.getByPrefix('expense:');
    const sortedExpenses = expenses
      .map(exp => exp.value)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return c.json({ expenses: sortedExpenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return c.json({ error: 'Failed to fetch expenses', details: String(error) }, 500);
  }
});

// Add a new expense
app.post('/make-server-90e9fafd/expenses', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { description, amount, paidBy, category } = body;

    if (!description || !amount || !paidBy || !category) {
      return c.json({ error: 'All fields are required' }, 400);
    }

    const expense = {
      id: Date.now().toString(),
      description,
      amount,
      paidBy,
      category,
      date: new Date().toISOString(),
      splitBetween: [], // Can be extended for custom splits
    };

    await kv.set(`expense:${expense.id}`, expense);

    return c.json({ expense });
  } catch (error) {
    console.error('Error adding expense:', error);
    return c.json({ error: 'Failed to add expense', details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
