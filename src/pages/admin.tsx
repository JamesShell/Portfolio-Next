import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slideIn, textVariant, fadeIn } from "@/utils/motion";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Calendar, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle, 
  Clock,
  Mail,
  User,
  Phone,
  MessageCircle,
  Filter,
  Trash2,
  ExternalLink,
  LogOut,
  Shield,
  RefreshCcw,
  TrendingUp
} from 'lucide-react';
import { nyght } from '@/assets/font';
import { Message, Booking, Submission } from '@/types/admin';
import { useRouter } from 'next/router';
import Head from 'next/head';
import MessageCard from '@/components/admin/MessageCard';
import BookingCard from '@/components/admin/BookingCard';
import { withAdminAuth } from '@/hooks/useAuth';
import { Spotlight } from "@/components/ui/spotlight-new";
import { SegmentedControl } from "@/components/ui/segmented-control";

const AdminDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'messages' | 'bookings'>('all');
  const [filter, setFilter] = useState<'all' | 'unread' | 'pending'>('all');
  const router = useRouter();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/submissions', {
        credentials: 'include',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });
      
      if (response.status === 401) {
        // Token expired or invalid, redirect to login
        router.push('/admin/login');
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSubmission = async (id: string, updates: Partial<Submission>) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/submissions?id=${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(updates),
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (response.ok) {
        setSubmissions(submissions.map(sub => 
          sub.id === id ? { ...sub, ...updates } : sub
        ));
      }
    } catch (error) {
      console.error('Error updating submission:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('admin_token');
      router.push('/admin/login');
    }
  };

  const markAsRead = (id: string) => {
    updateSubmission(id, { read: true } as Partial<Message>);
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    updateSubmission(id, { status } as Partial<Booking>);
  };

  const filteredSubmissions = submissions.filter(submission => {
    if (activeTab === 'messages' && submission.type !== 'message') return false;
    if (activeTab === 'bookings' && submission.type !== 'booking') return false;
    
    if (filter === 'unread' && submission.type === 'message' && (submission as Message).read) return false;
    if (filter === 'pending' && submission.type === 'booking' && (submission as Booking).status !== 'pending') return false;
    
    return true;
  });

  const getStatusBadge = (submission: Submission) => {
    if (submission.type === 'message') {
      const message = submission as Message;
      return (
        <Badge variant={message.read ? 'secondary' : 'default'}>
          {message.read ? (
            <>
              <Eye className="w-3 h-3 mr-1" />
              Read
            </>
          ) : (
            <>
              <EyeOff className="w-3 h-3 mr-1" />
              Unread
            </>
          )}
        </Badge>
      );
    } else {
      const booking = submission as Booking;
      const statusConfig = {
        pending: { variant: 'default' as const, icon: Clock, color: 'text-yellow-600' },
        confirmed: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
        cancelled: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
        completed: { variant: 'secondary' as const, icon: CheckCircle, color: 'text-blue-600' },
      };
      
      const config = statusConfig[booking.status];
      const Icon = config.icon;
      
      return (
        <Badge variant={config.variant}>
          <Icon className={`w-3 h-3 mr-1 ${config.color}`} />
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </Badge>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading submissions...</p>
        </div>
      </div>
    );
  }

  const tabOptions = [
    { value: "all", label: `All (${submissions.length})`, icon: <TrendingUp className="w-4 h-4" /> },
    { value: "messages", label: `Messages (${submissions.filter(s => s.type === 'message').length})`, icon: <MessageSquare className="w-4 h-4" /> },
    { value: "bookings", label: `Bookings (${submissions.filter(s => s.type === 'booking').length})`, icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <>
      <Head>
        <title>Admin Dashboard - Portfolio</title>
        <meta name="description" content="Admin dashboard for managing messages and bookings" />
      </Head>
      
      <div className="relative z-0 min-h-screen bg-background">
        <Spotlight className="sticky" />
        
        <div className="mx-4 sm:container sm:mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <motion.div 
            initial="hidden"
            animate="show"
            variants={textVariant({ delay: 0 })}
            className="text-center mb-16 pt-12"
          >
            <motion.div 
              className="inline-block mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Badge className="flex items-center gap-2" size={'xl'}>
                <Shield className="w-4 h-4 text-foreground/80" />
                <span className="text-muted-foreground text-base uppercase">Admin Panel</span>
              </Badge>
            </motion.div>
            
            <h1 className={`text-4xl lg:text-5xl xl:text-6xl font-semibold mb-6 ${nyght.className}`}>
              Admin <span className={`bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent ${nyght.className} font-medium italic`}>Dashboard</span>
            </h1>
            
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed mb-8">
              Manage your portfolio messages and call bookings with real-time insights.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={fetchSubmissions}
                  disabled={loading}
                  className="group relative bg-primary/20 backdrop-blur-md border border-primary/30 rounded-xl text-primary font-medium hover:bg-primary/30 hover:border-primary/50 transition-all duration-300"
                >
                  <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Loading...' : 'Refresh Data'}
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="backdrop-blur-md bg-background/50 border border-border/50 hover:bg-background/70"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Back to Site
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="text-destructive hover:text-destructive backdrop-blur-md bg-background/50 border border-border/50 hover:bg-background/70"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {[
              {
                icon: MessageSquare,
                label: "Total Messages",
                value: submissions.filter(s => s.type === 'message').length,
                color: "blue",
                bgColor: "bg-blue-500/10",
                iconColor: "text-blue-600",
                borderColor: "border-blue-500/20"
              },
              {
                icon: Calendar,
                label: "Total Bookings", 
                value: submissions.filter(s => s.type === 'booking').length,
                color: "green",
                bgColor: "bg-green-500/10",
                iconColor: "text-green-600",
                borderColor: "border-green-500/20"
              },
              {
                icon: EyeOff,
                label: "Unread Messages",
                value: submissions.filter(s => s.type === 'message' && !(s as Message).read).length,
                color: "yellow",
                bgColor: "bg-yellow-500/10",
                iconColor: "text-yellow-600",
                borderColor: "border-yellow-500/20"
              },
              {
                icon: Clock,
                label: "Pending Bookings",
                value: submissions.filter(s => s.type === 'booking' && (s as Booking).status === 'pending').length,
                color: "orange",
                bgColor: "bg-orange-500/10",
                iconColor: "text-orange-600",
                borderColor: "border-orange-500/20"
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
                whileHover={{ y: -4 }}
              >
                <div className="relative bg-background/50 backdrop-blur-md border border-border/30 rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3 rounded-3xl"></div>
                  <div className="relative flex items-center gap-4">
                    <div className={`p-3 ${stat.bgColor} border ${stat.borderColor} rounded-2xl`}>
                      <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground/70 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Tab Selector */}
          <motion.div 
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SegmentedControl
              options={tabOptions}
              value={activeTab}
              onChange={(value) => {
                setActiveTab(value as "all" | "messages" | "bookings");
              }}
              size="lg"
            />
          </motion.div>

          {/* Filter Controls */}
          <motion.div 
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative bg-background/50 backdrop-blur-md border border-border/30 rounded-2xl shadow-lg p-4">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3 rounded-2xl"></div>
              <div className="relative flex items-center gap-3">
                <Filter className="w-4 h-4 text-foreground/60" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="bg-background/30 backdrop-blur-sm border border-border/50 rounded-xl py-2 px-4 text-foreground placeholder:text-foreground/50 focus:bg-background/50 focus:border-border transition-all duration-300"
                >
                  <option value="all">All Items</option>
                  <option value="unread">Unread Only</option>
                  <option value="pending">Pending Only</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <SubmissionsList 
              submissions={filteredSubmissions}
              onMarkAsRead={markAsRead}
              onUpdateBookingStatus={updateBookingStatus}
              getStatusBadge={getStatusBadge}
            />
          </motion.div>
        </div>
      </div>
    </>
  );
};

// Submissions List Component
const SubmissionsList: React.FC<{
  submissions: Submission[];
  onMarkAsRead: (id: string) => void;
  onUpdateBookingStatus: (id: string, status: Booking['status']) => void;
  getStatusBadge: (submission: Submission) => React.ReactNode;
}> = ({ submissions, onMarkAsRead, onUpdateBookingStatus, getStatusBadge }) => {
  if (submissions.length === 0) {
    return (
      <motion.div 
        className="relative bg-background/50 backdrop-blur-md border border-border/30 rounded-3xl shadow-lg p-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3 rounded-3xl"></div>
        <div className="relative text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <MessageCircle className="w-8 h-8 text-primary/60" />
          </motion.div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No submissions yet</h3>
          <p className="text-foreground/60">When visitors contact you or book calls, they'll appear here.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {submissions.map((submission, index) => (
          <motion.div
            key={submission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -2 }}
            className="relative"
          >
            <div className="relative bg-background/50 backdrop-blur-md border border-border/30 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3 rounded-3xl"></div>
              <div className="relative p-6 sm:p-8">
                {submission.type === 'message' ? (
                  <MessageCard 
                    message={submission as Message}
                    onMarkAsRead={onMarkAsRead}
                    statusBadge={getStatusBadge(submission)}
                  />
                ) : (
                  <BookingCard 
                    booking={submission as Booking}
                    onUpdateStatus={onUpdateBookingStatus}
                    statusBadge={getStatusBadge(submission)}
                  />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default withAdminAuth(AdminDashboard);