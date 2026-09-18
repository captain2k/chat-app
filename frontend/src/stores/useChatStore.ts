import { create } from 'zustand';
import axiosInstance from '../libs/axios';
import { useAuthStore, type AuthUser } from './authStore';

type Message = {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

type State = {
  isSoundEnabled: boolean;
  activeTab: 'chats' | 'contacts';
  selectedPartner: AuthUser | null;
  chatPartnerList: AuthUser[];
  allContacts: AuthUser[];
  isLoadingChatPartner: boolean;
  isLoadingContacts: boolean;
  isLoadingMessage: boolean;
  messages: Message[];
};

type Action = {
  toggleSound: () => void;
  setActiveTab: (tab: 'chats' | 'contacts') => void;
  setSelectedPartner: (partner: AuthUser) => void;
  fetchChatPartnerList: () => void;
  fetchContactList: () => void;
  getMessagesByUserId: (id: string) => void;
  sendMessage: (payload: { message: string; image?: string | File }) => void;
  subcribeMessageFromSocket: () => void;
  unsubcribeMessageFromSocket: () => void;
};

export const useChatStore = create<State & Action>((set, get) => ({
  isSoundEnabled: localStorage.getItem('isSoundEnabled') === 'true',
  activeTab: 'chats',
  selectedPartner: null,
  chatPartnerList: [],
  allContacts: [],
  isLoadingChatPartner: false,
  isLoadingContacts: false,
  isLoadingMessage: false,
  messages: [],

  toggleSound: () => {
    const { isSoundEnabled } = get();
    localStorage.setItem('isSoundEnabled', String(!isSoundEnabled));
    set({ isSoundEnabled: !isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSelectedPartner: (partner) => set({ selectedPartner: partner }),

  fetchChatPartnerList: async () => {
    try {
      set({ isLoadingChatPartner: true });
      const res = await axiosInstance.get('/message/conversations');
      set({ chatPartnerList: res.data });
    } catch (error) {
      console.log('Error fetching chat partners', error);
    } finally {
      set({ isLoadingChatPartner: false });
    }
  },

  fetchContactList: async () => {
    try {
      set({ isLoadingContacts: true });
      const res = await axiosInstance.get('/message/all-contacts');
      set({ allContacts: res.data });
    } catch (error) {
      console.log('Error fetching all contacts', error);
    } finally {
      set({ isLoadingContacts: false });
    }
  },

  getMessagesByUserId: async (id: string) => {
    try {
      set({ isLoadingMessage: true });
      const res = await axiosInstance.get(`/message/${id}`);
      set({ messages: res.data });
    } catch (error) {
      console.log('Error fetching messages', error);
    } finally {
      set({ isLoadingMessage: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedPartner, messages } = get();

    try {
      const res = await axiosInstance.post(`/message/send/${selectedPartner._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.log('Error sending message', error);
    }
  },

  subcribeMessageFromSocket: () => {
    const { socket } = useAuthStore.getState();

    if (!socket) return;
    socket.off('newMessage');

    socket.on('newMessage', (newMessage: Message) => {
      console.log('🚀 ~ newMessage:', newMessage);
      const { selectedPartner, isSoundEnabled } = get();

      if (newMessage.senderId !== selectedPartner?._id) return;

      if (isSoundEnabled) {
        const notificationSound = new Audio('/sounds/notification.mp3');
        notificationSound.currentTime = 0;
        notificationSound.play().catch((err) => console.log(err));
      }

      set((state) => ({ messages: [...state.messages, newMessage] }));
    });
  },

  unsubcribeMessageFromSocket: () => {
    const { socket } = useAuthStore.getState();
    if (!socket) return;
    socket.off('newMessage');
  },
}));
