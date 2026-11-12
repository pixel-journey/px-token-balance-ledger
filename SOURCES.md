# Official sources

| Source | Use |
| --- | --- |
| [eosio.contracts / eosio.token](https://github.com/eosio/eosio.contracts) | Classic open / close / issue / transfer / retire patterns and asset encoding |
| [docs.eosnetwork.com](https://docs.eosnetwork.com/) | Actions, permissions, `require_auth` |
| [docs.wax.io](https://docs.wax.io/) | WAX development and API surfaces |
| [WAX API reference](https://docs.wax.io/build/api-reference/) | Chain API for account and token reads |

This lab is a **conservation ledger** in TypeScript. Live WAX token contracts may differ in RAM payer, memo, and issuer policy — always verify the ABI of the token you care about.

## Related org labs

| Repo | Difference |
| --- | --- |
| [px-token-ft-decimal-supply-simulator](https://github.com/pixel-journey/px-token-ft-decimal-supply-simulator) | Supply and precision only; no per-account rows |
| [px-game-virtual-balance-ledger](https://github.com/pixel-journey/px-game-virtual-balance-ledger) | Peer transfer **refused** (game points) |
| [px-invariant-kit](https://github.com/pixel-journey/px-invariant-kit) | Shared name / quantity / math gates |
| [px-memo-action-router](https://github.com/pixel-journey/px-memo-action-router) | Transfer memo grammar for dapp routing |
