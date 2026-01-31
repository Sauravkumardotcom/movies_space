import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export default function ProtectedAdminRoute({ children }) {
  const isAdminLoggedIn = useAppStore((state) => state.isAdminLoggedIn);

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
