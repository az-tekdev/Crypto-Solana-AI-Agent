/**
 * Core agent orchestrator
 */

import { Connection, Keypair } from '@solana/web3.js';
import { AIAgent } from '../ai/agent';
import { TokenOperations } from '../solana/token';
import { NFTOperations } from '../solana/nft';
import { AgentAction, AgentDecision } from '@crypto-solana-ai-agent/shared';
import { createConnection, getWalletConfig } from '@crypto-solana-ai-agent/shared';
import bs58 from 'bs58';

export class Agent {
  private aiAgent: AIAgent;
  private tokenOps: TokenOperations;
  private nftOps: NFTOperations;
  private connection: Connection;
  private wallet: Keypair;
  private actions: Map<string, AgentAction> = new Map();

  constructor() {
    this.connection = createConnection();
    this.wallet = this.loadWallet();
    this.aiAgent = new AIAgent();
    this.tokenOps = new TokenOperations(this.connection, this.wallet);
    this.nftOps = new NFTOperations(this.connection, this.wallet);
  }

  private loadWallet(): Keypair {
    const config = getWalletConfig();
    
    if (!config.privateKey) {
      // Generate a new wallet for demo (in production, require env var)
      console.warn('No private key found, generating new wallet for demo');
      const newWallet = Keypair.generate();
      console.log('New wallet public key:', newWallet.publicKey.toBase58());
      console.log('Private key (base58):', bs58.encode(newWallet.secretKey));
      return newWallet;
    }

    try {
      const secretKey = bs58.decode(config.privateKey);
      return Keypair.fromSecretKey(secretKey);
    } catch (error) {
      throw new Error('Invalid private key format. Use base58 encoded secret key.');
    }
  }

  /**
   * Execute a prompt and perform the decided action
   */
  async executePrompt(prompt: string): Promise<AgentAction> {
    const actionId = `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const action: AgentAction = {
      id: actionId,
      type: 'swap', // Will be updated by decision
      prompt,
      decision: '',
      status: 'pending',
      timestamp: Date.now(),
      params: {},
    };

    this.actions.set(actionId, action);

    try {
      // Get AI decision
      action.status = 'executing';
      const decision = await this.aiAgent.decideAction(prompt);
      
      action.type = decision.action;
      action.decision = decision.reasoning;
      action.params = decision.params;

      // Execute the action
      let signature: string;

      switch (decision.action) {
        case 'swap':
          signature = await this.tokenOps.swap(decision.params as any);
          break;

        case 'launch':
          const launchResult = await this.tokenOps.launch(decision.params as any);
          signature = launchResult.signature;
          action.params = { ...action.params, mint: launchResult.mint };
          break;

        case 'transfer':
          signature = await this.tokenOps.transfer(decision.params as any);
          break;

        case 'nft_mint':
          const mintResult = await this.nftOps.mint(decision.params as any);
          signature = mintResult.signature;
          action.params = { ...action.params, mint: mintResult.mint };
          break;

        case 'nft_transfer':
          signature = await this.nftOps.transfer(decision.params as any);
          break;

        default:
          throw new Error(`Unknown action type: ${decision.action}`);
      }

      action.transactionSignature = signature;
      action.status = 'success';
      
      return action;
    } catch (error) {
      action.status = 'failed';
      action.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    } finally {
      this.actions.set(actionId, action);
    }
  }

  /**
   * Get action by ID
   */
  getAction(actionId: string): AgentAction | undefined {
    return this.actions.get(actionId);
  }

  /**
   * Get all actions
   */
  getAllActions(): AgentAction[] {
    return Array.from(this.actions.values()).sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get wallet public key
   */
  getWalletPublicKey(): string {
    return this.wallet.publicKey.toBase58();
  }

  /**
   * Get SOL balance
   */
  async getBalance(): Promise<number> {
    const balance = await this.connection.getBalance(this.wallet.publicKey);
    return balance / 1e9; // Convert lamports to SOL
  }
}
