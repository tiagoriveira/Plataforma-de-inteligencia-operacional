import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLocked: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  signUp: (email: string, password: string, pin: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      // Se tem sessão ao carregar, bloqueia (pede PIN)
      // Se não tem sessão, não bloqueia (vai pro login)
      setIsLocked(!!session?.user);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (_event === 'SIGNED_IN') {
        // Login novo via email/senha -> desbloqueado
        setIsLocked(false);
      } else if (_event === 'SIGNED_OUT') {
        setIsLocked(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const verifyPin = async (pin: string) => {
    const { data, error } = await supabase.rpc('verify_my_pin', { pin_input: pin });

    if (error) throw error;

    if (data === true) {
      setIsLocked(false);
      return true;
    } else {
      throw new Error("PIN incorreto");
    }
  };

  const signUp = async (email: string, password: string, pin: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          pin: pin
        }
      }
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, isLocked, signIn, verifyPin, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
