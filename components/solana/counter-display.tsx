"use client"

import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { useState, useCallback, useEffect } from "react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import {
  fetchCounterValue,
  createInitializeInstruction,
  createIncrementInstruction,
  createDecrementInstruction,
  buildTransaction,
} from "@/lib/counter-program"
import { Plus, Minus, RotateCcw, Loader2, ArrowUpRight, FlaskConical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TransactionLog, type TxLogEntry } from "@/components/solana/transaction-log"

// --- Demo mode counter (no wallet needed) ---
function DemoCounter() {
  const [count, setCount] = useState(0)
  const [txLogs, setTxLogs] = useState<TxLogEntry[]>([])

  const fakeSig = () =>
    Array.from({ length: 64 }, () =>
      "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"[
        Math.floor(Math.random() * 58)
      ]
    ).join("")

  const addLog = (type: TxLogEntry["type"], sig: string) => {
    const entry: TxLogEntry = { type, signature: sig, status: "confirming", timestamp: Date.now() }
    setTxLogs((prev) => [entry, ...prev].slice(0, 10))
    setTimeout(() => {
      setTxLogs((prev) =>
        prev.map((l) => (l.signature === sig ? { ...l, status: "confirmed" } : l))
      )
    }, 800)
  }

  const handleIncrement = () => {
    setCount((c) => c + 1)
    addLog("increment", fakeSig())
  }

  const handleDecrement = () => {
    if (count === 0) return
    setCount((c) => c - 1)
    addLog("decrement", fakeSig())
  }

  const handleReset = () => {
    setCount(0)
    addLog("initialize", fakeSig())
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Demo mode banner */}
      <div className="flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3">
        <FlaskConical className="h-4 w-4 shrink-0 text-accent" />
        <div>
          <p className="text-sm font-medium text-foreground">Demo Mode</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Connect a Phantom or Solflare wallet (set to Devnet) to use the real on-chain counter.
          </p>
        </div>
      </div>

      {/* Counter card */}
      <div className="rounded-xl border border-border bg-card p-8">
        <div className="flex flex-col items-center gap-6">
          <p className="text-sm font-medium text-muted-foreground">Current Count</p>

          <div className="relative flex h-36 w-36 items-center justify-center rounded-2xl border border-border bg-secondary">
            <div className="absolute inset-0 rounded-2xl bg-primary/5" />
            <span className="relative text-6xl font-bold font-mono text-foreground">
              {count}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleDecrement}
              disabled={count === 0}
              variant="outline"
              size="lg"
              className="h-12 w-12 rounded-xl border-border p-0"
            >
              <Minus className="h-5 w-5" />
              <span className="sr-only">Decrement counter</span>
            </Button>

            <Button
              onClick={handleIncrement}
              size="lg"
              className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="mr-2 h-5 w-5" />
              Increment
            </Button>

            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="h-12 w-12 rounded-xl border-border p-0"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="sr-only">Reset counter</span>
            </Button>
          </div>
        </div>
      </div>

      <TransactionLog logs={txLogs} />
    </div>
  )
}

// --- On-chain counter (wallet connected) ---
function OnChainCounter() {
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const [count, setCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState<string>("")
  const [balance, setBalance] = useState<number | null>(null)
  const [initialized, setInitialized] = useState(false)
  const [txLogs, setTxLogs] = useState<TxLogEntry[]>([])

  const fetchData = useCallback(async () => {
    if (!publicKey || !connection) return
    try {
      const [counterValue, bal] = await Promise.all([
        fetchCounterValue(connection, publicKey),
        connection.getBalance(publicKey),
      ])
      setBalance(bal / LAMPORTS_PER_SOL)
      if (counterValue !== null) {
        setCount(counterValue)
        setInitialized(true)
      } else {
        setCount(null)
        setInitialized(false)
      }
    } catch {
      // ignore
    }
  }, [publicKey, connection])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 8000)
    return () => clearInterval(interval)
  }, [fetchData])

  const addLog = useCallback((entry: TxLogEntry) => {
    setTxLogs((prev) => [entry, ...prev].slice(0, 10))
  }, [])

  const sendTx = useCallback(
    async (
      type: TxLogEntry["type"],
      getInstruction: () => Promise<Parameters<typeof buildTransaction>[1]>
    ) => {
      if (!publicKey || !connection) return
      setLoading(true)
      setAction(
        type === "initialize"
          ? "Initializing..."
          : type === "increment"
          ? "Incrementing..."
          : "Decrementing..."
      )
      try {
        const instruction = await getInstruction()
        const transaction = await buildTransaction(connection, instruction, publicKey)
        const signature = await sendTransaction(transaction, connection)
        addLog({ type, signature, status: "confirming", timestamp: Date.now() })
        await connection.confirmTransaction(signature, "confirmed")
        addLog({ type, signature, status: "confirmed", timestamp: Date.now() })
        if (type === "initialize") { setCount(0); setInitialized(true) }
        await fetchData()
      } catch (err) {
        const error = err instanceof Error ? err.message : "Transaction failed"
        addLog({ type, signature: "", status: "error", timestamp: Date.now(), error })
      } finally {
        setLoading(false)
        setAction("")
      }
    },
    [publicKey, connection, sendTransaction, fetchData, addLog]
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Balance card */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Wallet Balance</p>
            <p className="mt-1 text-2xl font-semibold font-mono text-foreground">
              {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}
            </p>
          </div>
          <a
            href="https://faucet.solana.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-secondary"
          >
            Airdrop SOL
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Counter card */}
      <div className="rounded-xl border border-border bg-card p-8">
        <div className="flex flex-col items-center gap-6">
          <p className="text-sm font-medium text-muted-foreground">
            {initialized ? "Current Count" : "Counter Not Initialized"}
          </p>

          <div className="relative flex h-36 w-36 items-center justify-center rounded-2xl border border-border bg-secondary">
            <div className="absolute inset-0 rounded-2xl bg-primary/5" />
            {loading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">{action}</span>
              </div>
            ) : (
              <span className="relative text-6xl font-bold font-mono text-foreground">
                {count !== null ? count : "?"}
              </span>
            )}
          </div>

          {!initialized ? (
            <Button
              onClick={() => sendTx("initialize", () => createInitializeInstruction(publicKey!))}
              disabled={loading}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Initializing...</>
              ) : (
                "Initialize Counter"
              )}
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                onClick={() => sendTx("decrement", () => createDecrementInstruction(publicKey!))}
                disabled={loading || count === 0}
                variant="outline"
                size="lg"
                className="h-12 w-12 rounded-xl border-border p-0"
              >
                <Minus className="h-5 w-5" />
                <span className="sr-only">Decrement counter</span>
              </Button>
              <Button
                onClick={() => sendTx("increment", () => createIncrementInstruction(publicKey!))}
                disabled={loading}
                size="lg"
                className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="mr-2 h-5 w-5" />
                Increment
              </Button>
              <Button
                onClick={fetchData}
                disabled={loading}
                variant="outline"
                size="lg"
                className="h-12 w-12 rounded-xl border-border p-0"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">Refresh counter</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <TransactionLog logs={txLogs} />
    </div>
  )
}

// --- Root export: switches between demo and on-chain ---
export function CounterDisplay() {
  const { connected } = useWallet()
  return connected ? <OnChainCounter /> : <DemoCounter />
}
