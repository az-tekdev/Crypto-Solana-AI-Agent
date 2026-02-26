/**
 * AI Agent for decision-making using LangChain
 */

import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { AgentDecision, AgentAction } from '@crypto-solana-ai-agent/shared';
import { getAIConfig } from '@crypto-solana-ai-agent/shared';

export class AIAgent {
  private model: ChatOpenAI | null = null;
  private config: ReturnType<typeof getAIConfig>;

  constructor() {
    this.config = getAIConfig();
    this.initializeModel();
  }

  private initializeModel(): void {
    if (this.config.provider === 'openai' && this.config.apiKey) {
      this.model = new ChatOpenAI({
        modelName: this.config.model || 'gpt-4',
        temperature: 0.7,
        openAIApiKey: this.config.apiKey,
      });
    }
    // For xAI/Grok or HuggingFace, add similar initialization here
    // For local models, use a different approach
  }

  /**
   * Analyze a user prompt and decide on an action
   */
  async decideAction(prompt: string): Promise<AgentDecision> {
    if (!this.model) {
      // Fallback to rule-based decision making if AI is not available
      return this.fallbackDecision(prompt);
    }

    const systemPrompt = `You are an autonomous Solana AI agent. Analyze user prompts and decide on blockchain actions.

Available actions:
1. swap - Swap tokens (e.g., "swap 1 SOL for USDC", "swap SOL to USDC if price > 0.5")
2. launch - Launch a new token (e.g., "launch token called GrokCoin with 1M supply")
3. transfer - Transfer tokens or SOL (e.g., "send 0.5 SOL to address...")
4. nft_mint - Mint an NFT (e.g., "mint NFT with name X and image Y")
5. nft_transfer - Transfer an NFT (e.g., "send NFT to address...")

Respond with a JSON object containing:
- action: one of the action types above
- confidence: 0-1 score
- reasoning: brief explanation
- params: object with action-specific parameters

Example for "swap 1 SOL for USDC":
{
  "action": "swap",
  "confidence": 0.95,
  "reasoning": "Clear swap request with specified amounts",
  "params": {
    "inputMint": "So11111111111111111111111111111111111111112",
    "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "amount": 1.0
  }
}`;

    try {
      const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(prompt),
      ];

      const response = await this.model.invoke(messages);
      const content = response.content as string;

      // Parse JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const decision = JSON.parse(jsonMatch[0]) as AgentDecision;
        return this.validateDecision(decision);
      }

      return this.fallbackDecision(prompt);
    } catch (error) {
      console.error('AI decision error:', error);
      return this.fallbackDecision(prompt);
    }
  }

  private validateDecision(decision: Partial<AgentDecision>): AgentDecision {
    const validActions: AgentDecision['action'][] = ['swap', 'launch', 'transfer', 'nft_mint', 'nft_transfer'];
    
    if (!decision.action || !validActions.includes(decision.action)) {
      throw new Error('Invalid action type');
    }

    return {
      action: decision.action,
      confidence: decision.confidence ?? 0.5,
      reasoning: decision.reasoning ?? 'AI decision',
      params: decision.params ?? {},
    };
  }

  private fallbackDecision(prompt: string): AgentDecision {
    const lowerPrompt = prompt.toLowerCase();

    // Rule-based fallback
    if (lowerPrompt.includes('swap') || lowerPrompt.includes('exchange')) {
      return {
        action: 'swap',
        confidence: 0.7,
        reasoning: 'Detected swap keyword in prompt',
        params: this.extractSwapParams(prompt),
      };
    }

    if (lowerPrompt.includes('launch') || lowerPrompt.includes('create token')) {
      return {
        action: 'launch',
        confidence: 0.7,
        reasoning: 'Detected token launch keyword',
        params: this.extractLaunchParams(prompt),
      };
    }

    if (lowerPrompt.includes('transfer') || lowerPrompt.includes('send')) {
      if (lowerPrompt.includes('nft')) {
        return {
          action: 'nft_transfer',
          confidence: 0.7,
          reasoning: 'Detected NFT transfer',
          params: this.extractNFTTransferParams(prompt),
        };
      }
      return {
        action: 'transfer',
        confidence: 0.7,
        reasoning: 'Detected transfer keyword',
        params: this.extractTransferParams(prompt),
      };
    }

    if (lowerPrompt.includes('mint') && lowerPrompt.includes('nft')) {
      return {
        action: 'nft_mint',
        confidence: 0.7,
        reasoning: 'Detected NFT mint keyword',
        params: this.extractNFTMintParams(prompt),
      };
    }

    // Default to swap if unclear
    return {
      action: 'swap',
      confidence: 0.3,
      reasoning: 'Unclear prompt, defaulting to swap',
      params: {},
    };
  }

  private extractSwapParams(prompt: string): Record<string, unknown> {
    const amountMatch = prompt.match(/(\d+\.?\d*)\s*(SOL|USDC|USDT)/i);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : 1.0;
    
    return {
      inputMint: 'So11111111111111111111111111111111111111112', // SOL - will use constant in production
      outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC - will use constant in production
      amount,
    };
  }

  private extractLaunchParams(prompt: string): Record<string, unknown> {
    const nameMatch = prompt.match(/(?:called|named|name)\s+(\w+)/i);
    const supplyMatch = prompt.match(/(\d+[KMB]?)\s*(?:supply|tokens?)/i);
    
    let supply = 1000000;
    if (supplyMatch) {
      const val = supplyMatch[1];
      if (val.endsWith('K')) supply = parseFloat(val) * 1000;
      else if (val.endsWith('M')) supply = parseFloat(val) * 1000000;
      else supply = parseFloat(val);
    }

    return {
      name: nameMatch ? nameMatch[1] : 'NewToken',
      symbol: nameMatch ? nameMatch[1].substring(0, 4).toUpperCase() : 'NEW',
      initialSupply: supply,
    };
  }

  private extractTransferParams(prompt: string): Record<string, unknown> {
    const amountMatch = prompt.match(/(\d+\.?\d*)\s*(SOL|USDC)?/i);
    const addressMatch = prompt.match(/([1-9A-HJ-NP-Za-km-z]{32,44})/);
    
    return {
      amount: amountMatch ? parseFloat(amountMatch[1]) : 0.1,
      recipient: addressMatch ? addressMatch[1] : '',
    };
  }

  private extractNFTMintParams(prompt: string): Record<string, unknown> {
    const nameMatch = prompt.match(/(?:name|called)\s+([^,]+)/i);
    const imageMatch = prompt.match(/(?:image|uri)\s+([^\s]+)/i);
    
    return {
      name: nameMatch ? nameMatch[1].trim() : 'AI Generated NFT',
      symbol: 'AI',
      imageUri: imageMatch ? imageMatch[1] : 'https://via.placeholder.com/500',
    };
  }

  private extractNFTTransferParams(prompt: string): Record<string, unknown> {
    const addressMatch = prompt.match(/([1-9A-HJ-NP-Za-km-z]{32,44})/);
    const mintMatch = prompt.match(/(?:mint|nft)\s+([1-9A-HJ-NP-Za-km-z]{32,44})/i);
    
    return {
      recipient: addressMatch ? addressMatch[1] : '',
      mintAddress: mintMatch ? mintMatch[1] : '',
    };
  }
}
