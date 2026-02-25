import { motion } from 'framer-motion';
import { WalletInfo } from '../services/api';

interface BalanceDisplayProps {
  walletInfo: WalletInfo;
}

export default function BalanceDisplay({ walletInfo }: BalanceDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-effect rounded-xl p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">Agent Wallet</p>
          <p className="text-xs text-gray-500 font-mono">{walletInfo.publicKey}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400 mb-1">Balance</p>
          <p className="text-2xl font-bold text-solana-green">
            {walletInfo.balance.toFixed(4)} SOL
          </p>
        </div>
      </div>
    </motion.div>
  );
}
