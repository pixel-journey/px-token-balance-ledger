# Education

## The pitfall

A circulating supply counter without per-account rows cannot express “Alice paid Bob.” Crediting a missing account silently, or closing a funded row, desyncs the books.

## The rule

1. **Open** creates a zero row before any credit.
2. **Issue** raises supply and one balance together.
3. **Transfer** moves value between open rows; supply is unchanged.
4. **Retire** lowers supply and one balance together.
5. **Close** only when the row is exactly zero.

`sum(balances)` must equal `supply` after every successful mutation.

## What this is not

- Not a full `eosio.token` (no RAM payer model, no memo, no on-chain ABI).
- Not the virtual game ledger (peer transfer is allowed here).
- Not wasm.
