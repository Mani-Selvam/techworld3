import { createContext, useContext, useState, ReactNode } from 'react';

interface TicketModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const TicketModalContext = createContext<TicketModalContextType | undefined>(undefined);

export function TicketModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <TicketModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </TicketModalContext.Provider>
  );
}

export function useTicketModal() {
  const context = useContext(TicketModalContext);
  if (context === undefined) {
    throw new Error('useTicketModal must be used within a TicketModalProvider');
  }
  return context;
}