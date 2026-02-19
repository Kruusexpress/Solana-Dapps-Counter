# Solana Counter Program

## Overview
The Solana Counter Program is a simple smart contract deployed on the Solana blockchain that counts the number of times it has been invoked. This serves as an introductory example of using Solana's programming model and understanding the basics of building on the Solana blockchain.

## Features
- **Increment Counter**: The program allows users to increment a counter.
- **Get Counter**: Users can retrieve the current value of the counter.

## Getting Started
### Prerequisites
- Install Rust: The Solana program is written in Rust. You will need to install Rust and Cargo to build and run the project.
- Install Solana CLI: Install the Solana Command Line Interface (CLI) for interacting with the Solana blockchain.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Kruusexpress/Solana-Dapps-Counter.git
   cd Solana-Dapps-Counter
   ```
2. Build the program:
   ```bash
   cargo build-bpf
   ```
3. Deploy the program to a Solana cluster:
   ```bash
   solana program deploy target/deploy/counter.so
   ```

## Usage
### Incrementing the Counter
To increment the counter, you can send a transaction that invokes the program. For example:
```bash
solana program invoke [program_id]
```
Replace `[program_id]` with the actual program ID after deployment.

### Retrieving the Counter
To get the current counter value, use the following command:
```bash
solana account [account_id]
```
Replace `[account_id]` with the account holding the counter data.

## Conclusion
The Solana Counter Program demonstrates the basic principles of writing and deploying a smart contract on the Solana blockchain. It helps in understanding transactions, program deployment, and interacting with accounts on Solana.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.