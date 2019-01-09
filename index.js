
import bip39 from 'bip39';
import { SeedAdapter } from '@waves/signature-adapter';
import { order } from 'waves-transactions';

/**
 * Create a new wallet
 * @param {string} seed Phrase with 15 words.
 * @return {object} Data with wallet info.
*/
export const newWallet = () =>
  new Promise((resolve, reject) => {
    const words = bip39.generateMnemonic(160); // Generate words
    const adapter = new SeedAdapter(words).seed; // Generate wallet

    resolve(adapter);

    reject(new Error('Erro ao criar carteira'));
  });

/**
 * Recovery a existing wallet with the seed
 * @param {string} seed Phrase with 15 words.
 * @return {object} Data with wallet info.
*/
export const recoveryWallet = seed => {
  const adapter = new SeedAdapter(seed).seed;

  return adapter;
};

/**
 * Parse formated order data
 * @param {string} priceAsset Currency to pay on order.
 * @param {string} amount Number of tokens to be purchased.
 * @param {object} wallet Wallet data with seed and keyPair.
 * @return {object} Data with info of transaction parsed to valid format.
*/
export const signOrder = (priceAsset, amount, wallet) => {
  if (typeof amount !== 'number') {
    throw new Error('Value for {amount} is invalid.');
  }

  if (priceAsset.length !== 44 || priceAsset.length !== 5) {
    throw new Error('The currency defined on {priceAsset} is invalid.');
  }

  const parsedData = {
    amount: amount * 100000000,
    amountAsset: '7p2ggpe4iZ9Sb6wQAfYyszGBv7EhoyW13G7hsgCZyzNU',
    price: 100,
    priceAsset,
    matcherPublicKey: '7kPFrHDiGw1rCm7LPszuECwWYL3dMf6iMifLRDJQZMzy',
    orderType: 'buy',
    senderPublicKey: wallet.keyPair.publicKey,
    version: 1
  };

  if (priceAsset === 'WAVES') delete parsedData.priceAsset;

  return order(parsedData, wallet.phrase);
};
