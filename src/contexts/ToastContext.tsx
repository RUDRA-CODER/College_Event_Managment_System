"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback((msg: string) => addToast(msg, 'success'), [addToast]);
  const showError = useCallback((msg: string) => addToast(msg, 'error'), [addToast]);
  const showWarning = useCallback((msg: string) => addToast(msg, 'warning'), [addToast]);
  const showInfo = useCallback((msg: string) => addToast(msg, 'info'), [addToast]);

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
      {children}
      <div className="fixed top-4 right-4 left-4 sm:left-auto z-[100] flex flex-col gap-2 pointer-events-none max-w-sm sm:w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border animate-in slide-in-from-right fade-in duration-300 ${
              toast.type === 'success' ? 'bg-white border-green-200 text-gray-800' :
              toast.type === 'error' ? 'bg-white border-red-200 text-gray-800' :
              toast.type === 'warning' ? 'bg-white border-amber-200 text-gray-800' :
              'bg-white border-blue-200 text-gray-800'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
              {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
              {toast.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
              {toast.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
            </div>
            <div className="flex-1 font-medium text-sm pt-0.5">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center rounded-lg hover:bg-gray-100"
              aria-label="Close notification"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
