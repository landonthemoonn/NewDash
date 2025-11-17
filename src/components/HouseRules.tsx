import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Home, Dog, Users, MessageSquare, AlertTriangle, DollarSign, Calendar, Info } from 'lucide-react';

export function HouseRules() {
  return (
    <Card className="glass-strong border border-white/10 shadow-2xl hover:shadow-accent/20 transition-all duration-500">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent/10 border border-accent/20">
            <Home className="h-5 w-5 text-accent" />
          </div>
          <div>
            <CardTitle className="text-lg">House Rules & Agreements</CardTitle>
            <CardDescription>apt42 + Living Agreement Dashboard</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-2">
          {/* House Rules & Spaces */}
          <AccordionItem value="house-rules" className="glass border border-white/10 rounded-xl px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Home className="h-5 w-5 text-accent" />
                <span>House Rules & Spaces</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 text-sm">
                <li><strong>Kitchen etiquette:</strong></li>
                <li className="ml-4">• Clean as you go</li>
                <li className="ml-4">• Label leftovers</li>
                <li><strong>Landlord's bedroom:</strong> Private space</li>
                <li><strong>Common areas:</strong> Keep tidy</li>
                <li><strong>Quiet hours:</strong> Respectful after 10pm</li>
                <li><strong>Guests policy:</strong> Communicate in advance</li>
                <li><strong>Smoking/vaping:</strong> Outside only</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Kepler's Care & Rules */}
          <AccordionItem value="kepler" className="glass border border-white/10 rounded-xl px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Dog className="h-5 w-5 text-accent" />
                <span>Kepler's Care & Rules</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 text-sm">
                <li><strong>Feeding schedule:</strong> Twice daily</li>
                <li><strong>Walks:</strong> At least 3x per day</li>
                <li><strong>Avoid trigger pet enemies</strong></li>
                <li><strong>Behavioral issues:</strong> Discuss with landlord</li>
                <li><strong>Supplies location:</strong> [Specify location]</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Chores & Responsibilities */}
          <AccordionItem value="chores" className="glass border border-white/10 rounded-xl px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-accent" />
                <span>Chores & Responsibilities</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 text-sm">
                <li><strong>Your weekly responsibilities:</strong></li>
                <li className="ml-4">• Kepler care (walks, feeding)</li>
                <li className="ml-4">• Keep shared spaces clean</li>
                <li><strong>Showering:</strong> Coordinate timing</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Communication & Conflict */}
          <AccordionItem value="communication" className="glass border border-white/10 rounded-xl px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-accent" />
                <span>Communication & Conflict</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 text-sm">
                <li><strong>Preferred medium:</strong> Text/in-person</li>
                <li><strong>If not RIGHT:</strong> Address issues respectfully</li>
                <li><strong>We're a teampls remember we're human too :)</strong></li>
                <li><strong>Alex's specific concerns:</strong> Communicate openly</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Substance Use */}
          <AccordionItem value="substances" className="glass border border-white/10 rounded-xl px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-accent" />
                <span>Substance Use</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 text-sm">
                <li><strong>Hard Conversations:</strong> Be honest and open</li>
                <li>If issues arise, discuss respectfully</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Crisis Plans */}
          <AccordionItem value="crisis" className="glass border border-white/10 rounded-xl px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-accent" />
                <span>Crisis Plans</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 text-sm">
                <li><strong>Emergency contacts:</strong> Share with each other</li>
                <li><strong>Mental health resources:</strong> Support available</li>
                <li>If someone needs help, communicate and support</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Financial Arrangement */}
          <AccordionItem value="financial" className="glass border border-white/10 rounded-xl px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-accent" />
                <span>Financial Arrangement</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 text-sm">
                <li><strong>Monthly rent:</strong> Agreed amount</li>
                <li><strong>Payment method:</strong> Venmo/Zelle</li>
                <li><strong>Due date:</strong> [Specify date]</li>
                <li><strong>Utilities:</strong> Included/split</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Timeline & Exit Strategy */}
          <AccordionItem value="timeline" className="glass border border-white/10 rounded-xl px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-accent" />
                <span>Timeline & Exit Strategy</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 text-sm">
                <li><strong>Move-in Date:</strong> [Date]</li>
                <li><strong>Agreement Duration:</strong> Month-to-month or fixed term</li>
                <li><strong>Notice period:</strong> 30 days minimum</li>
                <li><strong>End date (if applicable):</strong> TBD</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Practical Info */}
          <AccordionItem value="practical" className="glass border border-white/10 rounded-xl px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-accent" />
                <span>Practical Info</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 text-sm">
                <li><strong>Laundry room:</strong> Building location/schedule</li>
                <li><strong>Laundry bathroom:</strong> Coordinate use</li>
                <li><strong>WiFi:</strong> Network name and password</li>
                <li><strong>Trash/Recycling:</strong> Schedule and location</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-4 p-4 bg-accent/10 border border-accent/30 rounded-xl text-xs">
          <p><strong>Remember:</strong> This is a living document. We can update these rules together as needed through open communication.</p>
        </div>
      </CardContent>
    </Card>
  );
}
