import React, { createContext, useContext, useState } from 'react';
import { UserRole, useUserRole } from './role-context';

interface TabContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabContext = createContext<TabContextType>({
  activeTab: 'flame',
  setActiveTab: () => {},
});

export function TabProvider({ children }: { children: React.ReactNode }) {
  const { role } = useUserRole();
  const [activeTab, setActiveTab] = useState<string>(
    role === 'user' ? 'flame' : 'stats'
  );

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
}

export function useActiveTab() {
  return useContext(TabContext);
}
