# ⚡ Solana Counter dApp — SPL Token Mint on Every Click

> **Increment or Decrement a counter on-chain. Mint 1 SPL Token per click. Built on Solana with Anchor.**

---

## 📸 Overview

A fully on-chain Solana counter program that mints **1 SPL Token** every time the counter is incremented or decremented. Each click costs a small amount of SOL for the transaction fee and triggers a mint directly to the connected wallet.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Blockchain** | Solana (Devnet / Mainnet) |
| **Smart Contract** | Rust · Anchor Framework |
| **Token Standard** | SPL Token Program |
| **Frontend** | React · Next.js |
| **Wallet** | Phantom · Solflare · Backpack |
| **RPC** | Helius / QuickNode / Solana Public RPC |
| **Package Manager** | yarn / npm |

---

## 🗂️ Project Structure

```
solana-counter-spl/
├── programs/
│   └── counter/
│       └── src/
│           └── lib.rs          # Anchor smart contract (counter + mint logic)
├── tests/
│   └── counter.ts              # Anchor TypeScript integration tests
├── app/
│   ├── components/
│   │   ├── Counter.tsx         # Main counter UI component
│   │   └── WalletConnect.tsx   # Wallet adapter wrapper
│   ├── pages/
│   │   └── index.tsx           # Entry page
│   └── utils/
│       └── anchor.ts           # Anchor provider setup
├── migrations/
│   └── deploy.ts               # Deployment script
├── Anchor.toml                 # Anchor config
└── README.md
```

---

## ⚙️ How It Works

### Counter Logic
- The on-chain program stores a **`count: i64`** inside a PDA (Program Derived Address) account tied to the user's wallet.
- Calling **`increment`** adds `+1` to the counter and mints **1 SPL Token** to the user's ATA (Associated Token Account).
- Calling **`decrement`** subtracts `-1` from the counter and mints **1 SPL Token** to the user's ATA.

### SPL Token Mint
- A **Token Mint** is initialized once (PDA-controlled, no external authority).
- The program holds the **Mint Authority** via a PDA — no private key required.
- Each `increment` or `decrement` instruction calls `mint_to` to issue exactly **1 token (1 × 10^decimals)** per transaction.

---

## 🚀 Getting Started

### Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest && avm use latest

# Install Node dependencies
yarn install
```

### Configure Solana CLI

```bash
# Use Devnet for development
solana config set --url devnet

# Generate a new keypair (or use existing)
solana-keygen new --outfile ~/.config/solana/id.json

# Airdrop SOL for fees
solana airdrop 2
```

---

## 🔨 Build & Deploy

```bash
# Build the Anchor program
anchor build

# Deploy to Devnet
anchor deploy

# Run TypeScript tests
anchor test
```

After deploy, copy the **Program ID** from the output and update:

- `Anchor.toml` → `[programs.devnet]`
- `app/utils/anchor.ts` → `PROGRAM_ID`
- `programs/counter/src/lib.rs` → `declare_id!("YOUR_PROGRAM_ID")`

---

## 🖥️ Run the Frontend

```bash
cd app
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> Make sure **Phantom**, **Solflare**, or **Backpack** is installed and connected to **Devnet**.

---

## 📜 Program Instructions

### `initialize`
Creates the counter PDA and initializes the SPL Token Mint.

| Account | Role |
|---|---|
| `user` | Signer / Payer |
| `counter` | PDA — stores count |
| `mint` | PDA — SPL Token Mint |
| `token_program` | SPL Token Program |
| `system_program` | System Program |
| `rent` | Rent Sysvar |

---

### `increment`
Adds `+1` to count. Mints 1 SPL Token to user's ATA.

| Account | Role |
|---|---|
| `user` | Signer |
| `counter` | PDA — mutable |
| `mint` | PDA — Mint Authority |
| `user_token_account` | ATA — receives minted token |
| `token_program` | SPL Token Program |
| `associated_token_program` | ATA Program |

---

### `decrement`
Subtracts `-1` from count. Mints 1 SPL Token to user's ATA.

Same accounts as `increment`.

---

## 🔑 Key PDAs

```rust
// Counter PDA
seeds = [b"counter", user.key().as_ref()]

// Mint PDA (Mint Authority)
seeds = [b"mint", user.key().as_ref()]
```

---

## 🧪 Testing

```bash
anchor test
```

Tests cover:
- ✅ Initialize counter and mint
- ✅ Increment counter → verify count + token balance
- ✅ Decrement counter → verify count + token balance
- ✅ Multiple sequential increments
- ✅ Counter boundary / underflow checks

---

## 🌐 Switching to Mainnet

1. Update `Anchor.toml`:
   ```toml
   [provider]
   cluster = "mainnet"
   ```

2. Update RPC in `app/utils/anchor.ts`:
   ```ts
   const connection = new Connection("https://your-mainnet-rpc-url");
   ```

3. Fund your deploy wallet with real SOL, then:
   ```bash
   anchor deploy --provider.cluster mainnet
   ```

---

## 🛡️ Security Notes

- Mint authority is held by a **PDA** — no centralized key can rug the mint.
- Counter PDA is user-scoped — each wallet has its own isolated counter.
- All accounts are validated with Anchor's `#[account]` constraints.
- Consider adding a **max supply cap** in the mint logic before mainnet deployment.

---

## 📄 License

MIT — free to fork, modify, and deploy.

---

## 🙌 Built By

**Alexander** — Web3 Developer · Solana Builder · [@KRUUS EXPRESS](https://github.com/)

> *Built with Anchor · Powered by Solana · Every click mints.*
