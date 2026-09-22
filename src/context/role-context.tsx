import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'user' | 'etab';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
  isEtab: boolean;
  isUser: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({
  children,
  initialRole = 'user',
}: {
  children: React.ReactNode;
  initialRole?: UserRole;
}) {
  const [role, setRole] = useState<UserRole>(initialRole);

  const toggleRole = () => {
    setRole((prev) => (prev === 'user' ? 'etab' : 'user'));
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        toggleRole,
        isEtab: role === 'etab',
        isUser: role === 'user',
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(RoleContext);
  if (!context) {
    // Fallback if not wrapped in provider
    return {
      role: 'user' as UserRole,
      setRole: () => {},
      toggleRole: () => {},
      isEtab: false,
      isUser: true,
    };
  }
  return context;
}
