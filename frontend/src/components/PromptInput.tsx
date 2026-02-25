import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { agentApi } from '../services/api';
import { AgentAction } from '@crypto-solana-ai-agent/shared';

interface PromptInputProps {
  onActionCreated?: () => void;
}

export default function PromptInput({ onActionCreated }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const examplePrompts = [
    'Swap 1 SOL for USDC',
    'Launch a token called GrokCoin with 1M supply',
    'Transfer 0.5 SOL to [address]',
    'Mint an NFT with name AI Art and image https://...',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const action = await agentApi.executePrompt(prompt);
      setSuccess(true);
      setPrompt('');
      
      if (onActionCreated) {
        onActionCreated();
      }

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute prompt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-xl p-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-solana-purple">AI Agent Prompt</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt... (e.g., 'Swap 1 SOL for USDC')"
            className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-solana-purple focus:border-transparent resize-none"
            disabled={loading}
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3 bg-green-900/50 border border-green-700 rounded-lg text-green-200 text-sm"
            >
              ✅ Action executed successfully!
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-solana-purple to-solana-green rounded-lg font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            'Execute Prompt'
          )}
        </button>
      </form>

      <div className="mt-6">
        <p className="text-sm text-gray-400 mb-2">Example prompts:</p>
        <div className="space-y-2">
          {examplePrompts.map((example, idx) => (
            <button
              key={idx}
              onClick={() => setPrompt(example)}
              className="block w-full text-left px-3 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
