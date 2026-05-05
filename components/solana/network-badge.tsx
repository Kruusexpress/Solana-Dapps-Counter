"use client"

import { useConnection } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"

export function NetworkBadge() {
  const { connection } = useConnection()
  const [slot, setSlot] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchSlot = async () => {
      try {
        const currentSlot = await connection.getSlot()
        if (mounted) setSlot(currentSlot)
      } catch {
        // ignore
      }
    }

    fetchSlot()
    const interval = setInterval(fetchSlot, 5000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [connection])

  return (
    <div className="hidden items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 sm:flex">
      <div className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
      </div>
      <span className="text-xs font-medium text-muted-foreground">Devnet</span>
      {slot && (
        <span className="text-xs font-mono text-muted-foreground/60">
          #{slot.toLocaleString()}
        </span>
      )}
    </div>
  )
}
