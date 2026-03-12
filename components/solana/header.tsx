"use client"

import { WalletButton } from "@/components/solana/wallet-button"
import { NetworkBadge } from "@/components/solana/network-badge"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                d="M4 17h16M4 12h16M4 7h16"
                className="text-primary"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground leading-none">
              Solana Counter
            </h1>
            <p className="text-xs text-muted-foreground">On-chain dApp</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <NetworkBadge />
          <WalletButton />
        </div>
      </div>
    </header>
  )
}
