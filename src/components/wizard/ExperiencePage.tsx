import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Plus, Edit, Trash2, Briefcase, FolderOpen, Award, ExternalLink } from 'lucide-react';

export function ExperiencePage() {
  const { state, updateCurrentUser } = useApp();
  const currentUser = state.currentUser;
  const [activeTab, setActiveTab] = useState('projects');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  if (!currentUser) return null;

  const openDialog = (type: string, item?: any) => {
    setEditingItem({ type, ...item });
    setFormData(item || {});
  };

  const closeDialog = () => {
    setEditingItem(null);
    setFormData({});
  };

  const saveItem = () => {
    if (!editingItem) return;

    const { type } = editingItem;
    const updatedExperience = { ...currentUser.experience };

    if (editingItem.id) {
      // Update existing item
      if (type === 'projects') {
        updatedExperience.projects = updatedExperience.projects.map(item =>
          item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
        );
      } else if (type === 'workExperience') {
        updatedExperience.workExperience = updatedExperience.workExperience.map(item =>
          item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
        );
      } else if (type === 'certifications') {
        updatedExperience.certifications = updatedExperience.certifications.map(item =>
          item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
        );
      }
    } else {
      // Add new item
      const newItem = { ...formData, id: `${type}-${Date.now()}` };
      if (type === 'projects') {
        updatedExperience.projects = [...updatedExperience.projects, newItem];
      } else if (type === 'workExperience') {
        updatedExperience.workExperience = [...updatedExperience.workExperience, newItem];
      } else if (type === 'certifications') {
        updatedExperience.certifications = [...updatedExperience.certifications, newItem];
      }
    }

    updateCurrentUser({ experience: updatedExperience });
    closeDialog();
  };

  const deleteItem = (type: string, id: string) => {
    const updatedExperience = { ...currentUser.experience };
    
    if (type === 'projects') {
      updatedExperience.projects = updatedExperience.projects.filter(item => item.id !== id);
    } else if (type === 'workExperience') {
      updatedExperience.workExperience = updatedExperience.workExperience.filter(item => item.id !== id);
    } else if (type === 'certifications') {
      updatedExperience.certifications = updatedExperience.certifications.filter(item => item.id !== id);
    }
    
    updateCurrentUser({ experience: updatedExperience });
  };

  const renderProjectDialog = () => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{editingItem?.id ? 'Edit Project' : 'Add New Project'}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Project Title *</Label>
          <Input
            id="title"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="My Awesome Project"
            className="bg-muted/30"
          />
        </div>
        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your project, what it does, and your role..."
            rows={4}
            className="bg-muted/30"
          />
        </div>
        <div>
          <Label htmlFor="technologies">Technologies Used</Label>
          <Input
            id="technologies"
            value={formData.technologies?.join(', ') || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
            })}
            placeholder="React, Node.js, MongoDB (comma-separated)"
            className="bg-muted/30"
          />
        </div>
        <div>
          <Label htmlFor="url">Project URL (optional)</Label>
          <Input
            id="url"
            value={formData.url || ''}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://github.com/username/project"
            className="bg-muted/30"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={closeDialog}>Cancel</Button>
          <Button onClick={saveItem} className="btn-hero">Save Project</Button>
        </div>
      </div>
    </DialogContent>
  );

  const renderWorkDialog = () => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{editingItem?.id ? 'Edit Work Experience' : 'Add Work Experience'}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              value={formData.company || ''}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Company Name"
              className="bg-muted/30"
            />
          </div>
          <div>
            <Label htmlFor="position">Position *</Label>
            <Input
              id="position"
              value={formData.position || ''}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="Software Engineer Intern"
              className="bg-muted/30"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={formData.duration || ''}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="June 2024 - August 2024"
            className="bg-muted/30"
          />
        </div>
        <div>
          <Label htmlFor="description">Job Description</Label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your responsibilities and achievements..."
            rows={4}
            className="bg-muted/30"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={closeDialog}>Cancel</Button>
          <Button onClick={saveItem} className="btn-hero">Save Experience</Button>
        </div>
      </div>
    </DialogContent>
  );

  const renderCertificationDialog = () => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{editingItem?.id ? 'Edit Certification' : 'Add Certification'}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Certification Name *</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="AWS Solutions Architect"
            className="bg-muted/30"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="issuer">Issuing Organization *</Label>
            <Input
              id="issuer"
              value={formData.issuer || ''}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              placeholder="Amazon Web Services"
              className="bg-muted/30"
            />
          </div>
          <div>
            <Label htmlFor="date">Date Obtained</Label>
            <Input
              id="date"
              value={formData.date || ''}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              placeholder="2024-03"
              className="bg-muted/30"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={closeDialog}>Cancel</Button>
          <Button onClick={saveItem} className="btn-hero">Save Certification</Button>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Professional Experience</h2>
        <p className="text-muted-foreground">Showcase your projects, work experience, and certifications.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-muted/30">
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            Projects ({currentUser.experience.projects.length})
          </TabsTrigger>
          <TabsTrigger value="work" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Work Experience ({currentUser.experience.workExperience.length})
          </TabsTrigger>
          <TabsTrigger value="certifications" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Certifications ({currentUser.experience.certifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Your Projects</h3>
            <Dialog open={editingItem?.type === 'projects'} onOpenChange={closeDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => openDialog('projects')} className="btn-hero">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </DialogTrigger>
              {renderProjectDialog()}
            </Dialog>
          </div>

          {currentUser.experience.projects.length === 0 ? (
            <Card className="p-8 text-center">
              <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No projects added yet. Add your first project to get started!</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {currentUser.experience.projects.map((project) => (
                <Card key={project.id} className="card-elevated p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">{project.title}</h4>
                        {project.url && (
                          <a href={project.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 text-primary hover:text-primary-glow" />
                          </a>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">{project.description}</p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">{tech}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openDialog('projects', project)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteItem('projects', project.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="work" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Work Experience</h3>
            <Dialog open={editingItem?.type === 'workExperience'} onOpenChange={closeDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => openDialog('workExperience')} className="btn-hero">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </DialogTrigger>
              {renderWorkDialog()}
            </Dialog>
          </div>

          {currentUser.experience.workExperience.length === 0 ? (
            <Card className="p-8 text-center">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No work experience added yet. Add your first experience!</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {currentUser.experience.workExperience.map((work) => (
                <Card key={work.id} className="card-elevated p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{work.position}</h4>
                      <p className="text-primary font-medium mb-1">{work.company}</p>
                      <p className="text-sm text-muted-foreground mb-3">{work.duration}</p>
                      <p className="text-muted-foreground">{work.description}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openDialog('workExperience', work)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteItem('workExperience', work.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Certifications</h3>
            <Dialog open={editingItem?.type === 'certifications'} onOpenChange={closeDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => openDialog('certifications')} className="btn-hero">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Certification
                </Button>
              </DialogTrigger>
              {renderCertificationDialog()}
            </Dialog>
          </div>

          {currentUser.experience.certifications.length === 0 ? (
            <Card className="p-8 text-center">
              <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No certifications added yet. Add your first certification!</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {currentUser.experience.certifications.map((cert) => (
                <Card key={cert.id} className="card-elevated p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{cert.name}</h4>
                      <p className="text-primary font-medium mb-1">{cert.issuer}</p>
                      <p className="text-sm text-muted-foreground">{cert.date}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openDialog('certifications', cert)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteItem('certifications', cert.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}