import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Address } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, _password: string) => boolean;
  signup: (name: string, email: string, mobile: string, _password: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addAddress: (addr: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, data: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('servicehub_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('servicehub_user');
      }
    }
  }, []);

  const persist = (u: User | null) => {
    if (u) localStorage.setItem('servicehub_user', JSON.stringify(u));
    else localStorage.removeItem('servicehub_user');
    setUser(u);
  };

  const login = (email: string, _password: string) => {
    const newUser: User = {
      id: 'usr1',
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      mobile: '+91 90000 12345',
      addresses: [
        { id: 'addr1', label: 'Home', line1: 'Flat 302, Sunrise Apartments', line2: 'Madhapur', city: 'Hyderabad', pincode: '500081', type: 'Home' },
      ],
    };
    persist(newUser);
    return true;
  };

  const signup = (name: string, email: string, mobile: string, _password: string) => {
    const newUser: User = { id: 'usr1', name, email, mobile, addresses: [] };
    persist(newUser);
    return true;
  };

  const logout = () => persist(null);

  const updateProfile = (data: Partial<User>) => {
    if (user) persist({ ...user, ...data });
  };

  const addAddress = (addr: Omit<Address, 'id'>) => {
    if (user) {
      const newAddr = { ...addr, id: `addr${Date.now()}` };
      persist({ ...user, addresses: [...user.addresses, newAddr] });
    }
  };

  const updateAddress = (id: string, data: Partial<Address>) => {
    if (user) {
      persist({
        ...user,
        addresses: user.addresses.map((a) => (a.id === id ? { ...a, ...data } : a)),
      });
    }
  };

  const deleteAddress = (id: string) => {
    if (user) {
      persist({ ...user, addresses: user.addresses.filter((a) => a.id !== id) });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, updateProfile, addAddress, updateAddress, deleteAddress }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
