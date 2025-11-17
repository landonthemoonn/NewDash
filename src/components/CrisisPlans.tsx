import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { AlertTriangle, Phone, Heart, Home, Shield } from 'lucide-react';

export function CrisisPlans() {
  return (
    <Card className="glass-strong border border-white/10 shadow-2xl hover:shadow-accent/20 transition-all duration-500">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent/10 border border-accent/20">
            <AlertTriangle className="h-5 w-5 text-accent" />
          </div>
          <div>
            <CardTitle className="text-lg">Crisis & Emergency Plans</CardTitle>
            <CardDescription>Protocols for safety, health, and urgent situations</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-2">
          <AccordionItem value="medical" className="glass border border-white/10 rounded-xl px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-accent" />
                <span>Medical Emergencies</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                <p className="text-sm font-medium mb-2">Emergency: Call 911</p>
                <p className="text-xs text-muted-foreground">For life-threatening situations, severe injury, or urgent medical needs</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Emergency Contacts:</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Poison Control: 1-800-222-1222</li>
                  <li>• Nearest ER: [Add your local ER info]</li>
                  <li>• Urgent Care: [Add nearby urgent care]</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Roommate Medical Info:</p>
                <p className="text-xs text-muted-foreground">
                  Keep a shared note with allergies, medications, emergency contacts, and insurance info for each roommate.
                </p>
              </div>

              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-xs font-medium">Protocol:</p>
                <ol className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>1. Call 911 if life-threatening</li>
                  <li>2. Notify other roommates immediately</li>
                  <li>3. Have medical info ready for responders</li>
                  <li>4. Someone stays with the person until help arrives</li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="mental-health" className="glass border border-white/10 rounded-xl px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-accent" />
                <span>Mental Health Crisis</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                <p className="text-sm font-medium mb-2">Crisis Resources:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• 988 Suicide & Crisis Lifeline</li>
                  <li>• Crisis Text Line: Text HOME to 741741</li>
                  <li>• Trevor Project (LGBTQ+): 1-866-488-7386</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">When a roommate is struggling:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Ask directly: "Are you thinking of hurting yourself?"</li>
                  <li>• Listen without judgment</li>
                  <li>• Don't leave them alone if actively in crisis</li>
                  <li>• Help them connect to professional support</li>
                  <li>• Follow up in the days after</li>
                </ul>
              </div>

              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-xs font-medium">Safety Plan Template:</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Each roommate can optionally share: Warning signs, coping strategies, people to contact, professional support info, and how to help.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="safety" className="glass border border-white/10 rounded-xl px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-accent" />
                <span>Physical Safety & Threat</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                <p className="text-sm font-medium mb-2">Call 911 if:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Someone is in immediate danger</li>
                  <li>• There's an intruder or threatening situation</li>
                  <li>• You witness domestic violence or assault</li>
                  <li>• You feel unsafe and need police assistance</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Household Safety:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Lock doors at night and when leaving</li>
                  <li>• Don't let strangers in without checking with roommates</li>
                  <li>• Safe word if someone needs help subtly</li>
                  <li>• Exit plan and meeting point if we need to evacuate</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="apartment" className="glass border border-white/10 rounded-xl px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Home className="h-5 w-5 text-accent" />
                <span>Apartment Emergencies</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <div className="space-y-2">
                <p className="text-sm font-medium">Fire:</p>
                <ol className="text-xs text-muted-foreground space-y-1">
                  <li>1. Get out immediately - don't stop for belongings</li>
                  <li>2. Pull fire alarm if in building</li>
                  <li>3. Call 911 once outside and safe</li>
                  <li>4. Meeting point: [Agree on a spot outside your building]</li>
                </ol>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Flooding / Leak:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Shut off water main if possible</li>
                  <li>• Call landlord immediately: [Add number]</li>
                  <li>• Move valuables to dry areas</li>
                  <li>• Document damage with photos</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Gas Leak:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Leave apartment immediately - don't use lights/electronics</li>
                  <li>• Call gas company from outside: [Add number]</li>
                  <li>• Call 911 if serious</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Lockout:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Spare key location: [Add info]</li>
                  <li>• Landlord contact: [Add number]</li>
                  <li>• Emergency locksmith: [Add backup option]</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="conflict" className="glass border border-white/10 rounded-xl px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent" />
                <span>Escalated Roommate Conflict</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-xs font-medium mb-2">When tension is too high to resolve in-house:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Take a break - pause the conversation</li>
                  <li>• Give each other space (separate rooms, walk, etc.)</li>
                  <li>• Revisit when calm, or involve neutral third party</li>
                  <li>• If feeling unsafe, prioritize leaving and getting support</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">De-escalation Tools:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Use "I need a break" without explanation needed</li>
                  <li>• Text instead of talking if emotions are high</li>
                  <li>• Request mediation from trusted friend or therapist</li>
                </ul>
              </div>

              <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                <p className="text-xs font-medium">This is not for physical violence or threats</p>
                <p className="text-xs text-muted-foreground mt-1">
                  If you feel unsafe or there's any physical aggression, leave and call 911. Your safety comes first.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="kepler" className="glass border border-white/10 rounded-xl px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-accent" />
                <span>Kepler Emergency</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                <p className="text-sm font-medium mb-2">Vet Contacts:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Primary Vet: [Add name & number]</li>
                  <li>• Emergency Vet (24hr): [Add name & number]</li>
                  <li>• Pet Poison Helpline: 1-855-764-7661</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Emergency Signs:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Difficulty breathing</li>
                  <li>• Seizures or loss of consciousness</li>
                  <li>• Severe bleeding or trauma</li>
                  <li>• Ingested toxic substance</li>
                  <li>• Bloated stomach + restlessness (emergency!)</li>
                </ul>
              </div>

              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-xs font-medium">Protocol:</p>
                <ol className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>1. Call emergency vet immediately</li>
                  <li>2. Text roommate group chat</li>
                  <li>3. Bring medical records if possible</li>
                  <li>4. Have credit card ready (emergency care is expensive)</li>
                  <li>5. Someone goes with Kepler - she shouldn't be alone</li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-xl">
          <p className="text-sm font-medium mb-2">⚡ Quick Reference</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="font-medium">Emergency: 911</p>
              <p className="text-muted-foreground">Police, Fire, Ambulance</p>
            </div>
            <div>
              <p className="font-medium">Crisis: 988</p>
              <p className="text-muted-foreground">Mental Health Support</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
