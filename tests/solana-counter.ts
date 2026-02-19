import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaCounter } from "../target/types/solana_counter";
import { expect } from "chai";

describe("solana-counter", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SolanaCounter as Program<SolanaCounter>;

  let counterAccount: anchor.web3.Keypair;

  before(async () => {
    counterAccount = anchor.web3.Keypair.generate();
  });

  it("Initializes counter to 0", async () => {
    const tx = await program.methods
      .initialize()
      .accounts({
        counter: counterAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([counterAccount])
      .rpc();
    console.log("Initialize tx:", tx);
    const counter = await program.account.counter.fetch(counterAccount.publicKey);
    expect(counter.count.toString()).to.equal("0");
  });

  it("Initializes counter with name", async () => {
    const counterWithName = anchor.web3.Keypair.generate();
    const tx = await program.methods
      .initializeWithName("MyCounter")
      .accounts({
        counter: counterWithName.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([counterWithName])
      .rpc();
    console.log("Initialize with name tx:", tx);
    const counter = await program.account.counter.fetch(counterWithName.publicKey);
    expect(counter.count.toString()).to.equal("0");
    expect(counter.name).to.equal("MyCounter");
  });

  it("Increments counter", async () => {
    const tx = await program.methods
      .increment()
      .accounts({
        counter: counterAccount.publicKey,
        owner: provider.wallet.publicKey,
      })
      .rpc();
    console.log("Increment tx:", tx);
    const counter = await program.account.counter.fetch(counterAccount.publicKey);
    expect(counter.count.toString()).to.equal("1");
  });

  it("Increments counter by amount", async () => {
    const tx = await program.methods
      .incrementBy(new anchor.BN(5))
      .accounts({
        counter: counterAccount.publicKey,
        owner: provider.wallet.publicKey,
      })
      .rpc();
    console.log("Increment by tx:", tx);
    const counter = await program.account.counter.fetch(counterAccount.publicKey);
    expect(counter.count.toString()).to.equal("6");
  });

  it("Decrements counter", async () => {
    const tx = await program.methods
      .decrement()
      .accounts({
        counter: counterAccount.publicKey,
        owner: provider.wallet.publicKey,
      })
      .rpc();
    console.log("Decrement tx:", tx);
    const counter = await program.account.counter.fetch(counterAccount.publicKey);
    expect(counter.count.toString()).to.equal("5");
  });

  it("Decrements counter by amount", async () => {
    const tx = await program.methods
      .decrementBy(new anchor.BN(3))
      .accounts({
        counter: counterAccount.publicKey,
        owner: provider.wallet.publicKey,
      })
      .rpc();
    console.log("Decrement by tx:", tx);
    const counter = await program.account.counter.fetch(counterAccount.publicKey);
    expect(counter.count.toString()).to.equal("2");
  });

  it("Resets counter", async () => {
    for (let i = 0; i < 3; i++) {
      await program.methods
        .increment()
        .accounts({
          counter: counterAccount.publicKey,
          owner: provider.wallet.publicKey,
        })
        .rpc();
    }
    const tx = await program.methods
      .reset()
      .accounts({
        counter: counterAccount.publicKey,
        owner: provider.wallet.publicKey,
      })
      .rpc();
    console.log("Reset tx:", tx);
    const counter = await program.account.counter.fetch(counterAccount.publicKey);
    expect(counter.count.toString()).to.equal("0");
  });

  it("Sets counter to specific value", async () => {
    const tx = await program.methods
      .set(new anchor.BN(42))
      .accounts({
        counter: counterAccount.publicKey,
        owner: provider.wallet.publicKey,
      })
      .rpc();
    console.log("Set tx:", tx);
    const counter = await program.account.counter.fetch(counterAccount.publicKey);
    expect(counter.count.toString()).to.equal("42");
  });

  it("Prevents unauthorized updates", async () => {
    const otherUser = anchor.web3.Keypair.generate();
    try {
      await program.methods
        .increment()
        .accounts({
          counter: counterAccount.publicKey,
          owner: otherUser.publicKey,
        })
        .signers([otherUser])
        .rpc();
      expect.fail("Should have thrown an error");
    } catch (err: any) {
      expect(err.message).to.include("failed to send transaction");
    }
  });
});
