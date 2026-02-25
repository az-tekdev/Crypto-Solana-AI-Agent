import axios from 'axios';
import { AgentAction } from '@crypto-solana-ai-agent/shared';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ExecutePromptResponse extends AgentAction {}

export interface WalletInfo {
  publicKey: string;
  balance: number;
}

export const agentApi = {
  executePrompt: async (prompt: string): Promise<ExecutePromptResponse> => {
    const response = await api.post<ExecutePromptResponse>('/api/execute-prompt', { prompt });
    return response.data;
  },

  getAction: async (id: string): Promise<AgentAction> => {
    const response = await api.get<AgentAction>(`/api/action/${id}`);
    return response.data;
  },

  getAllActions: async (): Promise<AgentAction[]> => {
    const response = await api.get<AgentAction[]>('/api/actions');
    return response.data;
  },

  getWalletInfo: async (): Promise<WalletInfo> => {
    const response = await api.get<WalletInfo>('/api/wallet');
    return response.data;
  },
};
