"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Wallet, LogOut, Copy, Check } from "lucide-react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"

export function WalletButton() {
  const { publicKey, disconnect, connected, connecting } = useWallet()
  const { setVisible } = useWalletModal()
  const [copied, setCopied] = useState(false)

  const handleConnect = useCallback(() => {
    setVisible(true)
  }, [setVisible])

  const handleCopyAddress = useCallback(() => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [publicKey])

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopyAddress}
          className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-sm font-mono text-foreground transition-colors hover:bg-secondary/80"
        >
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span>
            {publicKey.toBase58().slice(0, 4)}...
            {publicKey.toBase58().slice(-4)}
          </span>
          {copied ? (
            <Check className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>
        <Button
          variant="ghost"
          size="icon"
          onClick={disconnect}
          className="text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Disconnect wallet</span>
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={connecting}
      className="bg-primary text-primary-foreground hover:bg-primary/90"
    >
      <Wallet className="mr-2 h-4 w-4" />
      {connecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
