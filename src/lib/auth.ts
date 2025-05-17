
import React from "react"; // Add explicit React import
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/supabase";
import { create } from "zustand";

type AuthState = {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
};

// Helper function to clean up auth state
const cleanupAuthState = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
};

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,
  
  signIn: async (email, password) => {
    // Clean up existing auth state first
    cleanupAuthState();
    
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      // Continue even if this fails
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (!error && data?.user) {
      set({ user: data.user });
      await get().fetchProfile();
    }
    
    return { error };
  },
  
  signUp: async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });
    
    if (!error && data?.user) {
      set({ user: data.user });
      await get().fetchProfile();
    }
    
    return { error };
  },
  
  signOut: async () => {
    // Clean up auth state
    cleanupAuthState();
    
    // Attempt global sign out
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      // Ignore errors
    }
    
    set({ user: null, profile: null });
  },
  
  fetchProfile: async () => {
    const { user } = get();
    
    if (!user) return;
    
    set({ loading: true });
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (data && !error) {
      set({ profile: data as UserProfile });
    }
    
    set({ loading: false });
  },
}));

// Initialize auth state by checking current session
export const initAuth = async () => {
  const { data } = await supabase.auth.getSession();
  
  if (data.session?.user) {
    useAuth.setState({ user: data.session.user });
    // Use setTimeout to avoid potential deadlocks
    setTimeout(async () => {
      await useAuth.getState().fetchProfile();
    }, 0);
  }
  
  useAuth.setState({ loading: false, initialized: true });
  
  // Set up auth state listener
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      useAuth.setState({ user: session.user });
      // Use setTimeout to avoid potential deadlocks
      setTimeout(async () => {
        await useAuth.getState().fetchProfile();
      }, 0);
    } else if (event === 'SIGNED_OUT') {
      useAuth.setState({ user: null, profile: null });
    }
  });
};
