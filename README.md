# Token ledger: open, issue, transfer, retire, close

> **Domain:** fungible token balance book  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Catalog:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**Goal:** Teach **open → issueTo → transfer → retireFrom → close**, with **sum(balances) === supply** after every successful op. Precision for PXJ is locked at **8**.

Fills the gap left by supply-only simulators and differs from [px-game-virtual-balance-ledger](https://github.com/pixel-journey/px-game-virtual-balance-ledger) (peer transfer always refused).

**Reference pattern:** [eosio.token](https://github.com/eosio/eosio.contracts). **Network docs:** [docs.wax.io](https://docs.wax.io/), [docs.eosnetwork.com](https://docs.eosnetwork.com/).

**Code under test:** `npm test` (unit + lifecycle composition). Not wasm, not deployed.

## Composition

`ledger.composition.test.ts` walks a three-account PXJ book. `1.00000000 PXJ` is `100_000_000` integer units. After every successful issue, hop, retire, and close, `sumBalances === supply`. A failed overdraft does not mutate the ledger. A third party cannot retire someone else's row.

## What is true (executed)

| Rule | Result |
|------|--------|
| `open` | Zero balance row; refuses already-open and table full |
| `close` | Only when balance is `0n` |
| `issueTo` | Issuer-only; recipient must be open; respects maxSupply |
| `transfer` | Both open; no self; no overdraft; supply unchanged |
| `retireFrom` | Issuer or holder; lowers balance and supply |
| Conservation | `sumBalances === supply` after issue/transfer/retire |
| PXJ spec | precision locked at 8 |

```bash
npm test
```

## Layout

| Path | Role |
|------|------|
| `invariants/ledger.ts` | open / close / issueTo / retireFrom / transfer |
| `invariants/ledger.test.ts` | Unit claims |
| `invariants/ledger.composition.test.ts` | Multi-step PXJ lifecycle |
| `EDUCATION.md` / `SECURITY.md` / `SOURCES.md` | Pedagogy, threats, official links |

## Related

Shared helpers: [px-invariant-kit](https://github.com/pixel-journey/px-invariant-kit). Memo grammar: [px-memo-action-router](https://github.com/pixel-journey/px-memo-action-router).

MIT — Pixel Journey
