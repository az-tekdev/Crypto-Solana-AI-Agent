/**
 * NFT operations: mint, transfer
 */

import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  CreateNftInput,
  Nft,
} from '@metaplex-foundation/js';
import { NFTMintParams, NFTTransferParams } from '@crypto-solana-ai-agent/shared';

export class NFTOperations {
  private metaplex: Metaplex;

  constructor(
    private connection: Connection,
    private wallet: Keypair
  ) {
    this.metaplex = Metaplex.make(this.connection)
      .use(keypairIdentity(this.wallet))
      .use(
        bundlrStorage({
          address: 'https://devnet.bundlr.network',
          providerUrl: this.connection.rpcEndpoint,
          timeout: 60000,
        })
      );
  }

  /**
   * Mint an NFT
   */
  async mint(params: NFTMintParams): Promise<{ mint: string; signature: string }> {
    try {
      // Fetch image if URI provided
      let imageUri = params.imageUri;
      if (params.imageUri && !params.imageUri.startsWith('http')) {
        // If it's a local file path, you'd need to upload it first
        // For demo, we'll use the URI as-is
        imageUri = params.imageUri;
      }

      const nftInput: CreateNftInput = {
        name: params.name,
        symbol: params.symbol,
        description: params.description || `AI-generated NFT: ${params.name}`,
        image: imageUri,
        sellerFeeBasisPoints: 500, // 5% royalty
        creators: [
          {
            address: this.wallet.publicKey,
            share: 100,
          },
        ],
      };

      // Add attributes if provided
      if (params.attributes && params.attributes.length > 0) {
        nftInput.properties = {
          attributes: params.attributes,
        };
      }

      const { nft, response } = await this.metaplex.nfts().create(nftInput);

      return {
        mint: nft.address.toBase58(),
        signature: response.signature,
      };
    } catch (error) {
      console.error('NFT mint error:', error);
      throw new Error(`NFT mint failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Transfer an NFT
   */
  async transfer(params: NFTTransferParams): Promise<string> {
    try {
      const mintAddress = new PublicKey(params.mintAddress);
      const recipient = new PublicKey(params.recipient);

      // Get the NFT
      const nft = await this.metaplex.nfts().findByMint({ mintAddress });

      // Get the token account
      const sourceTokenAccount = await this.metaplex
        .tokens()
        .findTokenByMint({ mint: mintAddress, owner: this.wallet.publicKey });

      if (!sourceTokenAccount) {
        throw new Error('NFT not found in wallet');
      }

      // Transfer using Metaplex
      const { response } = await this.metaplex.nfts().transfer({
        nftOrSft: nft,
        toOwner: recipient,
      });

      return response.signature;
    } catch (error) {
      console.error('NFT transfer error:', error);
      throw new Error(`NFT transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get NFT metadata
   */
  async getNFT(mintAddress: string): Promise<Nft | null> {
    try {
      const mint = new PublicKey(mintAddress);
      const nft = await this.metaplex.nfts().findByMint({ mintAddress: mint });
      return nft;
    } catch (error) {
      console.error('Get NFT error:', error);
      return null;
    }
  }
}
