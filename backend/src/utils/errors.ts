/**
 * Custom error classes for the agent
 */

export class InsufficientFundsError extends Error {
  constructor(required: number, available: number) {
    super(`Insufficient funds: required ${required}, available ${available}`);
    this.name = 'InsufficientFundsError';
  }
}

export class TransactionFailedError extends Error {
  constructor(signature: string, reason?: string) {
    super(`Transaction failed: ${signature}${reason ? ` - ${reason}` : ''}`);
    this.name = 'TransactionFailedError';
  }
}

export class InvalidActionError extends Error {
  constructor(action: string) {
    super(`Invalid action: ${action}`);
    this.name = 'InvalidActionError';
  }
}

export class AIDecisionError extends Error {
  constructor(reason: string) {
    super(`AI decision failed: ${reason}`);
    this.name = 'AIDecisionError';
  }
}
