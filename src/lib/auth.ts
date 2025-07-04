import { supabase } from './supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email?: string;
  role?: string;
  metadata?: Record<string, unknown>;
}

export interface AuthSession {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
  expires_at?: number;
}

class AuthService {
  private currentUser: AuthUser | null = null;
  private currentSession: AuthSession | null = null;
  private authListeners: ((user: AuthUser | null) => void)[] = [];

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        this.setSession(session);
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange((event, session) => {
        console.log('🔐 Auth event:', event);
        
        if (session) {
          this.setSession(session);
        } else {
          this.clearSession();
        }
      });
    } catch (error) {
      console.error('❌ Erro ao inicializar autenticação:', error);
    }
  }

  private setSession(session: Session) {
    this.currentSession = {
      user: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.user_metadata?.role || 'user',
        metadata: session.user.user_metadata
      },
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at
    };
    
    this.currentUser = this.currentSession.user;
    this.notifyListeners(this.currentUser);
  }

  private clearSession() {
    this.currentUser = null;
    this.currentSession = null;
    this.notifyListeners(null);
  }

  private notifyListeners(user: AuthUser | null) {
    this.authListeners.forEach(listener => listener(user));
  }

  // Public methods
  async signInWithEmail(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro no login:', error);
      return { success: false, error };
    }
  }

  async signUpWithEmail(email: string, password: string, metadata?: Record<string, unknown>) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro no cadastro:', error);
      return { success: false, error };
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      this.clearSession();
      return { success: true };
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      return { success: false, error };
    }
  }

  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao resetar senha:', error);
      return { success: false, error };
    }
  }

  // Getters
  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  getCurrentSession(): AuthSession | null {
    return this.currentSession;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  // Utilities
  getAccessToken(): string | null {
    return this.currentSession?.access_token || null;
  }

  isTokenExpired(): boolean {
    if (!this.currentSession?.expires_at) return true;
    return Date.now() >= this.currentSession.expires_at * 1000;
  }

  // Event listeners
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    this.authListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.authListeners.indexOf(callback);
      if (index > -1) {
        this.authListeners.splice(index, 1);
      }
    };
  }

  // Admin utilities
  async createUser(email: string, password: string, role: string = 'user') {
    if (!this.hasRole('admin')) {
      throw new Error('Acesso negado: apenas administradores podem criar usuários');
    }

    return this.signUpWithEmail(email, password, { role });
  }
}

// Export singleton instance
export const authService = new AuthService();

// React hook for easy integration
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(authService.getCurrentUser());

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(setUser);
    return unsubscribe;
  }, []);

  return {
    user,
    isAuthenticated: authService.isAuthenticated(),
    signIn: authService.signInWithEmail.bind(authService),
    signUp: authService.signUpWithEmail.bind(authService),
    signOut: authService.signOut.bind(authService),
    resetPassword: authService.resetPassword.bind(authService),
    hasRole: authService.hasRole.bind(authService)
  };
}

// React imports (need to be added to imports at top)
import { useState, useEffect } from 'react'; 