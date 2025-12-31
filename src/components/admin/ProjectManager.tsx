import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, ExternalLink, Video, Image as ImageIcon, Code, X, Save, AlertCircle } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string, array } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { storage, auth } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signInWithCustomToken } from 'firebase/auth';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

const projectSchema = object({
  name: string().min(1, "Name is required"),
  short_description: string().min(1, "Short description is required"),
  description: string().min(1, "Description is required"),
  type: string().min(1, "Type is required"),
  image: string().optional(),
  video: string().optional(), // Removed .url() to allow empty strings or non-url paths if needed, though url is better
  link: string().url("Must be a valid URL"),
  source_code_link: string().optional(),
  tags: array(object({
    name: string(),
    color: string()
  })),
});

interface ProjectManagerProps {
  // onUpdate: () => void; // Callback to refresh parent if needed, though we manage local state mostly
}

export default function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      short_description: "",
      description: "",
      type: "web",
      image: "",
      video: "",
      link: "",
      source_code_link: "",
      tags: [{ name: "Next.js", color: "#000000" }]
    }
  });

  const { fields,append, remove } = useFieldArray({
    control: form.control,
    name: "tags"
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/projects', {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) }
      });
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: 'DELETE',
        headers: { ...(token && { Authorization: `Bearer ${token}` }) }
      });
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };

  const handleEdit = (project: Project) => {
    setCurrentProject(project);
    setIsEditing(true);
    form.reset({
      name: project.name,
      short_description: project.short_description,
      description: project.description,
      type: project.type,
      image: project.image,
      video: project.video || "",
      link: project.link,
      source_code_link: project.source_code_link || "",
      tags: project.tags.length > 0 ? project.tags : [{ name: "", color: "#000000" }]
    });
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setCurrentProject(null);
    setIsEditing(false);
    form.reset({
        name: "",
        short_description: "",
        description: "",
        type: "web",
        image: "",
        video: "",
        link: "",
        source_code_link: "",
        tags: [{ name: "Next.js", color: "#000000" }]
    });
    setIsFormOpen(true);
  };



  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: "image" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fieldName === "image" && !file.type.startsWith("image/")) {
       alert("Please upload an image file");
       return;
    }
    if (fieldName === "video" && !file.type.startsWith("video/")) {
       alert("Please upload a video file");
       return;
    }

    setUploading(true);
    try {
      // 1. Ensure we are authenticated with Firebase
      if (!auth.currentUser) {
        const token = localStorage.getItem('admin_token');
        const res = await fetch('/api/admin/auth/firebase-token', {
          method: 'POST',
          headers: { ...(token && { Authorization: `Bearer ${token}` }) }
        });
        const data = await res.json();
        
        if (data.success && data.token) {
          await signInWithCustomToken(auth, data.token);
        } else {
          throw new Error("Failed to authenticate for upload");
        }
      }

      // 2. Perform Upload
      const storageRef = ref(storage, `projects/${fieldName}s/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      form.setValue(fieldName, downloadURL, { shouldDirty: true, shouldValidate: true });
      toast.success("File uploaded successfully");
    } catch (error: any) {
      console.error("Upload failed", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing 
        ? `/api/admin/projects?id=${currentProject?.id}` 
        : '/api/admin/projects';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }) 
        },
        body: JSON.stringify(values)
      });
      
      const data = await res.json();
      
      if (data.success) {
        setIsFormOpen(false);
        fetchProjects(); // Refresh list to get new ID/Updates
      }
    } catch (error) {
      console.error("Failed to save project", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button onClick={handleAddNew} className="bg-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div 
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-background/50 backdrop-blur-md border border-border/30 rounded-3xl shadow-lg overflow-hidden flex flex-col"
          >
             <div className="relative h-48 w-full overflow-hidden">
                {project.video ? (
                    <div className="relative w-full h-full bg-black">
                        <div className="absolute top-2 right-2 z-10">
                            <Badge variant="secondary"><Video className="w-3 h-3 mr-1" /> Video</Badge>
                        </div>
                         {/* Fallback image if video fails or just display image if present? User said "video INSTEAD of image" but structure has both mostly. I'll show video mostly */}
                         {/* Just showing a placeholder overlay for video in admin */}
                        <video src={project.video} className="w-full h-full object-cover opacity-80" muted /> 
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Video className="w-12 h-12 text-white/50" />
                        </div>
                    </div>
                ) : (
                    <img src={project.image} alt={project.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1">{project.name}</h3>
                  <Badge variant="outline" className="text-white border-white/30 bg-white/10 uppercase text-xs">{project.type}</Badge>
                </div>
             </div>

             <div className="p-6 flex-1 flex flex-col">
                <p className="text-sm text-foreground/70 mb-4 line-clamp-2">{project.short_description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded bg-secondary/50 text-secondary-foreground">{tag.name}</span>
                    ))}
                    {project.tags.length > 3 && <span className="text-xs px-2 py-1 text-muted-foreground">+{project.tags.length - 3}</span>}
                </div>

                <div className="mt-auto flex gap-3">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(project)}>
                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
             </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="relative w-full max-w-3xl bg-background rounded-2xl shadow-2xl border border-border my-8"
             >
                <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-background z-10 rounded-t-2xl">
                    <h3 className="text-2xl font-bold">{isEditing ? 'Edit Project' : 'New Project'}</h3>
                    <Button variant="ghost" size="icon" onClick={() => setIsFormOpen(false)}><X className="w-5 h-5" /></Button>
                </div>
                
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="name" render={({field}) => (
                                    <FormItem><FormLabel>Name</FormLabel><FormControl><input {...field} className="w-full p-2 rounded-md border bg-transparent" /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="type" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <FormControl>
                                            <select {...field} className="w-full p-2 rounded-md border bg-transparent text-foreground">
                                                <option value="web">Web App</option>
                                                <option value="mobile">Mobile App</option>
                                                <option value="design">Design</option>
                                                <option value="case_study">Case Study</option>
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={form.control} name="short_description" render={({field}) => (
                                <FormItem><FormLabel>Short Description</FormLabel><FormControl><input {...field} className="w-full p-2 rounded-md border bg-transparent" /></FormControl><FormMessage /></FormItem>
                            )} />

                            <FormField control={form.control} name="description" render={({field}) => (
                                <FormItem><FormLabel>Full Description</FormLabel><FormControl><textarea {...field} rows={4} className="w-full p-2 rounded-md border bg-transparent" /></FormControl><FormMessage /></FormItem>
                            )} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="image" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Image URL (Optional)</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-2 items-center">
                                                <input {...field} placeholder="https://..." className="flex-1 p-2 rounded-md border bg-transparent" />
                                                <div className="relative w-10 h-10 flex items-center justify-center">
                                                     <input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                                                        onChange={(e) => handleFileUpload(e, "image")}
                                                        disabled={uploading}
                                                     />
                                                     <Button type="button" variant="outline" size="icon" className="w-10 h-10 pointer-events-none" disabled={uploading}>
                                                        {uploading ? "..." : <Upload className="w-4 h-4" />}
                                                     </Button>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="video" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Video URL (Optional)</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-2 items-center">
                                                <input {...field} placeholder="https://..." className="flex-1 p-2 rounded-md border bg-transparent" />
                                                <div className="relative w-10 h-10 flex items-center justify-center">
                                                     <input 
                                                        type="file" 
                                                        accept="video/*" 
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                                                        onChange={(e) => handleFileUpload(e, "video")}
                                                        disabled={uploading}
                                                     />
                                                     <Button type="button" variant="outline" size="icon" className="w-10 h-10 pointer-events-none" disabled={uploading}>
                                                        {uploading ? "..." : <Upload className="w-4 h-4" />}
                                                     </Button>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="link" render={({field}) => (
                                    <FormItem><FormLabel>Live Link</FormLabel><FormControl><input {...field} placeholder="https://..." className="w-full p-2 rounded-md border bg-transparent" /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="source_code_link" render={({field}) => (
                                    <FormItem><FormLabel>Source Code Link</FormLabel><FormControl><input {...field} placeholder="https://..." className="w-full p-2 rounded-md border bg-transparent" /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>

                            <div>
                                <FormLabel>Tags</FormLabel>
                                <div className="space-y-2 mt-2">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="flex gap-2">
                                            <input {...form.register(`tags.${index}.name`)} placeholder="Tag Name" className="flex-1 p-2 rounded-md border bg-transparent" />
                                            <input {...form.register(`tags.${index}.color`)} type="color" className="w-12 p-1 h-10 rounded-md border bg-transparent cursor-pointer" />
                                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", color: "#000000" })}>
                                        <Plus className="w-4 h-4 mr-2" /> Add Tag
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="pt-4 flex justify-end gap-3">
                                <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Project'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
