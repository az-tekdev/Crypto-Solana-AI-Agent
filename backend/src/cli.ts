/**
 * CLI interface for the agent
 */

import { Agent } from './agent/core';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const agent = new Agent();

function promptUser(): void {
  rl.question('\n🤖 Enter your prompt (or "exit" to quit): ', async (input) => {
    if (input.toLowerCase() === 'exit') {
      console.log('👋 Goodbye!');
      rl.close();
      process.exit(0);
    }

    if (!input.trim()) {
      promptUser();
      return;
    }

    try {
      console.log('\n⏳ Processing...');
      const action = await agent.executePrompt(input);
      
      console.log('\n✅ Action completed!');
      console.log(`   Type: ${action.type}`);
      console.log(`   Decision: ${action.decision}`);
      console.log(`   Status: ${action.status}`);
      
      if (action.transactionSignature) {
        const network = process.env.SOLANA_NETWORK || 'devnet';
        const explorerUrl = `https://explorer.solana.com/tx/${action.transactionSignature}?cluster=${network}`;
        console.log(`   Transaction: ${explorerUrl}`);
      }
      
      if (action.error) {
        console.log(`   Error: ${action.error}`);
      }
    } catch (error) {
      console.error('\n❌ Error:', error instanceof Error ? error.message : 'Unknown error');
    }

    promptUser();
  });
}

async function main(): Promise<void> {
  console.log('🚀 Crypto-Solana-AI-Agent CLI');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const publicKey = agent.getWalletPublicKey();
  const balance = await agent.getBalance();
  
  console.log(`📝 Wallet: ${publicKey}`);
  console.log(`💰 Balance: ${balance.toFixed(4)} SOL`);
  console.log('\n💡 Example prompts:');
  console.log('   - "Swap 1 SOL for USDC"');
  console.log('   - "Launch a token called GrokCoin with 1M supply"');
  console.log('   - "Transfer 0.5 SOL to [address]"');
  console.log('   - "Mint an NFT with name AI Art and image https://..."');
  console.log('   - "Transfer NFT [mint] to [address]"');
  
  promptUser();
}

main().catch(console.error);
