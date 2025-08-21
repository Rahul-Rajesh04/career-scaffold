import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types for the application
export interface UserProfile {
  id: string;
  personalDetails: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    university: string;
    major: string;
  };
  skills: Array<{
    id: string;
    name: string;
    category: string;
    proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
  }>;
  experience: {
    projects: Array<{
      id: string;
      title: string;
      description: string;
      technologies: string[];
      url?: string;
    }>;
    workExperience: Array<{
      id: string;
      company: string;
      position: string;
      duration: string;
      description: string;
    }>;
    certifications: Array<{
      id: string;
      name: string;
      issuer: string;
      date: string;
    }>;
  };
  goals: {
    interests: string[];
    shortTermGoal: string;
    longTermGoal: string;
  };
  lastModified: string;
}

export interface AppState {
  currentPage: string;
  currentUser: UserProfile | null;
  profiles: UserProfile[];
  wizardStep: number;
  completedSteps: number[];
}

interface AppContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  navigateToPage: (page: string) => void;
  updateCurrentUser: (updates: Partial<UserProfile>) => void;
  createNewProfile: () => void;
  selectProfile: (profileId: string) => void;
  deleteProfile: (profileId: string) => void;
  calculateProfileCompleteness: () => number;
  getProfileStats: () => { totalSkills: number; totalProjects: number; totalExperience: number };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Sample data for demonstration
const sampleProfiles: UserProfile[] = [
  {
    id: 'demo-user-1',
    personalDetails: {
      fullName: 'Alex Johnson',
      email: 'alex.johnson@university.edu',
      phone: '+1-555-0123',
      location: 'San Francisco, CA',
      university: 'Stanford University',
      major: 'Computer Science'
    },
    skills: [
      { id: 'skill-1', name: 'JavaScript', category: 'Programming Languages', proficiency: 'Advanced' },
      { id: 'skill-2', name: 'React', category: 'Web Development', proficiency: 'Intermediate' },
      { id: 'skill-3', name: 'Python', category: 'Programming Languages', proficiency: 'Intermediate' }
    ],
    experience: {
      projects: [
        {
          id: 'proj-1',
          title: 'E-commerce Platform',
          description: 'Built a full-stack e-commerce platform using React and Node.js',
          technologies: ['React', 'Node.js', 'MongoDB'],
          url: 'https://github.com/alexj/ecommerce'
        }
      ],
      workExperience: [
        {
          id: 'work-1',
          company: 'Tech Startup Inc.',
          position: 'Software Engineering Intern',
          duration: 'Summer 2024',
          description: 'Developed web applications using modern JavaScript frameworks'
        }
      ],
      certifications: [
        {
          id: 'cert-1',
          name: 'AWS Solutions Architect',
          issuer: 'Amazon Web Services',
          date: '2024-03'
        }
      ]
    },
    goals: {
      interests: ['Machine Learning', 'Web Development', 'Cloud Computing'],
      shortTermGoal: 'Secure a software engineering internship',
      longTermGoal: 'Become a Senior Software Engineer at a tech company'
    },
    lastModified: '2024-08-15'
  },
  {
    id: 'demo-user-2',
    personalDetails: {
      fullName: 'Sarah Chen',
      email: 'sarah.chen@college.edu',
      phone: '+1-555-0456',
      location: 'Boston, MA',
      university: 'MIT',
      major: 'Data Science'
    },
    skills: [
      { id: 'skill-4', name: 'Python', category: 'Programming Languages', proficiency: 'Advanced' },
      { id: 'skill-5', name: 'Machine Learning', category: 'Data Science', proficiency: 'Intermediate' }
    ],
    experience: {
      projects: [],
      workExperience: [],
      certifications: []
    },
    goals: {
      interests: ['Artificial Intelligence', 'Data Analysis'],
      shortTermGoal: 'Complete machine learning certification',
      longTermGoal: 'Lead AI research at a technology company'
    },
    lastModified: '2024-08-10'
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    currentPage: 'welcome',
    currentUser: null,
    profiles: sampleProfiles,
    wizardStep: 1,
    completedSteps: []
  });

  const navigateToPage = (page: string) => {
    setState(prev => ({ ...prev, currentPage: page }));
  };

  const updateCurrentUser = (updates: Partial<UserProfile>) => {
    if (!state.currentUser) return;
    
    const updatedUser = { ...state.currentUser, ...updates, lastModified: new Date().toISOString().split('T')[0] };
    
    setState(prev => ({
      ...prev,
      currentUser: updatedUser,
      profiles: prev.profiles.map(profile => 
        profile.id === updatedUser.id ? updatedUser : profile
      )
    }));
  };

  const createNewProfile = () => {
    const newProfile: UserProfile = {
      id: `user-${Date.now()}`,
      personalDetails: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        university: '',
        major: ''
      },
      skills: [],
      experience: {
        projects: [],
        workExperience: [],
        certifications: []
      },
      goals: {
        interests: [],
        shortTermGoal: '',
        longTermGoal: ''
      },
      lastModified: new Date().toISOString().split('T')[0]
    };

    setState(prev => ({
      ...prev,
      currentUser: newProfile,
      profiles: [...prev.profiles, newProfile],
      currentPage: 'wizard',
      wizardStep: 1,
      completedSteps: []
    }));
  };

  const selectProfile = (profileId: string) => {
    const profile = state.profiles.find(p => p.id === profileId);
    if (profile) {
      setState(prev => ({
        ...prev,
        currentUser: profile,
        currentPage: 'dashboard'
      }));
    }
  };

  const deleteProfile = (profileId: string) => {
    setState(prev => ({
      ...prev,
      profiles: prev.profiles.filter(p => p.id !== profileId),
      currentUser: prev.currentUser?.id === profileId ? null : prev.currentUser
    }));
  };

  const calculateProfileCompleteness = (): number => {
    if (!state.currentUser) return 0;

    const user = state.currentUser;
    let completedSections = 0;
    const totalSections = 6;

    // Personal details
    if (user.personalDetails.fullName && user.personalDetails.email && 
        user.personalDetails.university && user.personalDetails.major) {
      completedSections++;
    }

    // Skills
    if (user.skills.length > 0) completedSections++;

    // Projects
    if (user.experience.projects.length > 0) completedSections++;

    // Work experience
    if (user.experience.workExperience.length > 0) completedSections++;

    // Certifications
    if (user.experience.certifications.length > 0) completedSections++;

    // Goals
    if (user.goals.shortTermGoal && user.goals.longTermGoal) completedSections++;

    return Math.round((completedSections / totalSections) * 100);
  };

  const getProfileStats = () => {
    if (!state.currentUser) return { totalSkills: 0, totalProjects: 0, totalExperience: 0 };

    return {
      totalSkills: state.currentUser.skills.length,
      totalProjects: state.currentUser.experience.projects.length,
      totalExperience: state.currentUser.experience.workExperience.length
    };
  };

  return (
    <AppContext.Provider 
      value={{
        state,
        setState,
        navigateToPage,
        updateCurrentUser,
        createNewProfile,
        selectProfile,
        deleteProfile,
        calculateProfileCompleteness,
        getProfileStats
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}