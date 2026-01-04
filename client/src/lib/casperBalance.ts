import * as casperSDK from "casper-js-sdk";

const RPC_URL = "https://rpc.testnet.casperlabs.io/rpc";

/**
 * Fetches the CSPR balance for a given public key on Casper Testnet.
 */
export async function fetchCasperBalance(publicKeyHex: string): Promise<string> {
  if (!publicKeyHex) return "0.00";
  
  try {
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'state_get_balance',
        params: {
          purse_identifier: {
            main_purse_under_public_key: publicKeyHex
          }
        }
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("RPC Error:", data.error);
      return "0.00";
    }

    // Standard Casper Testnet RPC response for state_get_balance:
    // Some nodes return { "result": "12345" }
    // Others return { "result": { "balance_value": "12345" } }
    let balanceMotes = data.result;
    
    if (balanceMotes && typeof balanceMotes === 'object' && balanceMotes.balance_value) {
      balanceMotes = balanceMotes.balance_value;
    }
    
    if (balanceMotes === undefined || balanceMotes === null) {
      console.warn("No balance found in RPC response:", data);
      return "0.00";
    }

    try {
      const rawMotes = balanceMotes.toString().trim();
      const motesBI = BigInt(rawMotes);
      const motesPerCSPR = BigInt(1_000_000_000);
      
      const cspr = motesBI / motesPerCSPR;
      const remainder = motesBI % motesPerCSPR;
      
      const decimalVal = Number(remainder) / 1_000_000_000;
      const decimalStr = decimalVal.toFixed(9).split('.')[1].substring(0, 2);
      
      const formattedBalance = `${cspr.toString()}.${decimalStr}`;
      
      return Number(formattedBalance).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } catch (parseError) {
      console.error("Error parsing balance motes:", parseError, balanceMotes);
      return "0.00";
    }
  } catch (error) {
    console.error("Error fetching Casper balance:", error);
    return "0.00";
  }
}
