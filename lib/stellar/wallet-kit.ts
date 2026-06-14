/**
 * Singleton wrapper for the Stellar Wallets Kit v2.
 * Must be used only in client-side code (useEffect, onClick, etc.)
 * because it relies on browser APIs / wallet extensions.
 */

import { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit'

let _initialized = false

export async function initStellarWalletsKit(): Promise<void> {
  if (_initialized) return
  _initialized = true

  const { StellarWalletsKit } = await import('@creit.tech/stellar-wallets-kit')
  const { defaultModules } = await import('@creit.tech/stellar-wallets-kit/modules/utils')

  StellarWalletsKit.init({ modules: defaultModules() })
}

/**
 * Opens the wallet selector modal. Returns the connected address.
 * Throws if the user closes the modal without selecting.
 */
export async function connectWallet(): Promise<string> {
  const { address } = await StellarWalletsKit.authModal()
  return address
}

/**
 * Returns the currently connected wallet address, or null if no wallet connected.
 */
export async function getConnectedAddress(): Promise<string | null> {
  try {
    const { address } = await StellarWalletsKit.getAddress()
    return address || null
  } catch {
    return null
  }
}

/**
 * Signs a Soroban transaction XDR with the connected wallet.
 * @param txXdr  - Base-64 XDR of the transaction to sign
 * @param address - The wallet address that should sign
 * @param networkPassphrase - e.g. Networks.TESTNET or Networks.PUBLIC
 */
export async function signTransaction(
  txXdr: string,
  address: string,
  networkPassphrase: string,
): Promise<string> {
  const { signedTxXdr } = await StellarWalletsKit.signTransaction(txXdr, { networkPassphrase, address })
  return signedTxXdr
}
