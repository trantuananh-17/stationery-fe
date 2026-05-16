import { FetchWrapper } from '@/lib/fetch-wrapper';
import type { ChatbotApiResponse, ChatbotQueryRequest } from '@/types/chatbot.type';

const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_SERVER_AI_API);

type FetchWrapperResponse<T> = Response & {
  data?: T;
};

export async function sendChatMessage(question: string): Promise<ChatbotApiResponse> {
  const res = (await fetchWrapper.post<ChatbotApiResponse>('/chat/ask', {
    question
  } satisfies ChatbotQueryRequest)) as unknown as FetchWrapperResponse<ChatbotApiResponse>;

  if (res.data) {
    return res.data;
  }

  return res as unknown as ChatbotApiResponse;
}
