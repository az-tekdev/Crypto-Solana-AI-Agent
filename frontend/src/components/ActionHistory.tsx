import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { agentApi } from '../services/api';
import { AgentAction } from '@crypto-solana-ai-agent/shared';

export default function ActionHistory() {
  const [actions, setActions] = useState<AgentAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActions();
    const interval = setInterval(loadActions, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const loadActions = async () => {
    try {
      const data = await agentApi.getAllActions();
      setActions(data);
    } catch (error) {
      console.error('Failed to load actions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: AgentAction['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500';
      case 'executing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getActionTypeColor = (type: AgentAction['type']) => {
    switch (type) {
      case 'swap':
        return 'text-solana-green';
      case 'launch':
        return 'text-solana-purple';
      case 'transfer':
        return 'text-neon-cyan';
      case 'nft_mint':
        return 'text-neon-pink';
      case 'nft_transfer':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getExplorerUrl = (signature: string) => {
    const network = import.meta.env.VITE_SOLANA_NETWORK || 'devnet';
    return `https://explorer.solana.com/tx/${signature}?cluster=${network}`;
  };

  if (loading && actions.length === 0) {
    return (
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-solana-purple">Action History</h2>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-solana-purple border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-xl p-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-solana-purple">Action History</h2>
      
      {actions.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No actions yet. Execute a prompt to get started!</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          <AnimatePresence>
            {actions.map((action) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-solana-purple transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${getActionTypeColor(action.type)}`}>
                      {action.type.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(action.status)}`}>
                      {action.status}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(action.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-sm text-gray-300 mb-2">
                  <span className="text-gray-500">Prompt:</span> {action.prompt}
                </p>

                {action.decision && (
                  <p className="text-xs text-gray-400 mb-2 italic">
                    {action.decision}
                  </p>
                )}

                {action.transactionSignature && (
                  <a
                    href={getExplorerUrl(action.transactionSignature)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-solana-green hover:underline flex items-center gap-1"
                  >
                    View on Explorer →
                  </a>
                )}

                {action.error && (
                  <p className="text-xs text-red-400 mt-2">
                    Error: {action.error}
                  </p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
