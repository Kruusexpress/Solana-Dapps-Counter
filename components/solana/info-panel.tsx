"use client"

import { Code, Github, ArrowUpRight } from "lucide-react"

export function InfoPanel() {
  return (
    <div className="flex flex-col gap-4">
      {/* How it works */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-medium text-foreground">How it works</h3>
        <div className="mt-4 flex flex-col gap-3">
          <Step
            number={1}
            title="Connect Wallet"
            description="Connect your Solana wallet (Phantom, Solflare, etc.)"
          />
          <Step
            number={2}
            title="Initialize Counter"
            description="Create your on-chain counter account via a transaction"
          />
          <Step
            number={3}
            title="Increment / Decrement"
            description="Each button press sends a transaction to update the counter"
          />
        </div>
      </div>

      {/* Tech stack */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-medium text-foreground">Tech Stack</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "Next.js",
            "Solana Web3.js",
            "Wallet Adapter",
            "Anchor",
            "TypeScript",
            "Tailwind CSS",
          ].map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-medium text-foreground">Resources</h3>
        <div className="mt-3 flex flex-col gap-2">
          <ResourceLink
            icon={<Code className="h-4 w-4" />}
            label="Solana Docs"
            href="https://solana.com/docs"
          />
          <ResourceLink
            icon={<Github className="h-4 w-4" />}
            label="Wallet Adapter"
            href="https://github.com/anza-xyz/wallet-adapter"
          />
          <ResourceLink
            icon={<ArrowUpRight className="h-4 w-4" />}
            label="Solana Explorer"
            href="https://explorer.solana.com/?cluster=devnet"
          />
        </div>
      </div>
    </div>
  )
}

function Step({
  number,
  title,
  description,
}: {
  number: number
  title: string
  description: string
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
        {number}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}

function ResourceLink({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode
  label: string
  href: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      {icon}
      {label}
      <ArrowUpRight className="ml-auto h-3.5 w-3.5" />
    </a>
  )
}
