/**
 * Backend API server
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { Agent } from './agent/core';
import { AgentAction } from '@crypto-solana-ai-agent/shared';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// Initialize agent
const agent = new Agent();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Execute prompt endpoint
app.post('/api/execute-prompt', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required and must be a string' });
    }

    const action = await agent.executePrompt(prompt);
    res.json(action);
  } catch (error) {
    console.error('Execute prompt error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get action by ID
app.get('/api/action/:id', (req, res) => {
  try {
    const action = agent.getAction(req.params.id);
    if (!action) {
      return res.status(404).json({ error: 'Action not found' });
    }
    res.json(action);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get all actions
app.get('/api/actions', (req, res) => {
  try {
    const actions = agent.getAllActions();
    res.json(actions);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get wallet info
app.get('/api/wallet', async (req, res) => {
  try {
    const publicKey = agent.getWalletPublicKey();
    const balance = await agent.getBalance();
    res.json({ publicKey, balance });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Crypto-Solana-AI-Agent backend running on http://localhost:${PORT}`);
  console.log(`📝 Wallet: ${agent.getWalletPublicKey()}`);
});
