# Casper Liquid Staking dApp

This project is a real Casper Web3 dApp built for the Casper Hackathon 2026. It features real wallet connections and real Testnet transactions.

## Features
- **Real Wallet Connection**: Detects and connects to real Casper Wallet or CSPR.click provider.
- **Real Transactions**: Every "Stake" action builds a real Casper Deploy, signs it with your wallet, and sends it to the Casper Testnet.
- **Testnet Integration**: All transactions are sent to `https://rpc.testnet.casperlabs.io`.

## How to Verify Transactions
1. Connect your Casper Wallet (make sure you are on Testnet).
2. Enter an amount of CSPR to stake.
3. Click "Stake Now".
4. A Casper Wallet popup will appear. Review and sign the transaction.
5. Once sent, a success message will appear with the **Deploy Hash**.
6. Click the link or go to [testnet.cspr.live](https://testnet.cspr.live) and search for your Deploy Hash to verify the transaction on-chain.

## Technical Details
- Built with `casper-js-sdk`.
- Network: `casper-test`.
- Node: `https://rpc.testnet.casperlabs.io/rpc`.
- **Server**: Configured to run on Replit with `allowedHosts: true` and proper port mapping.
