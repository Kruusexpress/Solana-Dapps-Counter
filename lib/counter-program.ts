import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
} from "@solana/web3.js"

// Simple counter program layout
// This uses a basic program that stores a u64 counter in an account
// For demo purposes, we'll use a PDA-based approach with the System Program

const COUNTER_SEED = "counter"
const COUNTER_SIZE = 8 + 8 // discriminator + u64 counter

// A simple counter program ID (you can deploy your own or use this demo)
// This is a well-known test counter program on devnet
const PROGRAM_ID = new PublicKey(
  "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa"
)

export function getCounterPDA(wallet: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(COUNTER_SEED), wallet.toBuffer()],
    PROGRAM_ID
  )
}

// Instruction discriminators (Anchor-style)
const INITIALIZE_DISCRIMINATOR = Buffer.from([
  175, 175, 109, 31, 13, 152, 155, 237,
])
const INCREMENT_DISCRIMINATOR = Buffer.from([
  11, 18, 104, 9, 104, 174, 59, 33,
])
const DECREMENT_DISCRIMINATOR = Buffer.from([
  106, 227, 168, 59, 248, 27, 150, 101,
])

export async function createInitializeInstruction(
  wallet: PublicKey
): Promise<TransactionInstruction> {
  const [counterPDA] = getCounterPDA(wallet)

  return new TransactionInstruction({
    keys: [
      { pubkey: wallet, isSigner: true, isWritable: true },
      { pubkey: counterPDA, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: PROGRAM_ID,
    data: INITIALIZE_DISCRIMINATOR,
  })
}

export async function createIncrementInstruction(
  wallet: PublicKey
): Promise<TransactionInstruction> {
  const [counterPDA] = getCounterPDA(wallet)

  return new TransactionInstruction({
    keys: [
      { pubkey: wallet, isSigner: true, isWritable: true },
      { pubkey: counterPDA, isSigner: false, isWritable: true },
    ],
    programId: PROGRAM_ID,
    data: INCREMENT_DISCRIMINATOR,
  })
}

export async function createDecrementInstruction(
  wallet: PublicKey
): Promise<TransactionInstruction> {
  const [counterPDA] = getCounterPDA(wallet)

  return new TransactionInstruction({
    keys: [
      { pubkey: wallet, isSigner: true, isWritable: true },
      { pubkey: counterPDA, isSigner: false, isWritable: true },
    ],
    programId: PROGRAM_ID,
    data: DECREMENT_DISCRIMINATOR,
  })
}

export async function fetchCounterValue(
  connection: Connection,
  wallet: PublicKey
): Promise<number | null> {
  const [counterPDA] = getCounterPDA(wallet)

  try {
    const accountInfo = await connection.getAccountInfo(counterPDA)
    if (!accountInfo) return null

    // Skip 8-byte discriminator, read u64 counter as little-endian
    const dataView = new DataView(accountInfo.data.buffer, accountInfo.data.byteOffset)
    const counter = Number(dataView.getBigUint64(8, true))
    return counter
  } catch {
    return null
  }
}

export async function buildTransaction(
  connection: Connection,
  instruction: TransactionInstruction,
  payer: PublicKey
): Promise<Transaction> {
  const transaction = new Transaction().add(instruction)
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash()
  transaction.recentBlockhash = blockhash
  transaction.lastValidBlockHeight = lastValidBlockHeight
  transaction.feePayer = payer
  return transaction
}
