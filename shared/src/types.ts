/**
 * Shared types for Crypto-Solana-AI-Agent
 */

export interface AgentAction {
  id: string;
  type: 'swap' | 'launch' | 'transfer' | 'nft_mint' | 'nft_transfer';
  prompt: string;
  decision: string;
  status: 'pending' | 'executing' | 'success' | 'failed';
  transactionSignature?: string;
  error?: string;
  timestamp: number;
  params: Record<string, unknown>;
}

export interface SwapParams {
  inputMint: string;
  outputMint: string;
  amount: number;
  slippageBps?: number;
}

export interface LaunchParams {
  name: string;
  symbol: string;
  description?: string;
  initialSupply: number;
  decimals?: number;
  imageUri?: string;
}

export interface TransferParams {
  tokenMint?: string; // If undefined, transfer SOL
  recipient: string;
  amount: number;
}

export interface NFTMintParams {
  name: string;
  symbol: string;
  description?: string;
  imageUri: string;
  collection?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

export interface NFTTransferParams {
  mintAddress: string;
  recipient: string;
}

export interface SolanaConfig {
  rpcEndpoint: string;
  commitment: 'processed' | 'confirmed' | 'finalized';
  network: 'devnet' | 'testnet' | 'mainnet-beta';
}

export interface WalletConfig {
  privateKey?: string;
  publicKey?: string;
}

export interface AIConfig {
  provider: 'openai' | 'xai' | 'huggingface' | 'local';
  apiKey?: string;
  model?: string;
}

export interface AgentDecision {
  action: AgentAction['type'];
  confidence: number;
  reasoning: string;
  params: Record<string, unknown>;
}
