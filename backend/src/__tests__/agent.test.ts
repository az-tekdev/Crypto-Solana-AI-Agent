import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AIAgent } from '../ai/agent';

describe('AIAgent', () => {
  let agent: AIAgent;

  beforeEach(() => {
    agent = new AIAgent();
  });

  it('should handle swap prompts', async () => {
    const decision = await agent.decideAction('Swap 1 SOL for USDC');
    expect(decision.action).toBe('swap');
    expect(decision.params).toHaveProperty('amount');
  });

  it('should handle launch prompts', async () => {
    const decision = await agent.decideAction('Launch a token called GrokCoin with 1M supply');
    expect(decision.action).toBe('launch');
    expect(decision.params).toHaveProperty('name');
    expect(decision.params).toHaveProperty('initialSupply');
  });

  it('should handle transfer prompts', async () => {
    const decision = await agent.decideAction('Transfer 0.5 SOL to address');
    expect(decision.action).toBe('transfer');
    expect(decision.params).toHaveProperty('amount');
  });

  it('should handle NFT mint prompts', async () => {
    const decision = await agent.decideAction('Mint an NFT with name AI Art');
    expect(decision.action).toBe('nft_mint');
    expect(decision.params).toHaveProperty('name');
  });
});
