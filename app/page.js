'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import TodoCard from '../src/components/todo/TodoCard';
import ProtectedRoute from '../src/components/auth/ProtectedRoute';
import { getCurrentUser } from '../src/store/auth/AuthSlice';
import { fetchThoughts } from '../src/store/todo/TodoSlice';
import '../src/components/auth/Auth.css';
import '../src/app.css';

export default function HomePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchThoughts());
    }
  }, [dispatch, isAuthenticated]);

  // Show authenticated app
  if (isAuthenticated) {
    return (
      <div className="gradient-background">
        <ProtectedRoute>
          <TodoCard />
        </ProtectedRoute>
      </div>
    );
  }

  // Show public landing page
  return (
    <div className="gradient-background">
      <div className="auth-container" style={{ padding: '2rem', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="auth-card" style={{ width: '100%', maxWidth: '900px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#ffffff' }}>Thoughts</h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#ffffff', opacity: 0.9 }}>
            Your Personal Thoughts & Memories Organizer
          </p>
          
          <div style={{ marginBottom: '3rem', textAlign: 'left', color: '#ffffff', lineHeight: '1.8' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>About Thoughts</h2>
            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              <strong>Thoughts</strong> is a minimalist web app that helps you capture, organize, and manage your daily thoughts and to-dos in one simple, distraction-free place.
            </p>
            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              Whether you want to jot down quick notes, save important memories, or keep track of your tasks, Thoughts provides a clean and intuitive interface that lets you focus on what matters most.
            </p>
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Key Features:</h3>
              <ul style={{ paddingLeft: '1.5rem', fontSize: '1.1rem' }}>
                <li style={{ marginBottom: '0.75rem' }}>Capture your thoughts and ideas instantly</li>
                <li style={{ marginBottom: '0.75rem' }}>Organize your memories and notes</li>
                <li style={{ marginBottom: '0.75rem' }}>Manage your daily to-dos</li>
                <li style={{ marginBottom: '0.75rem' }}>Simple, distraction-free interface</li>
                <li style={{ marginBottom: '0.75rem' }}>Secure and private</li>
              </ul>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <Link 
              href="/login" 
              style={{ 
                color: '#ffffff', 
                textDecoration: 'none', 
                padding: '0.75rem 2rem', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                borderRadius: '5px', 
                fontWeight: '600',
                fontSize: '1.1rem',
                display: 'inline-block',
                transition: 'opacity 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              Login
            </Link>
            <Link 
              href="/register" 
              style={{ 
                color: '#ffffff', 
                textDecoration: 'none', 
                padding: '0.75rem 2rem', 
                background: 'rgba(255, 255, 255, 0.2)', 
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '5px', 
                fontWeight: '600',
                fontSize: '1.1rem',
                display: 'inline-block',
                transition: 'opacity 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              Sign Up
            </Link>
          </div>

          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.3)' }}>
            <p style={{ color: '#ffffff', opacity: 0.8, fontSize: '0.9rem' }}>
              <Link href="/privacy" style={{ color: '#ffffff', textDecoration: 'underline', marginRight: '1rem' }}>Privacy Policy</Link>
              <Link href="/terms" style={{ color: '#ffffff', textDecoration: 'underline' }}>Terms of Service</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
