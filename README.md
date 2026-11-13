# Token ledger: open, issue, transfer, retire, close

> **Domain:** fungible token balance book (PXJ precision **8**)  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Catalog:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**Goal:** Teach **open → issueTo → transfer → retireFrom → close**, with **sum(balances) === supply** after every successful op.

**Code under test:** `npm test` (unit + lifecycle composition). Not wasm, not deployed.

**Reference:** [eosio.token](https://github.com/eosio/eosio.contracts). **Docs:** [docs.wax.io](https://docs.wax.io/).

## Learning materials

| Doc | Role |
| --- | --- |
| [EDUCATION.md](EDUCATION.md) | Beginner → masterclass |
| [WORKED-EXAMPLES.md](WORKED-EXAMPLES.md) | PXJ@8 mint, hop, overdraft, close |
| [TIPS.md](TIPS.md) | Integer units and related labs |
| [SECURITY.md](SECURITY.md) | Overdraft and authority |
| [SOURCES.md](SOURCES.md) | eosio.token + neighbors |

## Composition

Three-account PXJ book. Failed overdraft does not mutate. Third party cannot retire someone else’s row.

## What is true (executed)

| Rule | Result |
|------|--------|
| `open` / `close` | close only at `0n` |
| `issueTo` | issuer-only; open recipient; maxSupply |
| `transfer` | both open; no self; conservation |
| `retireFrom` | issuer or holder |
| PXJ | precision locked at 8 |

```bash
npm test
```

MIT — Pixel Journey
