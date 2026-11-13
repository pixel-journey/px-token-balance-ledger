# Worked examples — PXJ@8 ledger

`1.00000000 PXJ` = `100_000_000n` units. Composition uses a three-account book.

## Example A — mint path

```text
L = createLedger("PXJ", 8, 1_000_000_000_00000000n, "issuer")
L = open(L, "alice")
L = issueTo(L, "issuer", "alice", 100_000_000n)
sumBalances === supply === 100_000_000n
```

## Example B — hop and conserve

```text
open bob; transfer alice → bob 40_000_000n
alice 60M, bob 40M, supply still 100M
```

## Example C — failed overdraft

Alice tries to send `60_000_001n` → throws; balances unchanged.

## Example D — retire and close

```text
retireFrom(alice, 60_000_000n) as alice or issuer
alice balance 0 → close(alice)
supply decreased by 60M
```

## Example E — third party cannot retire

`retireFrom` with caller `carol` on alice’s row → refused (unless carol is issuer).

## Example F — non-open recipient

Issue or transfer to closed account → refused.
