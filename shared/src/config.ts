/**
 * Shared configuration utilities
 */

import { Connection, Commitment } from '@solana/web3.js';
import { SolanaConfig, WalletConfig, AIConfig } from './types';

export function getSolanaConfig(): SolanaConfig {
  const rpcEndpoint = process.env.SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com';
  const network = (process.env.SOLANA_NETWORK || 'devnet') as 'devnet' | 'testnet' | 'mainnet-beta';
  const commitment = (process.env.SOLANA_COMMITMENT || 'confirmed') as Commitment;

  return {
    rpcEndpoint,
    commitment,
    network,
  };
}

export function getWalletConfig(): WalletConfig {
  return {
    privateKey: process.env.WALLET_PRIVATE_KEY,
    publicKey: process.env.WALLET_PUBLIC_KEY,
  };
}

export function getAIConfig(): AIConfig {
  const provider = (process.env.AI_PROVIDER || 'openai') as AIConfig['provider'];
  return {
    provider,
    apiKey: process.env.AI_API_KEY,
    model: process.env.AI_MODEL || (provider === 'openai' ? 'gpt-4' : undefined),
  };
}

export function createConnection(): Connection {
  const config = getSolanaConfig();
  return new Connection(config.rpcEndpoint, config.commitment);
}
