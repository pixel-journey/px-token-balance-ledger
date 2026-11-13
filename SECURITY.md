# Security notes — token ledger

## Mitigated in the lab

| Issue | Behavior |
| --- | --- |
| Overdraft | refused; no mutation |
| Issue past maxSupply | refused |
| Close with balance | refused |
| Non-issuer issue | refused |
| Third-party retire | refused unless issuer |
| Self-transfer | refused |
| Table growth | max 64 open accounts |

## Production still needs

- `require_auth` on issuer / from
- Matching symbol + precision with the real token contract
- RAM payer for balance rows
- Optional pause path ([pausable guard](https://github.com/pixel-journey/px-token-pausable-emergency-guard))

Reference implementation mindset: [eosio.token](https://github.com/eosio/eosio.contracts).
