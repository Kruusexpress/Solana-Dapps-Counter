"use client"

// Suppress wallet adapter errors BEFORE any imports
if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (event) => {
    const msg = event.reason?.message || event.reason?.toString?.() || ""
    if (
      typeof msg === "string" &&
      (msg.includes("mobile wallet protocol") ||
        msg.includes("WalletConnectionError") ||
        msg.includes("WalletNotReadyError") ||
        msg.includes("WalletNotFoundError"))
    ) {
      event.preventDefault()
    }
  })
}

import { WalletProvider } from "@/components/solana/wallet-provider"
import { Header } from "@/components/solana/header"
import { CounterDisplay } from "@/components/solana/counter-display"
import { InfoPanel } from "@/components/solana/info-panel"

export default function Home() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <CounterDisplay />
            <InfoPanel />
          </div>
        </main>
        <footer className="border-t border-border py-6">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4">
            <p className="text-xs text-muted-foreground">
              Built on Solana Devnet
            </p>
            <a
              href="https://explorer.solana.com/?cluster=devnet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              Solana Explorer
            </a>
          </div>
        </footer>
      </div>
    </WalletProvider>
  )
}
