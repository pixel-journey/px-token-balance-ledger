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

A refused path must leave the book unchanged. Open → issue → transfer → retire → close is the only happy path.

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Authentication | Tests use role strings; chain needs `require_auth` |
| Symbol impersonation | Bind precision and symbol to the real contract. **PXJ precision is always 8** |
| RAM | Who pays for open rows; refuse open if unpaid |
| Reentrancy | Update balances before any outbound notify effects |
| Pause / compliance | [pausable guard](https://github.com/pixel-journey/px-token-pausable-emergency-guard) |
| Memo side effects | Do not parse memos inside the core ledger ([memo router](https://github.com/pixel-journey/px-memo-action-router)) |

## Attack angles

1. Issuing `1` and calling it one whole PXJ (that is `100_000_000` at precision 8).  
2. Retiring from a third party who is neither issuer nor holder.  
3. Closing a non-zero balance and orphaning supply.  
4. Updating supply before the balance write, then failing halfway.  
5. Treating this book as [virtual points](https://github.com/pixel-journey/px-game-virtual-balance-ledger) — peer transfer is allowed here and forbidden there.

## Honesty limits

Pure TypeScript conservation book. Not a deployed token. Reference shape: [eosio.token](https://github.com/eosio/eosio.contracts). Path: `px-contract-examples-vault` (private; not this public course).
