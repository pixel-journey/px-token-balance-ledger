# Tips — balance books on Antelope

## Do

- Keep **integer units** everywhere; convert at the UI boundary with fixed precision.
- Assert `sumBalances === supply` in tests after every mutating path.
- Open before first credit; close only at zero.

## Don’t

- Use floating point for balances.
- Allow transfer to create implicit accounts without an open policy.
- Confuse this ledger with the **non-transferable** game balance lab.

## Related

| Concern | Repo |
| --- | --- |
| Memo on transfer | [px-memo-action-router](https://github.com/pixel-journey/px-memo-action-router) |
| Tax split | [px-token-transfer-tax-burn-treasury](https://github.com/pixel-journey/px-token-transfer-tax-burn-treasury) |
| Dust floors | [px-token-dust-truncation-visualizer](https://github.com/pixel-journey/px-token-dust-truncation-visualizer) |
| Shared helpers | [px-invariant-kit](https://github.com/pixel-journey/px-invariant-kit) |
