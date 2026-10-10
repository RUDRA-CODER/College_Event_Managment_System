"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolve, setResolve] = useState<(value: boolean) => void>();

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    setIsOpen(true);
    return new Promise<boolean>((res) => {
      setResolve(() => res);
    });
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolve) resolve(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolve) resolve(false);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {isOpen && options && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${options.isDestructive !== false ? 'bg-red-100' : 'bg-amber-100'}`}>
                <AlertTriangle className={`h-6 w-6 ${options.isDestructive !== false ? 'text-red-600' : 'text-amber-600'}`} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{options.title}</h2>
              <p className="text-gray-500 mb-6">{options.message}</p>
              
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  className="w-full sm:w-auto"
                >
                  {options.cancelText || 'Cancel'}
                </Button>
                <Button 
                  type="button" 
                  onClick={handleConfirm}
                  className={`w-full sm:w-auto text-white border-transparent ${options.isDestructive !== false ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-600 hover:bg-primary-700'}`}
                >
                  {options.confirmText || 'Confirm'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};
