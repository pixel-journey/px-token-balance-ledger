# Worked examples — token balance ledger

Amounts are integer minor units. **PXJ precision is 8**, so `1.00000000 PXJ` is `100_000_000n`. Issuer in the tests is `tokenissuer`. After every successful step, `sumBalances(L) === L.supply`.

## Open and close

`open` creates a row at `0n`. `close` deletes it only at zero.

| Call | Result |
| --- | --- |
| `open` alice twice | `already open` |
| issue `1n`, then `close` alice | `balance not zero` |
| `close` an account that was never opened | `not open` |

Opening one past `MAX_ACCOUNTS` throws `too many accounts`. Names in that test are built from `a-z` and `1-5` only.

## Issue, transfer, retire

```text
issue 100 to alice
transfer 40 alice → bob
→ alice 60, bob 40, supply 100
```

```text
issue 50 to alice
retire 20 from alice (called by alice)
→ balance 30, supply 30
```

| Call | Result |
| --- | --- |
| `issueTo` by alice, not the issuer | `only issuer` |
| transfer `11` when alice has `10` | `exceeds balance` |
| transfer to bob while bob is not open | `recipient not open` |
| transfer alice → alice | `must differ` |
| symbol `AAA`, precision `0`, maxSupply `10`, issue `11` | `maxSupply` |
| issue to an unopened account | `not open` |
| issue, transfer, or retire `0n` | `positive` |

An overdraft throws and leaves the previous ledger: supply `40`, alice `40`, bob `0`. A following transfer of the full `40` keeps supply at `40`.

## Full PXJ lifecycle (composition)

`one = 100_000_000n` (one whole PXJ).

| Step | Balances | Supply |
| --- | --- | --- |
| Open alice, bob, treasury | all `0` | `0` |
| Issue `10 * one` to alice | alice 10 PXJ | 10 PXJ |
| Alice → bob `3 * one` | alice 7, bob 3 | 10 |
| Bob → treasury `1 * one` | bob 2, treasury 1 | 10 |
| Treasury retires its 1 | treasury 0 | 9 |
| Close treasury | row gone | 9 |
| Issuer retires alice's 7; bob retires his 2 | both 0 | 0 |
| Close alice and bob | no rows | 0 |

Carol cannot `retireFrom` alice's `50n` (`only issuer or holder`). Alice's balance stays `50`.

## What this is not

No `require_auth`, no RAM payer, no memo, no wasm. The virtual-balance lab is the one that **forbids** peer transfer. This one allows it and conserves supply.
