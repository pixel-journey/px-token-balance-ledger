# Security notes

| Issue | Lab mitigation |
|-------|----------------|
| Credit without open | `issueTo` / `transfer` require open rows |
| Close with funds | `close` refuses non-zero balance |
| Overdraft | `transfer` / `retireFrom` check balance |
| Non-issuer mint | `issueTo` requires `caller === issuer` |
| Unbounded account table | `MAX_ACCOUNTS` |

Production still needs `require_auth`, RAM policy, and symbol scoping per contract.
