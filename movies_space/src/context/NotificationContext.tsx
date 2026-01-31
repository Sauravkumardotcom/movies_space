import React, { createContext, useContext } from 'react';
import { useNotification, Notification } from '../hooks/useNotification';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type?: 'success' | 'error' | 'warning' | 'info', duration?: number) => string;
  removeNotification: (id: string) => void;
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  warning: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notifications = useNotification();

  return (
    <NotificationContext.Provider value={notifications}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Hook to use NotificationContext
 */
export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
};

export default NotificationContext;
