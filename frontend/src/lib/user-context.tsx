"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { api, type UserOut } from "@/lib/api";

const UserContext = createContext<{
  user: UserOut;
  refreshUser: () => Promise<void>;
  setHeartsLocally: (hearts: number) => void;
}>({
  user: {} as UserOut,
  refreshUser: async () => {},
  setHeartsLocally: () => {},
});

export function UserProvider({
  initialUser,
  children,
}: {
  initialUser: UserOut;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserOut>(initialUser);

  const refreshUser = useCallback(async () => {
    const fresh = await api.getMe();
    setUser(fresh);
  }, []);

  // Optimistic update for instant feedback without waiting on a network round trip
  const setHeartsLocally = useCallback((hearts: number) => {
    setUser((u) => ({ ...u, hearts }));
  }, []);

  return (
    <UserContext.Provider value={{ user, refreshUser, setHeartsLocally }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}