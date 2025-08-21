import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ArrowLeft, Upload, FileText, CheckCircle, AlertTriangle, XCircle, Lightbulb, TrendingUp, Star } from 'lucide-react';

interface AnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: {
    category: string;
    items: string[];
    priority: 'high' | 'medium' | 'low';
  }[];
}

export function ResumeAnalyzerPage() {
  const { state, navigateToPage } = useApp();
  const currentUser = state.currentUser;
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  if (!currentUser) return null;

  const simulateUpload = () => {
    setUploadedFile("resume.pdf");
    
    setTimeout(() => {
      setIsAnalyzing(true);
      
      // Simulate analysis process
      setTimeout(() => {
        const mockAnalysis: AnalysisResult = {
          score: 78,
          strengths: [
            "Strong technical skills section with relevant programming languages",
            "Good project descriptions with quantifiable results",
            "Clear education section with relevant coursework",
            "Consistent formatting and professional layout"
          ],
          weaknesses: [
            "Missing contact information (phone number)",
            "No action verbs in experience descriptions",
            "Limited keywords from target job descriptions",
            "Missing certifications section"
          ],
          suggestions: [
            {
              category: "Keyword Optimization",
              priority: "high",
              items: [
                "Add more industry-specific keywords like 'Agile', 'CI/CD', 'microservices'",
                "Include programming frameworks mentioned in job postings",
                "Use technical terms that match your target role descriptions",
                "Add soft skills keywords like 'collaboration', 'problem-solving'"
              ]
            },
            {
              category: "Action Verbs & Impact",
              priority: "high",
              items: [
                "Replace 'responsible for' with strong action verbs like 'developed', 'implemented', 'optimized'",
                "Quantify achievements with numbers and percentages",
                "Show the impact of your contributions on projects",
                "Use past tense for previous roles, present tense for current roles"
              ]
            },
            {
              category: "Content Enhancement", 
              priority: "medium",
              items: [
                "Add a professional summary at the top highlighting your key strengths",
                "Include relevant coursework that aligns with your career goals",
                "Add any relevant certifications or online courses completed",
                "Consider adding a skills proficiency level indicator"
              ]
            },
            {
              category: "Formatting & Structure",
              priority: "low",
              items: [
                "Ensure consistent spacing between sections",
                "Use bullet points for better readability", 
                "Keep the resume to 1-2 pages maximum",
                "Use a professional font like Arial or Calibri"
              ]
            }
          ]
        };

        setAnalysisResult(mockAnalysis);
        setIsAnalyzing(false);
      }, 3000);
    }, 1000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreDescription = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'medium': return <Lightbulb className="w-4 h-4 text-warning" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-success" />;
      default: return <CheckCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getPriorityBadge = (priority: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (priority) {
      case 'high': return "destructive";
      case 'medium': return "secondary";
      case 'low': return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
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
              <h1 className="text-2xl font-bold text-foreground">AI Resume Analyzer</h1>
              <p className="text-muted-foreground">Get AI-powered feedback to optimize your resume</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {!uploadedFile ? (
          /* Upload Section */
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="card-elevated p-12 text-center max-w-md animate-fade-in">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              
              <h2 className="text-2xl font-semibold text-foreground mb-4">Upload Your Resume</h2>
              <p className="text-muted-foreground mb-8">
                Upload your resume and get instant AI-powered feedback to improve your chances of landing interviews.
              </p>
              
              <Button onClick={simulateUpload} className="btn-hero w-full">
                <Upload className="w-4 h-4 mr-2" />
                Choose Resume File
              </Button>
              
              <p className="text-xs text-muted-foreground mt-4">
                Supports PDF, DOC, and DOCX files up to 5MB
              </p>
            </Card>
          </div>
        ) : isAnalyzing ? (
          /* Analysis Loading */
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center animate-pulse">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <FileText className="w-8 h-8 text-primary-foreground" />
              </div>
              
              <h2 className="text-2xl font-semibold text-foreground mb-2">Analyzing Your Resume</h2>
              <p className="text-muted-foreground mb-6">
                Our AI is reviewing your resume for optimization opportunities...
              </p>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✓ Parsing content structure</p>
                <p>✓ Analyzing keyword density</p>
                <p>✓ Checking formatting consistency</p>
                <p>⟳ Generating improvement suggestions</p>
              </div>
            </div>
          </div>
        ) : analysisResult ? (
          /* Analysis Results */
          <div className="space-y-8 animate-fade-in">
            {/* Score Card */}
            <Card className="card-elevated p-8 text-center">
              <div className="flex items-center justify-center gap-8">
                <div>
                  <div className={`text-6xl font-bold mb-2 ${getScoreColor(analysisResult.score)}`}>
                    {analysisResult.score}
                  </div>
                  <p className="text-muted-foreground">Overall Score</p>
                </div>
                
                <div className="w-px h-16 bg-border"></div>
                
                <div className="text-left">
                  <div className={`text-xl font-semibold mb-1 ${getScoreColor(analysisResult.score)}`}>
                    {getScoreDescription(analysisResult.score)}
                  </div>
                  <p className="text-muted-foreground">Resume Quality</p>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < Math.floor(analysisResult.score / 20) 
                            ? 'text-warning fill-warning' 
                            : 'text-muted-foreground'
                        }`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Resume Preview */}
              <div className="lg:col-span-1">
                <Card className="card-elevated p-6 sticky top-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Resume Preview</h3>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4 text-sm">
                    <div className="border-b border-border/50 pb-3 mb-3">
                      <h4 className="font-semibold">{currentUser.personalDetails.fullName}</h4>
                      <p className="text-muted-foreground text-xs">{currentUser.personalDetails.email}</p>
                      <p className="text-muted-foreground text-xs">{currentUser.personalDetails.location}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-xs mb-1">EDUCATION</h5>
                        <p className="text-xs">{currentUser.personalDetails.university}</p>
                        <p className="text-xs text-muted-foreground">{currentUser.personalDetails.major}</p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-xs mb-1">SKILLS</h5>
                        <div className="flex flex-wrap gap-1">
                          {currentUser.skills.slice(0, 6).map((skill) => (
                            <Badge key={skill.id} variant="outline" className="text-xs">
                              {skill.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-xs mb-1">PROJECTS</h5>
                        {currentUser.experience.projects.slice(0, 2).map((project) => (
                          <div key={project.id} className="mb-2">
                            <p className="text-xs font-medium">{project.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {project.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Analysis Results */}
              <div className="lg:col-span-2 space-y-6">
                {/* Strengths */}
                <Card className="card-elevated p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <h3 className="text-lg font-semibold text-foreground">Strengths</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {analysisResult.strengths.map((strength, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-foreground">{strength}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Areas for Improvement */}
                <Card className="card-elevated p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <XCircle className="w-5 h-5 text-destructive" />
                    <h3 className="text-lg font-semibold text-foreground">Areas for Improvement</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {analysisResult.weaknesses.map((weakness, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-foreground">{weakness}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Detailed Suggestions */}
                <Card className="card-elevated p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Detailed Suggestions</h3>
                  </div>

                  <Accordion type="single" collapsible className="space-y-4">
                    {analysisResult.suggestions.map((suggestion, index) => (
                      <AccordionItem key={index} value={`item-${index}`} className="border border-border/50 rounded-lg">
                        <AccordionTrigger className="px-4 py-3 hover:no-underline">
                          <div className="flex items-center gap-3">
                            {getPriorityIcon(suggestion.priority)}
                            <span className="font-medium">{suggestion.category}</span>
                            <Badge variant={getPriorityBadge(suggestion.priority)} className="text-xs">
                              {suggestion.priority} priority
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-2">
                            {suggestion.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-sm text-muted-foreground">{item}</p>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Card>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => {
                  setUploadedFile(null);
                  setAnalysisResult(null);
                }}
                variant="outline"
                className="btn-ghost"
              >
                Analyze Another Resume
              </Button>
              
              <Button
                onClick={() => navigateToPage('interview')}
                className="btn-hero"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Practice Mock Interview
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}