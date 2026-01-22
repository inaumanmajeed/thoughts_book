'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import TodoCard from '../src/components/todo/TodoCard';
import ProtectedRoute from '../src/components/auth/ProtectedRoute';
import { getCurrentUser } from '../src/store/auth/AuthSlice';
import { fetchThoughts } from '../src/store/todo/TodoSlice';

export default function HomePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    dispatch(getCurrentUser());
  }, [dispatch, token, router]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchThoughts());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="gradient-background">
      <ProtectedRoute>
        <TodoCard />
      </ProtectedRoute>
    </div>
  );
}
