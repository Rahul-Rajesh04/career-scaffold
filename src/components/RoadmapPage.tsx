// src/components/RoadmapPage.tsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { generateRoadmap, Roadmap } from '../ai/RoadmapEngine'; // Import our new AI engine and type
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { ArrowLeft, Brain, CheckCircle2, Circle, Target } from 'lucide-react';

interface RoadmapWeek {
  week: number;
  title: string;
  focus: string;
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
  }>;
}

export function RoadmapPage() {
  const { state, navigateToPage } = useApp();
  const currentUser = state.currentUser;
  const [isGenerating, setIsGenerating] = useState(true);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    setIsGenerating(true);
    // Simulate AI thinking time for a better user experience
    setTimeout(() => {
      if (currentUser) {
        const result = generateRoadmap(currentUser);
        setRoadmap(result);
      }
      setIsGenerating(false);
    }, 1500);
  }, [currentUser]);

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const getWeekProgress = (week: RoadmapWeek) => {
    const completed = week.tasks.filter(task => completedTasks.has(task.id)).length;
    return (completed / week.tasks.length) * 100;
  };

  const getOverallProgress = () => {
    if (!roadmap?.weeks || roadmap.weeks.length === 0) return 0;
    const totalTasks = roadmap.weeks.reduce((sum, week) => sum + week.tasks.length, 0);
    return (completedTasks.size / totalTasks) * 100;
  };

  if (!currentUser) return null;

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Brain className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Generating Your Personalized Roadmap</h2>
          <p className="text-muted-foreground mb-6">Our AI is analyzing your profile and creating a custom 4-week plan...</p>
        </div>
      </div>
    );
  }

  // Handle error or special message states from the engine
  if (roadmap?.error || roadmap?.message) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-8">
        <h2 className="text-2xl font-semibold text-destructive mb-4">{roadmap.error || roadmap.title}</h2>
        <p className="text-muted-foreground mb-8 max-w-md">{roadmap.message || "Please complete your profile to generate a roadmap."}</p>
        <Button onClick={() => navigateToPage('dashboard')} className="btn-hero">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigateToPage('dashboard')} className="btn-ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{roadmap?.title}</h1>
                <p className="text-muted-foreground">{roadmap?.focus}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Card className="card-elevated p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Overall Progress</h3>
          </div>
          <Progress value={getOverallProgress()} className="h-4 progress-glow" />
        </Card>

        <div className="space-y-8">
          {roadmap?.weeks?.map((week, index) => (
            <Card key={week.week} className="card-elevated animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-semibold text-foreground">{week.title}</h3>
                            <p className="text-muted-foreground">{week.focus}</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {week.tasks.map((task) => {
                            const isCompleted = completedTasks.has(task.id);
                            return (
                                <div key={task.id} className={`flex items-start gap-4 p-4 rounded-lg border transition-all cursor-pointer mb-2 ${isCompleted ? 'bg-success/5 border-success/20' : 'bg-muted/20 border-border/50 hover:border-primary/30'}`} onClick={() => toggleTask(task.id)}>
                                    <div className="flex-shrink-0 mt-1">
                                        {isCompleted ? <CheckCircle2 className="w-5 h-5 text-success" /> : <Circle className="w-5 h-5 text-muted-foreground" />}
                                    </div>
                                    <div>
                                        <h4 className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.title}</h4>
                                        <p className="text-sm text-muted-foreground">{task.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}