# px-token-balance-ledger

> **Trust:** private educational lab (Tier B)  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)  
> **Sources:** [SOURCES.md](SOURCES.md)

**One-sentence goal:** Teach **open → issueTo → transfer → retireFrom → close**, with **sum(balances) === supply** after every successful op.

Fills the gap left by [px-token-ft-decimal-supply-simulator](https://github.com/pixel-journey/px-token-ft-decimal-supply-simulator) (supply only, no rows) and differs from [px-game-virtual-balance-ledger](https://github.com/pixel-journey/px-game-virtual-balance-ledger) (peer transfer always refused).

Reference pattern for the classic token lifecycle: [eosio.token](https://github.com/eosio/eosio.contracts). Network docs: [docs.wax.io](https://docs.wax.io/), [docs.eosnetwork.com](https://docs.eosnetwork.com/).

**Real code:** `npm test` (unit + **lifecycle composition**). **Not** wasm, **not** deployed.

---

## Composition note

`ledger.composition.test.ts` walks a three-account PXJ book (precision **8**). `1.00000000 PXJ` is `100_000_000` integer units. After every successful issue, hop, retire, and close, `sumBalances === supply`. A failed overdraft does not mutate the ledger. A third party cannot retire someone else's row.

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

---

## Layout

| Path | Role |
|------|------|
| `invariants/ledger.ts` | open / close / issueTo / retireFrom / transfer |
| `invariants/ledger.test.ts` | Executed unit claims |
| `invariants/ledger.composition.test.ts` | Multi-step PXJ lifecycle |
| `EDUCATION.md` | Why open-before-credit |
| `SECURITY.md` | Overdraft and close-with-balance |
| `SOURCES.md` | eosio.token and docs.wax.io |

## Related

Shared quantity / name / math helpers: [px-invariant-kit](https://github.com/pixel-journey/px-invariant-kit). Memo grammar for transfer-triggered actions: [px-memo-action-router](https://github.com/pixel-journey/px-memo-action-router).

## License

MIT — Pixel Journey
