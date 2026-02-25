import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WalletConnect from './WalletConnect';
import PromptInput from './PromptInput';
import ActionHistory from './ActionHistory';
import BalanceDisplay from './BalanceDisplay';
import { agentApi, WalletInfo } from '../services/api';

export default function Dashboard() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWalletInfo();
    const interval = setInterval(loadWalletInfo, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const loadWalletInfo = async () => {
    try {
      const info = await agentApi.getWalletInfo();
      setWalletInfo(info);
    } catch (error) {
      console.error('Failed to load wallet info:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-solana-purple to-solana-green bg-clip-text text-transparent neon-text">
                Crypto-Solana-AI-Agent
              </h1>
              <p className="text-gray-400 mt-2">Autonomous Solana Agent for Token & NFT Operations</p>
            </div>
            <WalletConnect />
          </div>
        </motion.header>

        {/* Balance Display */}
        {walletInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <BalanceDisplay walletInfo={walletInfo} />
          </motion.div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prompt Input - Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <PromptInput onActionCreated={loadWalletInfo} />
          </motion.div>

          {/* Action History - Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <ActionHistory />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
