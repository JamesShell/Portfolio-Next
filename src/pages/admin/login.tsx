import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { nyght } from '@/assets/font';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { BlinkingSmiley } from '@/components/ui/global-loader';

interface LoginState {
  email: string;
  password: string;
  showPassword: boolean;
  loading: boolean;
  error: string;
  attemptsLeft?: number;
  lockoutTime?: number;
}

const AdminLogin: React.FC = () => {
  const router = useRouter();
  const [state, setState] = useState<LoginState>({
    email: '',
    password: '',
    showPassword: false,
    loading: false,
    error: '',
  });

  useEffect(() => {
    // Check if already logged in
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/admin/auth/verify');
      if (response.ok) {
        router.push('/admin');
      }
    } catch (error) {
      console.log('Not authenticated');
    }
  };

  const handleInputChange = (field: keyof LoginState, value: string | boolean) => {
    setState(prev => ({ ...prev, [field]: value, error: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.email || !state.password) {
      setState(prev => ({ ...prev, error: 'Please fill in all fields' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: '' }));

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: state.email,
          password: state.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token in localStorage as backup
        if (data.token) {
          localStorage.setItem('admin_token', data.token);
        }
        
        // Redirect to admin dashboard
        router.push('/admin');
      } else {
        setState(prev => ({
          ...prev,
          error: data.message || 'Login failed',
          attemptsLeft: data.attemptsLeft,
          lockoutTime: data.lockoutTime,
          loading: false
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Network error. Please try again.',
        loading: false
      }));
    }
  };

  const getRemainingLockoutTime = () => {
    if (!state.lockoutTime) return '';
    return `${state.lockoutTime} minute${state.lockoutTime !== 1 ? 's' : ''}`;
  };

  return (
    <>
      <Head>
        <title>Admin Login - Portfolio</title>
        <meta name="description" content="Admin panel login" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center bg-primary/10 rounded-full mb-6"
            >
              <BlinkingSmiley />
            </motion.div>
            
            <h1 className={`text-3xl font-bold mb-2 ${nyght.className}`}>
              Admin <span className={`bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent font-medium italic ${nyght.className}`}>Access</span>
            </h1>
            <p className="text-muted-foreground">
              Secure login to portfolio dashboard
            </p>
          </div>

          {/* Login Form */}
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={state.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="admin@ettouzany.com"
                  disabled={state.loading || !!state.lockoutTime}
                  className="h-12"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={state.showPassword ? 'text' : 'password'}
                    value={state.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter your password"
                    disabled={state.loading || !!state.lockoutTime}
                    className="h-12 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleInputChange('showPassword', !state.showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={state.loading}
                  >
                    {state.showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Messages */}
              {state.error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {state.error}
                    </span>
                  </div>
                  
                  {state.attemptsLeft !== undefined && state.attemptsLeft > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {state.attemptsLeft} attempt{state.attemptsLeft !== 1 ? 's' : ''} remaining
                    </p>
                  )}
                  
                  {state.lockoutTime && (
                    <div className="flex items-center gap-2 mt-2 text-yellow-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">
                        Account locked for {getRemainingLockoutTime()}
                      </span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Security Features */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-muted-foreground">Rate Limited</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-muted-foreground">JWT Secured</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12"
                disabled={state.loading || !!state.lockoutTime}
              >
                {state.loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Access Admin Panel
                  </div>
                )}
              </Button>
            </form>
          </Card>

          {/* Back to Site */}
          <div className="text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to Portfolio
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLogin;