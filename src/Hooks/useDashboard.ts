/**
 * @description 
 * Custom hook for managing dashboard data.
 * 
 * @dependencies
 * - @supabase/supabase-js: Database operations
 * 
 * @notes
 * - Fetches children, consultations, and blog posts
 * - Provides loading state and refresh functionality
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface Child {
  id: string;
  name: string;
  photo_url?: string;
  birth_date: string;
}

export interface Consultation {
  id: string;
  child_id: string;
  doctor_id: string;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  doctor: {
    name: string;
    photo_url?: string;
    specialty: string;
  };
  child: {
    name: string;
    photo_url?: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  thumbnail_url: string | null;
  published_at: string;
  read_time: number;
  author: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
}

export const useDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [children, setChildren] = useState<Child[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Fetch children
      const { data: childrenData, error: childrenError } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', user.id)
        .order('created_at', { ascending: false });

      if (childrenError) throw childrenError;
      setChildren(childrenData || []);

      // Fetch recent consultations
      const { data: consultationsData, error: consultationsError } = await supabase
        .from('consultations')
        .select(`
          *,
          doctor:doctors(name, photo_url, specialty),
          child:children(name, photo_url)
        `)
        .eq('parent_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (consultationsError) throw consultationsError;
      setConsultations(consultationsData || []);

      // Fetch blog posts
      const { data: blogData, error: blogError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);

      if (blogError) throw blogError;
      setBlogPosts(blogData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    isLoading,
    children,
    consultations,
    blogPosts,
    refreshDashboard: fetchDashboardData,
  };
}; 