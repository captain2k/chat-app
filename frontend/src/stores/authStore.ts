import { create } from 'zustand';

type AuthUser = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  profilePic: string;
};

type State = {
  authUser: AuthUser;
  isLoading: boolean;
};

export const authStore = create<State>(() => ({
  authUser: {
    id: '',
    username: '',
    email: '',
    fullName: '',
    profilePic: '',
  },
  isLoading: false,
}));
