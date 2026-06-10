import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface ChatResponse {
  reply?: string;
  error?: string;
}

export const sendChatMessage = async(message: string, history: ChatMessage[], headers: { headers: { Authorization: string } }): Promise<ChatResponse> => {
  const response: AxiosResponse<ChatResponse> = await apiActions.post(`/api/v1/chatbot/`, { message, history }, headers);
  return response.data;
}
