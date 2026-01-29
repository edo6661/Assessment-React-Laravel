import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import apiClient from '../lib/axios';
import type { AuthResponse } from '../types';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LogIn, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [errorApi, setErrorApi] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = 'Login';
  }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setErrorApi(null);
    try {
      const res = await apiClient.post<AuthResponse>('/api/login', data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data));
      navigate('/');
    } catch (err: any) {
      setErrorApi(err.response?.data?.message || 'Login failed, please check your credentials.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 font-sans text-gray-900">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-gray-900/5 transition-all sm:p-10">

        <div className="text-center mb-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
            <LogIn className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Welcome Back</h1>
          <p className="mt-3 text-sm font-medium text-gray-500">
            Sign in to continue managing your tasks
          </p>
        </div>

        {errorApi && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-600 ring-1 ring-red-100 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{errorApi}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900 ml-1">Email Address</label>
            <input
              type="email"
              {...register('email')}
              placeholder="name@company.com"
              className="block w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
            />
            {errors.email && <p className="ml-1 text-xs font-semibold text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register('password')}
                placeholder="••••••••"
                className="block w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="ml-1 text-xs font-semibold text-red-500">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full overflow-hidden rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary-hover hover:shadow-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] mt-2"
          >
            <span className="relative flex items-center justify-center gap-2">
              {isSubmitting ? 'Signing in...' : 'Sign In'}
              {!isSubmitting && <CheckCircle2 className="h-4 w-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />}
            </span>
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-gray-500">
          New to the platform?{' '}
          <Link to="/register" className="font-bold text-primary hover:text-primary-hover hover:underline decoration-2 underline-offset-4 transition-all">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}