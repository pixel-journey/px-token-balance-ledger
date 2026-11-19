# Sources

## Official

| Source | Use |
| --- | --- |
| [eosio.token / eosio.contracts](https://github.com/eosio/eosio.contracts) | open, close, issue, transfer, retire |
| [docs.wax.io](https://docs.wax.io/) | WAX development |
| [docs.eosnetwork.com](https://docs.eosnetwork.com/) | Actions, permissions, asset type |
| [WAX API reference](https://docs.wax.io/build/api-reference/) | Chain reads |

## Product facts locked by tests

- **Open before credit.** Transfer and issue targets must already be open.
- Close only at balance **0**.
- After every successful op, `sum(balances) === supply`.
- Overdraft, self-transfer, and non-issuer issue are refused and leave the ledger unchanged.
- **PXJ precision is always 8** in Pixel Journey product labs. `1.00000000 PXJ` = `100_000_000` minor units.
- Peer transfer is **allowed** here. The opposite product is [virtual balance](https://github.com/pixel-journey/px-game-virtual-balance-ledger).

## Related labs

| Repo | Role |
| --- | --- |
| [virtual balance](https://github.com/pixel-journey/px-game-virtual-balance-ledger) | Points; peer transfer disabled |
| [transfer tax](https://github.com/pixel-journey/px-token-transfer-tax-burn-treasury) | Tax + burn supply |
| [dust](https://github.com/pixel-journey/px-token-dust-truncation-visualizer) | Integer dust |
| [pausable](https://github.com/pixel-journey/px-token-pausable-emergency-guard) | Pause transfers |
| [memo router](https://github.com/pixel-journey/px-memo-action-router) | Memo grammar |
| [invariant kit](https://github.com/pixel-journey/px-invariant-kit) | Shared quantity / name gates |
| [decimal simulator](https://github.com/pixel-journey/px-token-ft-decimal-supply-simulator) | Precision 0–18 vs MAX_AMOUNT |
