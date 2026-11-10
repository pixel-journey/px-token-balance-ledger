# px-token-balance-ledger

> **Trust:** private educational lab (Tier B)
> **Quest:** balance ledger (open / transfer conservation / close)
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach **open → issueTo → transfer → retireFrom → close**, with **sum(balances) === supply** after every successful op.

Fills the gap left by [px-token-ft-decimal-supply-simulator](https://github.com/pixel-journey/px-token-ft-decimal-supply-simulator) (supply only, no rows) and differs from [px-game-virtual-balance-ledger](https://github.com/pixel-journey/px-game-virtual-balance-ledger) (peer transfer always refused).

**Real code:** `npm test` (10 tests). **Not** wasm, **not** deployed.

---

## What is true (executed)

| Rule | Result |
|------|--------|
| `open` | Zero balance row; refuses already-open and table full |
| `close` | Only when balance is `0n` |
| `issueTo` | Issuer-only; recipient must be open; respects maxSupply |
| `transfer` | Both open; no self; no overdraft; supply unchanged |
| `retireFrom` | Issuer or holder; lowers balance and supply |
| Conservation | `sumBalances === supply` after issue/transfer/retire |

```bash
npm test
```

---

## Layout

| Path | Role |
|------|------|
| `invariants/ledger.ts` | open / close / issueTo / retireFrom / transfer |
| `invariants/ledger.test.ts` | Executed claims |
| `EDUCATION.md` | Why open-before-credit |
| `SECURITY.md` | Overdraft and close-with-balance |

## License

MIT — Pixel Journey

---

*Seeded 2026-11-10. No wasm.*
