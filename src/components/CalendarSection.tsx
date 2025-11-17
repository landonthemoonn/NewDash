import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CalendarDays, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { format, addDays, subDays, startOfDay, parseISO } from 'date-fns';

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}

interface CalendarSectionProps {
  session: any;
  supabase: any;
  devMode?: boolean;
}

export function CalendarSection({ session, supabase, devMode }: CalendarSectionProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGoogleCalendarEvents = async () => {
    if (devMode || !session?.provider_token) {
      setEvents([]);
      return;
    }

    try {
      setLoading(true);
      const dayStart = startOfDay(currentDate).toISOString();
      const dayEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59).toISOString();

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${dayStart}&timeMax=${dayEnd}&singleEvents=true&orderBy=startTime`,
        {
          headers: {
            'Authorization': `Bearer ${session.provider_token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEvents(data.items || []);
      }
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoogleCalendarEvents();
  }, [currentDate]);

  const formatEventTime = (event: CalendarEvent) => {
    if (event.start.dateTime) {
      const start = parseISO(event.start.dateTime);
      const end = event.end.dateTime ? parseISO(event.end.dateTime) : null;
      
      if (end) {
        return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
      }
      return format(start, 'h:mm a');
    }
    return 'All day';
  };

  return (
    <Card className="glass-strong border border-white/10 shadow-2xl hover:shadow-accent/20 transition-all duration-500 flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent/10 border border-accent/20">
            <CalendarDays className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">Daily Schedule</CardTitle>
            <CardDescription>Today's events and activities</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchGoogleCalendarEvents}
            className="gap-2 hover:bg-white/10 rounded-xl"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        {/* Date Navigation */}
        <div className="flex items-center justify-between p-4 glass rounded-2xl border border-white/10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(subDays(currentDate, 1))}
            className="hover:bg-white/10 rounded-xl"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <p className="font-medium text-lg">{format(currentDate, 'EEEE')}</p>
            <p className="text-sm text-muted-foreground">{format(currentDate, 'MMMM d, yyyy')}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(addDays(currentDate, 1))}
            className="hover:bg-white/10 rounded-xl"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentDate(new Date())}
          className="w-full glass border-white/20 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 rounded-xl"
        >
          Jump to Today
        </Button>

        {/* Events List */}
        <div className="space-y-2 flex-1 flex flex-col min-h-0">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : events.length > 0 ? (
            <div className="space-y-3 overflow-y-auto pr-2 flex-1">
              {events.map((event, index) => (
                <div 
                  key={event.id} 
                  className="p-4 glass rounded-xl border border-white/10 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <p className="text-xs text-accent mb-1">{formatEventTime(event)}</p>
                  <h4 className="font-medium">{event.summary}</h4>
                  {event.description && (
                    <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <div className="inline-block p-4 rounded-2xl glass border border-white/10 mb-3">
                <CalendarDays className="h-10 w-10 text-muted" />
              </div>
              <p className="text-sm">No events scheduled</p>
            </div>
          )}
        </div>

        {devMode && (
          <div className="text-xs text-muted-foreground pt-2 border-t">
            <p>Calendar will sync from Google when you enable authentication</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
