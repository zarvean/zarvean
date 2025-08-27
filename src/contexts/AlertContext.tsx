import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CustomAlert, DeleteConfirmation } from '@/components/CustomAlert';

interface AlertContextType {
  showAlert: (config: AlertConfig) => void;
  showConfirm: (config: ConfirmConfig) => void;
  showDeleteConfirm: (config: DeleteConfirmConfig) => void;
}

interface AlertConfig {
  title: string;
  description: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  confirmText?: string;
}

interface ConfirmConfig {
  title: string;
  description: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface DeleteConfirmConfig {
  title: string;
  description: string;
  itemName?: string;
  onConfirm: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alertState, setAlertState] = useState<{
    open: boolean;
    config: AlertConfig;
  }>({
    open: false,
    config: { title: '', description: '' }
  });

  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    config: ConfirmConfig;
  }>({
    open: false,
    config: { title: '', description: '', onConfirm: () => {} }
  });

  const [deleteState, setDeleteState] = useState<{
    open: boolean;
    config: DeleteConfirmConfig;
  }>({
    open: false,
    config: { title: '', description: '', onConfirm: () => {} }
  });

  const showAlert = (config: AlertConfig) => {
    setAlertState({ open: true, config });
  };

  const showConfirm = (config: ConfirmConfig) => {
    setConfirmState({ open: true, config });
  };

  const showDeleteConfirm = (config: DeleteConfirmConfig) => {
    setDeleteState({ open: true, config });
  };

  const handleConfirm = () => {
    confirmState.config.onConfirm();
    setConfirmState(prev => ({ ...prev, open: false }));
  };

  const handleDeleteConfirm = () => {
    deleteState.config.onConfirm();
    setDeleteState(prev => ({ ...prev, open: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm, showDeleteConfirm }}>
      {children}
      
      <CustomAlert
        open={alertState.open}
        onOpenChange={(open) => setAlertState(prev => ({ ...prev, open }))}
        title={alertState.config.title}
        description={alertState.config.description}
        type={alertState.config.type}
        confirmText={alertState.config.confirmText}
      />

      <CustomAlert
        open={confirmState.open}
        onOpenChange={(open) => setConfirmState(prev => ({ ...prev, open }))}
        title={confirmState.config.title}
        description={confirmState.config.description}
        type={confirmState.config.type}
        onConfirm={handleConfirm}
        confirmText={confirmState.config.confirmText}
        cancelText={confirmState.config.cancelText}
        showCancel={true}
      />

      <DeleteConfirmation
        open={deleteState.open}
        onOpenChange={(open) => setDeleteState(prev => ({ ...prev, open }))}
        title={deleteState.config.title}
        description={deleteState.config.description}
        itemName={deleteState.config.itemName}
        onConfirm={handleDeleteConfirm}
      />
    </AlertContext.Provider>
  );
};