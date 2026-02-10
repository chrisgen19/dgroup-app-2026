'use client';

import { useState } from 'react';
import { X, Hand, Music, BookOpen, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MeetingAssistantProps } from '@/types';

interface MeetingStep {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  content: string;
  color: string;
}

const STEPS: MeetingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    icon: Hand,
    content:
      'Ice Breaker: "What is one thing you are grateful for this week?"',
    color: 'bg-orange-500',
  },
  {
    id: 'worship',
    title: 'Worship',
    icon: Music,
    content: 'Suggested Song: "Goodness of God" - Bethel Music',
    color: 'bg-purple-500',
  },
  {
    id: 'word',
    title: 'Word',
    icon: BookOpen,
    content:
      'Topic: Radical Love. Read: John 15:12-13. "How can we apply this love to our enemies?"',
    color: 'bg-blue-500',
  },
  {
    id: 'works',
    title: 'Works',
    icon: Heart,
    content:
      'Prayer Points & Ministry Opportunities. Who can we invite next week?',
    color: 'bg-emerald-500',
  },
];

export function MeetingAssistant({ onClose, groupName }: MeetingAssistantProps) {
  const [step, setStep] = useState(0);
  const currentStep = STEPS[step];
  const StepIcon = currentStep.icon;

  return (
    <div className="fixed inset-0 bg-slate-900/95 z-50 flex flex-col text-white">
      <div className="p-6 flex justify-between items-center">
        <h2 className="text-xl font-bold opacity-80">{groupName} Meeting</h2>
        <button onClick={onClose}>
          <X className="text-white/60 hover:text-white" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div
          className={`w-24 h-24 rounded-full ${currentStep.color} flex items-center justify-center mb-8 shadow-2xl shadow-white/10`}
        >
          <StepIcon size={40} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4 tracking-tight">
          {currentStep.title}
        </h1>
        <p className="text-xl text-slate-300 max-w-md leading-relaxed">
          {currentStep.content}
        </p>
      </div>

      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`h-1.5 flex-1 mx-1 rounded-full ${i <= step ? 'bg-white' : 'bg-white/20'}`}
            />
          ))}
        </div>
        <div className="flex gap-4">
          <Button
            variant="secondary"
            className="flex-1 bg-white/10 text-white hover:bg-white/20 border-0"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
          >
            Previous
          </Button>
          <Button
            variant="primary"
            className="flex-1 bg-white text-indigo-900 hover:bg-indigo-50"
            onClick={() => (step < 3 ? setStep(step + 1) : onClose())}
          >
            {step === 3 ? 'Finish Meeting' : 'Next Step'}
          </Button>
        </div>
      </div>
    </div>
  );
}
