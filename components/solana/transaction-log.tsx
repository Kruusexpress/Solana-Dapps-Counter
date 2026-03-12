"use client"

import { ArrowUpRight, Check, X, Loader2 } from "lucide-react"

export type TxLogEntry = {
  type: "initialize" | "increment" | "decrement"
  signature: string
  status: "confirming" | "confirmed" | "error"
  timestamp: number
  error?: string
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

function StatusIcon({ status }: { status: TxLogEntry["status"] }) {
  if (status === "confirming") {
    return <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
  }
  if (status === "confirmed") {
    return (
      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/20">
        <Check className="h-3 w-3 text-primary" />
      </div>
    )
  }
  return (
    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-destructive/20">
      <X className="h-3 w-3 text-destructive" />
    </div>
  )
}

function TypeLabel({ type }: { type: TxLogEntry["type"] }) {
  const labels = {
    initialize: "Initialize",
    increment: "Increment",
    decrement: "Decrement",
  }
  return (
    <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
      {labels[type]}
    </span>
  )
}

export function TransactionLog({ logs }: { logs: TxLogEntry[] }) {
  if (logs.length === 0) return null

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-medium text-foreground">
          Transaction History
        </h3>
      </div>
      <div className="divide-y divide-border">
        {logs.map((log, i) => (
          <div
            key={`${log.signature}-${i}`}
            className="flex items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <StatusIcon status={log.status} />
              <TypeLabel type={log.type} />
              {log.error && (
                <span className="max-w-[200px] truncate text-xs text-destructive">
                  {log.error}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-mono">
                {formatTime(log.timestamp)}
              </span>
              {log.signature && (
                <a
                  href={`https://explorer.solana.com/tx/${log.signature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  {log.signature.slice(0, 8)}...
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
