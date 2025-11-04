export interface User {
  token: string;
  email: string;
  role: string;
}

export interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}