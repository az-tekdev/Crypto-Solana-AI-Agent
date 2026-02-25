# Crypto-Solana-AI-Agent
Autonomous Solana Agent for Token/NFT Operations

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Solana](https://img.shields.io/badge/Solana-1.18+-9945FF.svg)](https://solana.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)

A production-ready, full-stack AI agent application for Solana blockchain that autonomously executes token swaps, launches, transfers, NFT mints, and transfers based on natural language prompts. Built with Node.js/TypeScript backend, React 19 frontend, and integrated with LangChain for AI decision-making.

## 🚀 Features

### AI-Powered Decision Making
- **Natural Language Processing**: Input prompts like "Swap 1 SOL for USDC" or "Launch a token called GrokCoin with 1M supply"
- **Autonomous Actions**: AI agent analyzes prompts and decides on blockchain operations
- **Multiple AI Providers**: Supports OpenAI, xAI/Grok (when available), HuggingFace, or local models
- **Fallback Logic**: Rule-based decision making when AI is unavailable

### Token Operations
- **Token Swaps**: Integrate with Jupiter aggregator for optimal token swaps
- **Token Launches**: Create new SPL tokens with custom metadata and initial supply
- **Token Transfers**: Transfer SOL or SPL tokens to any address

### NFT Operations
- **NFT Minting**: Create NFTs with Metaplex, including metadata, images, and attributes
- **NFT Transfers**: Transfer NFTs between wallets

### Frontend Features
- **Modern UI**: Beautiful dark theme with crypto/AI aesthetics, neon elements, and smooth animations
- **Wallet Integration**: Connect with Phantom, Backpack, Solflare, and other Solana wallets
- **Real-time Monitoring**: Live transaction status updates via Solana WebSocket subscriptions
- **Action History**: View all agent actions with transaction links to Solscan/Explorer
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Security & Reliability
- **Transaction Simulation**: All transactions are simulated before submission
- **Rate Limiting**: API endpoints protected against abuse
- **Error Handling**: Comprehensive error handling for insufficient funds, failed transactions, etc.
- **Secure Key Management**: Wallet keys stored in environment variables, never hardcoded

## 📋 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **AI Integration**: LangChain.js / Vercel AI SDK
- **Solana Libraries**:
  - `@solana/web3.js` - Core Solana interactions
  - `@solana/spl-token` - Token operations
  - `@metaplex-foundation/js` - NFT operations
- **Additional**: Jupiter API (for swaps), Pyth/Chainlink (for price feeds)

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Wallet Integration**: `@solana/wallet-adapter-react`
- **HTTP Client**: Axios

### Project Structure
- **Monorepo**: Workspace-based with shared types and configs
- **Testing**: Vitest for backend, Jest/Vitest for frontend
- **Linting**: ESLint with TypeScript support

## 🛠️ Setup

### Prerequisites
- Node.js 18+ and npm
- A Solana wallet (for testing, use devnet)
- (Optional) OpenAI API key for AI features

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Crypto-Solana-AI-Agent.git
   cd Crypto-Solana-AI-Agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create `backend/.env`:
   ```env
   # Solana Configuration
   SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
   SOLANA_NETWORK=devnet
   SOLANA_COMMITMENT=confirmed

   # Wallet Configuration (base58 encoded secret key)
   WALLET_PRIVATE_KEY=your_base58_encoded_private_key
   WALLET_PUBLIC_KEY=your_public_key

   # AI Configuration
   AI_PROVIDER=openai
   AI_API_KEY=your_openai_api_key
   AI_MODEL=gpt-4

   # Server Configuration
   PORT=3001
   ```

   Create `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:3001
   VITE_SOLANA_NETWORK=devnet
   VITE_SOLANA_RPC=https://api.devnet.solana.com
   ```

4. **Build shared package**
   ```bash
   cd shared
   npm run build
   cd ..
   ```

5. **Start the backend**
   ```bash
   npm run dev:backend
   ```

6. **Start the frontend** (in a new terminal)
   ```bash
   npm run dev:frontend
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
Crypto-Solana-AI-Agent/
├── backend/                 # Node.js/TypeScript backend
│   ├── src/
│   │   ├── ai/             # AI agent logic
│   │   ├── solana/         # Solana operations (token, NFT)
│   │   ├── agent/          # Core agent orchestrator
│   │   ├── index.ts        # Express API server
│   │   └── cli.ts          # CLI interface
│   └── package.json
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts (Wallet)
│   │   ├── services/       # API services
│   │   └── App.tsx
│   └── package.json
├── shared/                 # Shared types and configs
│   ├── src/
│   │   ├── types.ts
│   │   └── config.ts
│   └── package.json
├── package.json            # Root workspace config
└── README.md
```

## Support

- telegram: https://t.me/az_tekDev
- twitter:  https://x.com/az_tekDev
