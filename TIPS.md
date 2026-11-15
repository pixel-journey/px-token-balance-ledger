# Tips — eosio.token-style balance books

## Integer units

- Store and compute only **integer minor units**. Convert at the UI with a fixed precision.
- **PXJ precision is always 8** in this org: `1.00000000 PXJ` = `100_000_000` units.
- Never use floating point for balances, fees, or comparisons.

## Conservation

After every **successful** mutating path:

```text
sum(open balances) === supply
```

Failed paths (overdraft, unauthorized issue, close with balance) must leave the ledger **unchanged**. Composition tests lock that.

## Open / close discipline

| Rule | Why |
| --- | --- |
| Open before first credit | Matches classic account existence / RAM discipline in simplified form |
| Close only at zero | Prevents deleting residual value |
| Cap open accounts (here 64) | Bounds table growth in the lab |

## Issuer vs holder

- Only **issuer** may `issueTo` (and may retire any row in this lab’s issuer path).
- Holder may retire **own** balance; third parties cannot drain another account unless they are the issuer.
- Self-transfer is refused; recipient must already be open.

## What not to confuse

| This lab | Neighbor |
| --- | --- |
| Peer transfer allowed; supply conserved | [virtual game ledger](https://github.com/pixel-journey/px-game-virtual-balance-ledger) forbids peer transfer |
| No tax | [transfer-tax](https://github.com/pixel-journey/px-token-transfer-tax-burn-treasury) splits burn/treasury |
| No memo parse | [memo router](https://github.com/pixel-journey/px-memo-action-router) |
| No pause flag | [pausable guard](https://github.com/pixel-journey/px-token-pausable-emergency-guard) |

## Production checklist

1. Real `require_auth` on `from` / issuer.  
2. Symbol + precision match the deployed token contract.  
3. RAM payer policy for balance rows.  
4. Optional pause, blacklist, and memo hooks as separate modules.  
5. Keep conservation asserts in CI forever.
