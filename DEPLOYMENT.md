# Deployment Instructions for Solana Dapps Counter

## Prerequisites
- Ensure you have the following installed:
  - Node.js (version X.X.X or later)
  - npm (Node Package Manager)
  - Solana CLI
  - Rust (recommended version)
  - Yarn (optional)

## Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Kruusexpress/Solana-Dapps-Counter.git
   cd Solana-Dapps-Counter
   ```
   
2. Install dependencies:
   ```bash
   npm install
   ```

## Testing on Devnet
1. Set your Solana CLI configuration to devnet:
   ```bash
   solana config set --url devnet
   ```

2. Deploy the program to devnet:
   ```bash
   anchor deploy
   ```

3. Run the test suite:
   ```bash
   npm test
   ```

## Deployment Procedures
1. Set your Solana CLI configuration to mainnet:
   ```bash
   solana config set --url mainnet
   ```

2. Deploy the program to mainnet:
   ```bash
   anchor deploy
   ```

3. Update any necessary environment variables for production.

## Verification Steps
- Verify the deployment using:
  ```bash
  solana program show <PROGRAM_ID>
  ```
  
- Ensure the program is correctly listed and active on the mainnet.

## Troubleshooting Guide
- **Issue**: Program fails to deploy.
  - **Solution**: Check your Solana CLI configuration and ensure you have sufficient funds on your wallet.
  
- **Issue**: Tests fail on devnet.
  - **Solution**: Double-check your configurations and ensure all dependencies are installed properly.
  
- **Issue**: Cannot access program after deployment.
  - **Solution**: Confirm the program ID is correct and check network status.
