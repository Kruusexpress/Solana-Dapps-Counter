"use client"

// Register BEFORE any wallet-adapter imports so it catches the
// mobile-wallet-protocol rejection that fires at module-evaluation time.
if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (event) => {
    const msg = event.reason?.message || event.reason?.toString?.() || ""
    if (
      typeof msg === "string" &&
      (msg.includes("mobile wallet protocol") ||
        msg.includes("WalletConnectionError") ||
        msg.includes("WalletNotReadyError"))
    ) {
      event.preventDefault()
    }
  })
}

import { useMemo, useCallback, type ReactNode } from "react"
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { type WalletError } from "@solana/wallet-adapter-base"
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets"
import { clusterApiUrl } from "@solana/web3.js"

import "@solana/wallet-adapter-react-ui/styles.css"

export function WalletProvider({ children }: { children: ReactNode }) {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), [])
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  )

  const onError = useCallback((error: WalletError) => {
    console.warn("Wallet error:", error.message)
  }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect={false} onError={onError}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}
