/* eslint-disable */
/**
 * Soroban contract interaction utilities for the Stallion admin contract management page.
 * Handles reading on-chain state and building/submitting admin transactions.
 *
 * Uses @stellar/stellar-sdk (v15+) for transaction building and Soroban RPC calls.
 * Note: In v15+, the RPC server is exported as `rpc.Server` (not `SorobanRpc.Server`).
 */

// ---------------------------------------------------------------------------
// Constants – configured via environment variables
// ---------------------------------------------------------------------------
export const STELLAR_CONTRACT_ID = process.env.NEXT_PUBLIC_STELLAR_CONTRACT_ID ?? ''
export const STELLAR_RPC_URL =
  process.env.NEXT_PUBLIC_STELLAR_RPC_URL ?? 'https://soroban-testnet.stellar.org'
export const STELLAR_NETWORK_PASSPHRASE =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE ??
  'Test SDF Network ; September 2015'

// ---------------------------------------------------------------------------
// Helper: read a contract storage entry using getLedgerEntries
// ---------------------------------------------------------------------------

/**
 * Reads the current admin address stored on the Stallion contract.
 * DataKey::Admin = 4 (see types.rs)
 */
export async function readContractAdmin(): Promise<string | null> {
  try {
    const { Contract, rpc, scValToNative, xdr } = await import('@stellar/stellar-sdk')

    const server = new rpc.Server(STELLAR_RPC_URL, { allowHttp: true })
    const contract = new Contract(STELLAR_CONTRACT_ID)

    // DataKey::Admin = 4 encoded as u32
    const adminKey = xdr.ScVal.scvU32(4)
    const adminLedgerKey = xdr.LedgerKey.contractData(
      new xdr.LedgerKeyContractData({
        contract: contract.address().toScAddress(),
        key: adminKey,
        durability: xdr.ContractDataDurability.persistent(),
      }),
    )

    const result = await server.getLedgerEntries(adminLedgerKey)
    if (!result.entries || result.entries.length === 0) return null

    const entry = result.entries[0]
    const contractData = entry.val.contractData()
    const addressVal = scValToNative(contractData.val())

    if (typeof addressVal === 'string') return addressVal
    if (addressVal && typeof addressVal.toString === 'function') return addressVal.toString()
    return null
  } catch (err) {
    console.error('readContractAdmin error:', err)
    return null
  }
}

/**
 * Reads the current fee account address stored on the Stallion contract.
 * DataKey::FeeAccount = 5 (see types.rs)
 */
export async function readFeeAccount(): Promise<string | null> {
  try {
    const { Contract, rpc, scValToNative, xdr } = await import('@stellar/stellar-sdk')

    const server = new rpc.Server(STELLAR_RPC_URL, { allowHttp: true })
    const contract = new Contract(STELLAR_CONTRACT_ID)

    const feeAccountKey = xdr.ScVal.scvU32(5)
    const feeAccountLedgerKey = xdr.LedgerKey.contractData(
      new xdr.LedgerKeyContractData({
        contract: contract.address().toScAddress(),
        key: feeAccountKey,
        durability: xdr.ContractDataDurability.persistent(),
      }),
    )

    const result = await server.getLedgerEntries(feeAccountLedgerKey)
    if (!result.entries || result.entries.length === 0) return null

    const entry = result.entries[0]
    const contractData = entry.val.contractData()
    const addressVal = scValToNative(contractData.val())

    if (typeof addressVal === 'string') return addressVal
    if (addressVal && typeof addressVal.toString === 'function') return addressVal.toString()
    return null
  } catch (err) {
    console.error('readFeeAccount error:', err)
    return null
  }
}

// ---------------------------------------------------------------------------
// Transaction building helpers
// ---------------------------------------------------------------------------

/**
 * Builds and simulates an `update_admin` transaction.
 * Returns the prepared XDR ready to be signed by the wallet.
 */
export async function buildUpdateAdminTx(
  callerAddress: string,
  newAdminAddress: string,
): Promise<string> {
  const { Contract, rpc, TransactionBuilder, BASE_FEE, Address } =
    await import('@stellar/stellar-sdk')

  const server = new rpc.Server(STELLAR_RPC_URL, { allowHttp: true })
  const contract = new Contract(STELLAR_CONTRACT_ID)

  const account = await server.getAccount(callerAddress)
  const newAdminVal = new Address(newAdminAddress).toScVal()

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call('update_admin', newAdminVal))
    .setTimeout(30)
    .build()

  const simResult = await server.simulateTransaction(tx)
  if (rpc.Api.isSimulationError(simResult)) {
    throw new Error(`Simulation error: ${simResult.error}`)
  }

  const preparedTx = rpc.assembleTransaction(tx, simResult).build()
  return preparedTx.toXDR()
}

/**
 * Builds and simulates an `update_fee_account` transaction.
 * Returns the prepared XDR ready to be signed by the wallet.
 */
export async function buildUpdateFeeAccountTx(
  callerAddress: string,
  newFeeAccountAddress: string,
): Promise<string> {
  const { Contract, rpc, TransactionBuilder, BASE_FEE, Address } =
    await import('@stellar/stellar-sdk')

  const server = new rpc.Server(STELLAR_RPC_URL, { allowHttp: true })
  const contract = new Contract(STELLAR_CONTRACT_ID)

  const account = await server.getAccount(callerAddress)
  const newFeeAccountVal = new Address(newFeeAccountAddress).toScVal()

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call('update_fee_account', newFeeAccountVal))
    .setTimeout(30)
    .build()

  const simResult = await server.simulateTransaction(tx)
  if (rpc.Api.isSimulationError(simResult)) {
    throw new Error(`Simulation error: ${simResult.error}`)
  }

  const preparedTx = rpc.assembleTransaction(tx, simResult).build()
  return preparedTx.toXDR()
}

/**
 * Submits a signed transaction XDR to the Soroban RPC and waits for confirmation.
 */
export async function submitSignedTx(
  signedXdr: string,
): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    const { rpc, Transaction } = await import('@stellar/stellar-sdk')

    const server = new rpc.Server(STELLAR_RPC_URL, { allowHttp: true })
    const tx = new Transaction(signedXdr, STELLAR_NETWORK_PASSPHRASE)

    const sendResult = await server.sendTransaction(tx)
    if (sendResult.status === 'ERROR') {
      return {
        success: false,
        error: sendResult.errorResult?.result().toString() ?? 'Transaction error',
      }
    }

    const hash = sendResult.hash

    // Poll for completion
    let getResult = await server.getTransaction(hash)
    const maxAttempts = 20
    let attempts = 0

    while (getResult.status === 'NOT_FOUND' && attempts < maxAttempts) {
      await new Promise((r) => setTimeout(r, 1500))
      getResult = await server.getTransaction(hash)
      attempts++
    }

    if (getResult.status === 'SUCCESS') {
      return { success: true, hash }
    }

    return {
      success: false,
      error:
        getResult.status === 'FAILED'
          ? 'Transaction failed on-chain'
          : 'Transaction timed out',
    }
  } catch (error) {
    const err = error as Error
    return { success: false, error: err?.message ?? 'Unknown error' }
  }
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

const STELLAR_ADDRESS_REGEX = /^G[A-Z2-7]{55}$/

export function isValidStellarAddress(address: string): boolean {
  return STELLAR_ADDRESS_REGEX.test(address.trim())
}

export function truncateAddress(address: string, chars = 6): string {
  if (!address || address.length < chars * 2) return address
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}
