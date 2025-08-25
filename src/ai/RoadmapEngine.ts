// src/ai/RoadmapEngine.ts
import { UserProfile } from '../contexts/AppContext';
import { knowledgeGraph } from '../data/skillsData';

// Define a type for the roadmap structure for better type safety
export interface Roadmap {
  title: string;
  focus: string;
  weeks?: Array<{
    week: number;
    title: string;
    focus: string;
    tasks: Array<{
      id: string;
      title: string;
      description: string;
      completed: boolean;
    }>;
  }>;
  error?: string;
  message?: string;
}

export function generateRoadmap(user: UserProfile): Roadmap {
  const longTermGoal = user.goals.longTermGoal;
  if (!longTermGoal) {
    return { 
      title: "Goal Not Set",
      focus: "",
      error: "Long-term goal not set. Please define your goal in the profile wizard." 
    };
  }

  // Find a matching role in the knowledge graph (case-insensitive)
  const roleKey = Object.keys(knowledgeGraph.roles).find(r => longTermGoal.toLowerCase().includes(r.toLowerCase()));
  
  if (!roleKey) {
    return { 
      title: "Path Not Found",
      focus: "",
      error: `Sorry, we don't have a defined career path for "${longTermGoal}" yet.` 
    };
  }
  
  const requiredSkills = knowledgeGraph.roles[roleKey as keyof typeof knowledgeGraph.roles].required_skills;
  const userSkills = new Set(user.skills.map(s => s.name));
  const skillGaps = requiredSkills.filter(skill => !userSkills.has(skill));

  if (skillGaps.length === 0) {
    return {
      title: "You're on the Right Track!",
      focus: "Your skills already align well with your long-term goal.",
      message: "Focus on building your portfolio and preparing for interviews. No new skills are required for this roadmap."
    };
  }

  // Build the 4-week plan
  const roadmapWeeks = [];
  for (let i = 0; i < 4; i++) {
    if (i < skillGaps.length) {
      const skillToLearn = skillGaps[i];
      const resource = knowledgeGraph.skills[skillToLearn as keyof typeof knowledgeGraph.skills]?.resource;
      
      roadmapWeeks.push({
        week: i + 1,
        title: `Week ${i + 1}: Mastering ${skillToLearn}`,
        focus: `This week is dedicated to building a strong foundation in ${skillToLearn}.`,
        tasks: [
          { id: `task-${i}-1`, title: `Learn ${skillToLearn}`, description: resource || "Find a high-quality online tutorial or course.", completed: false },
          { id: `task-${i}-2`, title: `Build a Mini-Project`, description: `Apply your new ${skillToLearn} knowledge by building a small, practical project.`, completed: false }
        ]
      });
    }
  }

  return {
    title: `Your AI Roadmap to Becoming a ${roleKey}`,
    focus: `This 4-week plan focuses on the key skills you need to achieve your goal.`,
    weeks: roadmapWeeks
  };
}