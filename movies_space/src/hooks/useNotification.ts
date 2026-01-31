import { useState, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

/**
 * Hook for managing notifications/toasts
 */
export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  /**
   * Add a notification
   */
  const addNotification = useCallback(
    (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration = 5000) => {
      const id = `notification-${Date.now()}-${Math.random()}`;

      const notification: Notification = {
        id,
        type,
        message,
        duration,
      };

      setNotifications(prev => [...prev, notification]);

      // Auto-remove after duration
      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }

      return id;
    },
    []
  );

  /**
   * Remove a notification
   */
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  /**
   * Show success notification
   */
  const success = useCallback(
    (message: string, duration?: number) => {
      return addNotification(message, 'success', duration);
    },
    [addNotification]
  );

  /**
   * Show error notification
   */
  const error = useCallback(
    (message: string, duration?: number) => {
      return addNotification(message, 'error', duration);
    },
    [addNotification]
  );

  /**
   * Show warning notification
   */
  const warning = useCallback(
    (message: string, duration?: number) => {
      return addNotification(message, 'warning', duration);
    },
    [addNotification]
  );

  /**
   * Show info notification
   */
  const info = useCallback(
    (message: string, duration?: number) => {
      return addNotification(message, 'info', duration);
    },
    [addNotification]
  );

  /**
   * Clear all notifications
   */
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
    clearAll,
  };
};
