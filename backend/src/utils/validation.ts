/**
 * Validation utilities
 */

import { PublicKey } from '@solana/web3.js';
import { SwapParams, LaunchParams, TransferParams, NFTMintParams, NFTTransferParams } from '@crypto-solana-ai-agent/shared';

export function validateSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export function validateSwapParams(params: Partial<SwapParams>): params is SwapParams {
  if (!params.inputMint || !params.outputMint) {
    return false;
  }
  if (!validateSolanaAddress(params.inputMint) || !validateSolanaAddress(params.outputMint)) {
    return false;
  }
  if (typeof params.amount !== 'number' || params.amount <= 0) {
    return false;
  }
  return true;
}

export function validateLaunchParams(params: Partial<LaunchParams>): params is LaunchParams {
  if (!params.name || !params.symbol) {
    return false;
  }
  if (typeof params.initialSupply !== 'number' || params.initialSupply <= 0) {
    return false;
  }
  return true;
}

export function validateTransferParams(params: Partial<TransferParams>): params is TransferParams {
  if (!params.recipient || !validateSolanaAddress(params.recipient)) {
    return false;
  }
  if (typeof params.amount !== 'number' || params.amount <= 0) {
    return false;
  }
  return true;
}

export function validateNFTMintParams(params: Partial<NFTMintParams>): params is NFTMintParams {
  if (!params.name || !params.symbol || !params.imageUri) {
    return false;
  }
  return true;
}

export function validateNFTTransferParams(params: Partial<NFTTransferParams>): params is NFTTransferParams {
  if (!params.mintAddress || !params.recipient) {
    return false;
  }
  if (!validateSolanaAddress(params.mintAddress) || !validateSolanaAddress(params.recipient)) {
    return false;
  }
  return true;
}
