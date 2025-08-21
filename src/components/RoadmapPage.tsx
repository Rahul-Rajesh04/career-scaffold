import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, Brain, Clock, CheckCircle2, Circle, Target, Sparkles, TrendingUp } from 'lucide-react';

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
  const [roadmap, setRoadmap] = useState<RoadmapWeek[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Simulate AI generation process
    const generateRoadmap = () => {
      setTimeout(() => {
        if (!currentUser) return;

        // Analyze user's current skills and goals to generate personalized roadmap
        const userSkills = currentUser.skills.map(s => s.name.toLowerCase());
        const longTermGoal = currentUser.goals.longTermGoal?.toLowerCase() || '';
        
        // Generate roadmap based on user's profile
        const generatedRoadmap: RoadmapWeek[] = [
          {
            week: 1,
            title: "Foundation & Assessment",
            focus: "Evaluate current skills and identify key learning areas",
            tasks: [
              {
                id: "task-1-1",
                title: "Complete Skills Assessment",
                description: "Take online assessments for your core technical skills",
                completed: false
              },
              {
                id: "task-1-2", 
                title: "Industry Research",
                description: "Research 5 companies in your target field and their requirements",
                completed: false
              },
              {
                id: "task-1-3",
                title: "Learning Path Planning",
                description: "Identify 3 key skills to develop based on your career goals",
                completed: false
              },
              {
                id: "task-1-4",
                title: "LinkedIn Profile Optimization",
                description: "Update your LinkedIn with current projects and skills",
                completed: false
              }
            ]
          },
          {
            week: 2,
            title: "Skill Development Sprint",
            focus: longTermGoal.includes('software') ? "Advanced Programming Concepts" : "Core Technical Skills",
            tasks: [
              {
                id: "task-2-1",
                title: longTermGoal.includes('data') ? "Complete Python for Data Science Course" : "Build a React Project",
                description: longTermGoal.includes('data') ? 
                  "Complete 'Python for Data Analysis' course on Coursera" :
                  "Create a full-stack web application using React and Node.js",
                completed: false
              },
              {
                id: "task-2-2",
                title: "Open Source Contribution",
                description: "Make your first contribution to an open-source project",
                completed: false
              },
              {
                id: "task-2-3",
                title: "Technical Blog Writing",
                description: "Write and publish a technical article about what you learned",
                completed: false
              },
              {
                id: "task-2-4",
                title: "Networking Event",
                description: "Attend a virtual tech meetup or webinar in your field",
                completed: false
              }
            ]
          },
          {
            week: 3,
            title: "Project & Portfolio Building",
            focus: "Create showcase projects that demonstrate your abilities",
            tasks: [
              {
                id: "task-3-1",
                title: "Portfolio Website Development",
                description: "Build a professional portfolio website showcasing your projects",
                completed: false
              },
              {
                id: "task-3-2",
                title: "Advanced Project Creation",
                description: longTermGoal.includes('ai') ?
                  "Build a machine learning model and deploy it" :
                  "Create a complex application with advanced features",
                completed: false
              },
              {
                id: "task-3-3",
                title: "Code Review & Optimization",
                description: "Review and refactor your existing projects for best practices",
                completed: false
              },
              {
                id: "task-3-4",
                title: "Documentation & Testing",
                description: "Add comprehensive documentation and tests to your projects",
                completed: false
              }
            ]
          },
          {
            week: 4,
            title: "Career Preparation & Applications",
            focus: "Prepare for job applications and interviews",
            tasks: [
              {
                id: "task-4-1",
                title: "Resume Optimization",
                description: "Tailor your resume for your target positions using our AI analyzer",
                completed: false
              },
              {
                id: "task-4-2",
                title: "Mock Interview Practice",
                description: "Complete 3 mock interviews using our AI interview simulator",
                completed: false
              },
              {
                id: "task-4-3",
                title: "Job Applications",
                description: "Apply to 10 relevant positions with customized cover letters",
                completed: false
              },
              {
                id: "task-4-4",
                title: "Follow-up Strategy",
                description: "Create a system for tracking applications and following up",
                completed: false
              }
            ]
          }
        ];

        setRoadmap(generatedRoadmap);
        setIsGenerating(false);
      }, 2000);
    };

    generateRoadmap();
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
    if (roadmap.length === 0) return 0;
    const totalTasks = roadmap.reduce((sum, week) => sum + week.tasks.length, 0);
    const completedCount = Array.from(completedTasks).length;
    return (completedCount / totalTasks) * 100;
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
          <div className="w-64 mx-auto">
            <Progress value={75} className="h-2 progress-glow" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigateToPage('dashboard')}
                className="btn-ghost"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Your AI Career Roadmap</h1>
                <p className="text-muted-foreground">Personalized 4-week plan to reach your goals</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{Math.round(getOverallProgress())}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Goal Alignment */}
        <Card className="card-elevated p-6 mb-8 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">Roadmap Aligned with Your Goals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Short-term Goal:</p>
                  <p className="font-medium text-sm">{currentUser.goals.shortTermGoal}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Long-term Goal:</p>
                  <p className="font-medium text-sm">{currentUser.goals.longTermGoal}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Overall Progress */}
        <Card className="card-elevated p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Overall Progress</h3>
            <Badge variant="secondary" className="px-3 py-1">
              {Array.from(completedTasks).length} / {roadmap.reduce((sum, week) => sum + week.tasks.length, 0)} tasks
            </Badge>
          </div>
          <Progress value={getOverallProgress()} className="h-4 progress-glow" />
        </Card>

        {/* Weekly Roadmap */}
        <div className="space-y-8">
          {roadmap.map((week, index) => (
            <Card key={week.week} className="card-elevated animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="p-6">
                {/* Week Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-bold">{week.week}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{week.title}</h3>
                      <p className="text-muted-foreground">{week.focus}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{Math.round(getWeekProgress(week))}%</div>
                    <div className="text-xs text-muted-foreground">Week Progress</div>
                  </div>
                </div>

                {/* Week Progress Bar */}
                <Progress value={getWeekProgress(week)} className="h-2 mb-6" />

                {/* Tasks */}
                <div className="space-y-3">
                  {week.tasks.map((task) => {
                    const isCompleted = completedTasks.has(task.id);
                    
                    return (
                      <div
                        key={task.id}
                        className={`flex items-start gap-4 p-4 rounded-lg border transition-all cursor-pointer ${
                          isCompleted 
                            ? 'bg-success/5 border-success/20' 
                            : 'bg-muted/20 border-border/50 hover:border-primary/30'
                        }`}
                        onClick={() => toggleTask(task.id)}
                      >
                        <div className="flex-shrink-0 mt-1">
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-success" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className={`font-medium mb-1 ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {task.title}
                          </h4>
                          <p className={`text-sm ${isCompleted ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                            {task.description}
                          </p>
                        </div>

                        {isCompleted && (
                          <Badge variant="secondary" className="bg-success/20 text-success">
                            Done
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-12">
          <Button
            onClick={() => navigateToPage('resume-analyzer')}
            className="btn-accent"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Analyze Resume Next
          </Button>
          
          <Button
            onClick={() => navigateToPage('interview')}
            className="btn-hero"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Practice Interview
          </Button>
        </div>
      </div>
    </div>
  );
}