# Security — token balance ledger

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Overdraft transfer | refused; ledger unchanged |
| Issue past maxSupply | refused |
| Issue / transfer / retire amount 0 | refused |
| Close with non-zero balance | refused |
| Close / credit unopened account | refused |
| Non-issuer issue | refused |
| Third-party retire (not issuer, not holder) | refused |
| Self-transfer | refused |
| Double open | refused |
| Open past MAX_ACCOUNTS (64) | refused |
| Conservation after success | `sumBalances === supply` |

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Authentication | Tests use role strings; chain needs `require_auth` |
| Symbol impersonation | Bind precision and symbol to the real contract |
| RAM | Who pays for open rows; refuse open if unpaid |
| Reentrancy | Update balances before any outbound notify effects |
| Pause / compliance | Separate guard lab; not in this book |
| Memo side effects | Do not parse memos inside the core ledger without explicit policy |

Reference mindset: [eosio.token](https://github.com/eosio/eosio.contracts). This repo is a pure TypeScript conservation book, not a deployed token.
