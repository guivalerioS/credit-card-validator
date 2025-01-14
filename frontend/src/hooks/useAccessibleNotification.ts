import React, { useCallback } from 'react';

interface NotificationOptions {
  'aria-live'?: 'polite' | 'assertive';
  role?: 'alert' | 'status';
}

type NotifyFunction = (message: string, options?: NotificationOptions) => React.ReactElement | null;

export const useAccessibleNotification = (): NotifyFunction => {
  return useCallback((message: string, options: NotificationOptions = {}) => {
    if (!message) return null;

    const {
      'aria-live': ariaLive = 'polite',
      role = 'status'
    } = options;

    return React.createElement(
      'div',
      {
        className: 'sr-only',
        role: role,
        'aria-live': ariaLive
      },
      message
    );
  }, []);
};

export default useAccessibleNotification;