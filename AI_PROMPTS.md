# AI handoff — token balance ledger

## Agent tooling

```bash
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit
```

| Source | Role |
| --- | --- |
| [eosio.token](https://github.com/eosio/eosio.contracts) | open / close / issue / transfer / retire |
| [docs.eosnetwork.com](https://docs.eosnetwork.com/) | Asset type, permissions |
| [ANTELOPE-PORTABILITY](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/ANTELOPE-PORTABILITY.md) | Integer rules vs symbol |

## Non-negotiables

1. **Open before credit.** Transfer and issue targets must already be open.
2. Close only at balance **0**.
3. After every success, `sum(balances) === supply`.
4. Overdraft, self-transfer, and non-issuer issue are refused and leave the ledger unchanged.
5. **PXJ precision is always 8.** `1.00000000 PXJ` = `100_000_000` minor units.
6. Peer transfer is **allowed** here. Opposite product: [virtual balance](https://github.com/pixel-journey/px-game-virtual-balance-ledger).
7. Conservation math ports; symbol, precision, and token contract account do not.

## Prompt seeds

- "Issue 100 to an unopened account — what happens?"
- "Show sum(balances) === supply after transfer and after retire."
- "Port the ledger to EOS precision 4 without changing conservation."
- "Contrast with virtual balance where peer transfer always throws."

## Do not

- Change PXJ precision.
- Claim wasm or a live token contract from this pure book.
- Allow close with nonzero balance.
