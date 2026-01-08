import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (role) => {
    // Demo users for assignment - no real authentication
    const demoUsers = {
      agent: {
        id: 102,
        name: 'Agent John',
        email: 'agent@propertyflow.app',
        role: 'agent',
        company: 'Matrix Realty Group',
        location: 'New York, USA'
      },
      contractor: {
        id: 101,
        name: 'Adnan Hussain',
        email: 'danish@propertyflow.app',
        role: 'contractor',
        company: 'Adnan Enterprises',
        location: 'Srinagar, Kashmir'
      }
    };

    setUser(demoUsers[role]);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
