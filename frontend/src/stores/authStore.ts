import { create } from 'zustand';
import axiosInstance from '../libs/axios';
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

export type AuthUser = {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  profilePicture: string;
};

type SignUpPayload = {
  fullName: string;
  email: string;
  password: string;
};

type State = {
  authUser: AuthUser | null;
  isLoading: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  socket: null | Socket;
  onlineUsers: string[];
};

type Action = {
  check: () => Promise<void>;
  signup: (data: SignUpPayload) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { profilePicture: string | ArrayBuffer }) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
};

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:3000' : '/';

export const useAuthStore = create<State & Action>((set, get) => ({
  authUser: null,
  isLoading: false,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  socket: null,
  onlineUsers: [],

  check: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get('/auth/me');
      if (res.data) {
        set({ authUser: res.data });
      }
      const { connectSocket } = get();
      connectSocket();
    } catch (error) {
      console.error('Error in auth store:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post('/auth/signup', data);
      set({ authUser: res.data });

      toast.success('Account created successfully!');
      const { connectSocket } = get();
      connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post('/auth/login', data);
      set({ authUser: res.data });
      toast.success('Logged in successfully!');
      const { connectSocket } = get();
      connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      set({ authUser: null });
      toast.success('Logged out successfully');
      const { disconnectSocket } = get();
      disconnectSocket();
    } catch (error) {
      toast.error('Error logging out');
      console.log('Logout error:', error);
    }
  },

  updateProfile: async (payload) => {
    try {
      set({ isUpdatingProfile: true });
      const res = await axiosInstance.put('/auth/update-profile', payload);
      set({ authUser: res.data });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const socket = io(BASE_URL, {
      withCredentials: true,
    });
    if (!socket || get().socket?.connected) return;
    socket.connect();
    set({ socket });
    socket.on('getOnlineUsers', (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
  },
}));
