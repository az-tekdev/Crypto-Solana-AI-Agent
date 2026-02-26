/**
 * Constants used throughout the application
 */

// Common Solana token mints
export const SOL_MINT = 'So11111111111111111111111111111111111111112';
export const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
export const USDT_MINT = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';

// Jupiter API endpoints
export const JUPITER_QUOTE_API = 'https://quote-api.jup.ag/v6/quote';
export const JUPITER_SWAP_API = 'https://quote-api.jup.ag/v6/swap';

// Default values
export const DEFAULT_SLIPPAGE_BPS = 50; // 0.5%
export const DEFAULT_DECIMALS = 9;
export const DEFAULT_ROYALTY_BPS = 500; // 5%

// Transaction timeouts
export const TX_CONFIRMATION_TIMEOUT = 60000; // 60 seconds
export const TX_POLL_INTERVAL = 1000; // 1 second
