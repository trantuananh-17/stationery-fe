import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ChatbotApiResponse } from '@/types/chatbot.type';

export type ChatMessage = {
  id: number;
  role: 'assistant' | 'user';
  content: string;
  apiResponse?: ChatbotApiResponse;
};

type AddMessagePayload = Omit<ChatMessage, 'id'>;

type ChatbotStore = {
  open: boolean;
  fullscreen: boolean;
  isLoading: boolean;
  hasUnreadMessage: boolean;
  messages: ChatMessage[];

  setOpen: (open: boolean) => void;
  setFullscreen: (fullscreen: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  addMessage: (message: AddMessagePayload) => void;
  clearMessages: (userName?: string) => void;
  markAllAsRead: () => void;
  ensureDefaultGreeting: (userName?: string) => void;
};

const DEFAULT_GREETING_ID = 1;

function createDefaultMessages(userName?: string): ChatMessage[] {
  const displayName = userName?.trim();

  return [
    {
      id: DEFAULT_GREETING_ID,
      role: 'assistant',
      content: `${displayName ? `Xin chào ${displayName}!` : 'Xin chào!'} Mình là trợ lý ảo của Minaco. Bạn cần hỗ trợ gì?`
    }
  ];
}

function isDefaultGreetingOnly(messages: ChatMessage[]) {
  return messages.length === 1 && messages[0]?.id === DEFAULT_GREETING_ID && messages[0]?.role === 'assistant';
}

export const useChatbotStore = create<ChatbotStore>()(
  persist(
    (set) => ({
      open: false,
      fullscreen: false,
      isLoading: false,
      hasUnreadMessage: false,

      // Mặc định không có message.
      // Khi bấm mở chatbot mới tạo lời chào theo userName hiện tại.
      messages: [],

      setOpen: (open) =>
        set({
          open,
          ...(open ? { hasUnreadMessage: false } : {})
        }),

      setFullscreen: (fullscreen) => set({ fullscreen }),

      setLoading: (isLoading) => set({ isLoading }),

      addMessage: (message) =>
        set((state) => {
          const isAssistantMessage = message.role === 'assistant';
          const shouldNotify = isAssistantMessage && !state.open;

          return {
            messages: [
              ...state.messages,
              {
                id: Date.now() + Math.random(),
                ...message
              }
            ],
            hasUnreadMessage: shouldNotify ? true : state.hasUnreadMessage
          };
        }),

      ensureDefaultGreeting: (userName) =>
        set((state) => {
          if (state.messages.length > 0 && !isDefaultGreetingOnly(state.messages)) {
            return {};
          }

          return {
            messages: createDefaultMessages(userName)
          };
        }),

      clearMessages: (userName) =>
        set({
          messages: createDefaultMessages(userName),
          hasUnreadMessage: false,
          isLoading: false
        }),

      markAllAsRead: () => set({ hasUnreadMessage: false })
    }),
    {
      name: 'floating-chatbot-assistant',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        open: state.open,
        fullscreen: state.fullscreen,
        hasUnreadMessage: state.hasUnreadMessage,
        messages: state.messages
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      }
    }
  )
);
