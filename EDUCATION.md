# Education — token balance ledger

> **Rung:** `npm test` passes. No wasm, no live token contract.  
> **The test is the rule.** Conservation `sum(balances) === supply` after every successful op.

## What you should be able to do

| Level | After this file |
| --- | --- |
| Beginner | Open before credit; close only at zero; transfer conserves |
| Intermediate | Issue/retire authority; overdraft does not mutate |
| Masterclass | Why open-before-credit and why precision is a product constant |

Contrast: [game virtual ledger](https://github.com/pixel-journey/px-game-virtual-balance-ledger) refuses peer transfer. Reference: [eosio.token](https://github.com/eosio/eosio.contracts).

---

## Beginner — one scene

PXJ at precision **8**: `1.00000000 PXJ` = `100_000_000` integer units.

```text
createLedger("PXJ", 8, maxSupply, "issuer")
open(alice); open(bob)
issueTo(issuer → alice, 100_000_000n)
transfer(alice → bob, 40_000_000n)
// alice 60M, bob 40M, supply 100M, sumBalances === supply
```

Closing alice with 60M left throws. Retire then close works.

### Words

| Word | Meaning |
| --- | --- |
| Open | Zero row exists; transfer/issue targets must be open |
| Issue | Issuer raises supply and credits an open account |
| Retire | Issuer or holder burns; lowers balance and supply |
| Conservation | Sum of open balances equals supply after success |

### Predict, then run

```bash
npm test
```

1. Transfer to a non-open account fails; balances unchanged.
2. Self-transfer refused.
3. Non-issuer cannot issue.

---

## Intermediate — the API

| Op | Key guards |
| --- | --- |
| `open` | not already open; ≤ 64 accounts |
| `close` | balance exactly `0n` |
| `issueTo` | caller = issuer; recipient open; ≤ maxSupply |
| `transfer` | both open; no self; no overdraft; supply unchanged |
| `retireFrom` | issuer or holder; ≤ balance and supply |

Failed ops throw and must leave the ledger unchanged (composition exercises overdraft).

---

## Masterclass

- **Open-before-credit** matches classic eosio.token RAM/account existence discipline in simplified form.
- **Precision 8 for PXJ** is a product invariant — do not “fix” decimals in UI math without converting to integer units.
- Third parties cannot retire someone else’s row unless they are the issuer.
- Production still needs: real `require_auth`, actual token contract symbol/precision match, and RAM payer policy.

### Exercise

Alice holds 5 units, supply 5. Alice transfers 3 to bob (open). Sum still 5. Alice retires 2. Supply 3, alice 0, bob 3. Alice can close.

---

## What this course will not teach

- Deployed eosio.token / custom token wasm
- Memo parsing (see [memo router](https://github.com/pixel-journey/px-memo-action-router))
- Tax on transfer (see transfer-tax lab)
