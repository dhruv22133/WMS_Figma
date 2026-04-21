import { useState } from 'react';
import { Warehouse, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { getSupabaseClient } from '../utils/supabase/client';
// FIX: Changed './assets/...' to '../assets/...' to properly route out of the components folder
import logo from '../assets/idTech_logo.png';

interface LoginProps {
  onLoginSuccess: (accessToken: string, userEmail: string, userName: string) => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          setIsLoading(false);
          return;
        }

        // Validate password length
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }

        // Sign up
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-36ac7b49/signup`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
              name: formData.name || formData.email.split('@')[0],
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Signup failed');
        }

        toast.success(data.message || 'Account created successfully! Waiting for admin approval.');
        setIsSignUp(false);
        setFormData({ email: formData.email, password: '', name: '', confirmPassword: '' });
      } else {
        // Sign in using Supabase client
        const supabase = getSupabaseClient();

        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          console.error('Sign in error:', error);
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Invalid email or password. Please check your credentials or sign up for a new account.');
          }
          throw new Error(error.message || 'Sign in failed');
        }

        if (!data.session?.access_token || !data.user?.id) {
          throw new Error('No access token received');
        }

        // Check approval status
        const approvalResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-36ac7b49/check-approval`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({
              user_id: data.user.id,
            }),
          }
        );

        const approvalData = await approvalResponse.json();

        // If approval record doesn't exist (404), treat as approved (backward compatibility for existing users)
        if (approvalResponse.status === 404 || approvalData.status === 'unknown') {
          // User exists but no approval record - likely created before approval system
          // Allow them to login
          const userName = data.user?.user_metadata?.name || formData.email.split('@')[0];
          toast.success('Welcome back!');
          onLoginSuccess(data.session.access_token, formData.email, userName);
          return;
        }

        if (approvalData.status === 'pending') {
          // Sign out the user since they're not approved yet
          await supabase.auth.signOut();
          throw new Error('Your account is pending approval by an administrator. Please wait for approval before signing in.');
        }

        if (approvalData.status === 'rejected') {
          // Sign out the user since they're rejected
          await supabase.auth.signOut();
          throw new Error('Your account has been rejected. Please contact an administrator.');
        }

        const userName = data.user?.user_metadata?.name || formData.email.split('@')[0];
        
        toast.success('Welcome back!');
        onLoginSuccess(data.session.access_token, formData.email, userName);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.1),transparent)]" />
      
      <Card className="w-full max-w-md relative z-10 border-slate-700 bg-slate-800/50 backdrop-blur">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="h-16 bg-white rounded-lg px-4 flex items-center justify-center shadow-lg">
              <img src={logo} alt="ID TECH" className="h-12 object-contain" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <Warehouse className="w-6 h-6 text-blue-400" />
              WMS Pro
            </CardTitle>
            <CardDescription className="text-slate-300">
              {isSignUp ? 'Create your warehouse account' : 'Sign in to your warehouse account'}
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-200">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder={isSignUp ? "At least 6 characters" : "Enter your password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-200">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                </>
              ) : (
                <>
                  {isSignUp ? (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create Account
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </>
                  )}
                </>
              )}
            </Button>

            <div className="text-center text-sm text-slate-300">
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </CardFooter>
        </form>
      </Card>

      {/* Footer info */}
      <div className="absolute bottom-4 text-center text-sm text-slate-400">
        <p>BLE Warehouse Management System v2.0.1</p>
      </div>
    </div>
  );
}