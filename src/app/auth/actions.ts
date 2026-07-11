'use server';

import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import prisma from '@/lib/db';
import { loginSchema, signUpSchema } from '@/lib/validation/auth';
import { z } from 'zod';

const getAppUrl = () => {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

// Sign Up with Email/Password
export async function signUpAction(formData: z.infer<typeof signUpSchema>) {
  const result = signUpSchema.safeParse(formData);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { email, password, fullName } = result.data;
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${getAppUrl()}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  const user = data.user;
  if (user) {
    try {
      // 1. Ensure User model is present
      await prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          email: email,
          role: 'USER',
          status: 'ACTIVE',
        },
      });

      // 2. Direct base profile creation in database (in case verification is bypassed or disabled)
      await prisma.profile.upsert({
        where: { id: user.id },
        update: {
          fullName,
        },
        create: {
          id: user.id,
          fullName: fullName,
          isVerified: false,
        },
      });
    } catch (dbError) {
      console.error('Signup database sync error:', dbError);
      // Suppress database sync error so the user still sees verification email instructions
    }
  }

  return { success: true, message: 'Please check your email to verify your account.' };
}

// Sign In with Email/Password
export async function signInAction(formData: z.infer<typeof loginSchema>) {
  const result = loginSchema.safeParse(formData);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { email, password } = result.data;
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const user = data.user;
  if (user) {
    try {
      // 1. Ensure User model is present
      await prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          email: user.email!,
          role: 'USER',
          status: 'ACTIVE',
        },
      });

      // 2. Lazy profile creation on login if it was missed during signup
      await prisma.profile.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          fullName: user.user_metadata?.full_name || null,
          isVerified: false,
        },
      });
    } catch (dbError) {
      console.error('Login database sync error:', dbError);
    }
  }

  return { success: true };
}

// Start Google Sign In Flow
export async function signInWithGoogleAction() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${getAppUrl()}/auth/callback?next=/profile`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data?.url) {
    redirect(data.url);
  }

  return { error: 'Failed to initiate Google sign in.' };
}

// Sign Out
export async function signOutAction() {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/auth/login');
}

// Request Password Reset Link
export async function forgotPasswordAction(email: string) {
  if (!email || !z.string().email().safeParse(email).success) {
    return { error: 'Please enter a valid email address.' };
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getAppUrl()}/auth/callback?next=/auth/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: 'Password reset link sent to your email.' };
}

// Reset Password (must be logged in via reset link)
export async function resetPasswordAction(password: string) {
  if (!password || password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
