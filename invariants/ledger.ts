/**
 * eosio.token-style balance ledger (educational).
 * open → credit/debit rows → transfer conservation → close only at zero.
 * Complements supply-only lab (no per-account rows) and virtual game ledger (no peer transfer).
 */

export const MAX_AMOUNT = 4_611_686_018_427_387_903n; // 2^62 - 1
export const MAX_ACCOUNTS = 64;

export type TokenSpec = {
  symbol: string;
  precision: number;
  maxSupply: bigint;
  issuer: string;
};

export type Ledger = {
  spec: TokenSpec;
  supply: bigint;
  /** account → balance; missing key means not open */
  balances: Map<string, bigint>;
};

const NAME = /^[a-z1-5.]{1,12}$/;
const SYMBOL = /^[A-Z]{1,7}$/;

export function assertName(name: string): string {
  if (!NAME.test(name) || name.startsWith(".") || name.endsWith(".")) {
    throw new Error("bad account name");
  }
  return name;
}

export function assertSymbol(symbol: string): string {
  if (!SYMBOL.test(symbol)) throw new Error("bad symbol");
  return symbol;
}

export function assertAmount(amount: bigint): bigint {
  if (typeof amount !== "bigint") throw new Error("amount must be bigint");
  if (amount < 0n) throw new Error("amount must not be negative");
  if (amount > MAX_AMOUNT) throw new Error("amount exceeds MAX_AMOUNT");
  return amount;
}

export function createLedger(
  symbol: string,
  precision: number,
  maxSupply: bigint,
  issuer: string,
): Ledger {
  assertSymbol(symbol);
  if (!Number.isInteger(precision) || precision < 0 || precision > 18) {
    throw new Error("precision must be an integer from 0 to 18");
  }
  assertAmount(maxSupply);
  if (maxSupply === 0n) throw new Error("maxSupply must be positive");
  assertName(issuer);
  return {
    spec: { symbol, precision, maxSupply, issuer },
    supply: 0n,
    balances: new Map(),
  };
}

/** Open a zero balance. Refuses if already open or table full. */
export function open(ledger: Ledger, account: string): Ledger {
  assertName(account);
  if (ledger.balances.has(account)) throw new Error("already open");
  if (ledger.balances.size >= MAX_ACCOUNTS) throw new Error("too many accounts");
  const balances = new Map(ledger.balances);
  balances.set(account, 0n);
  return { ...ledger, balances };
}

/** Close only when balance is exactly zero. */
export function close(ledger: Ledger, account: string): Ledger {
  assertName(account);
  if (!ledger.balances.has(account)) throw new Error("not open");
  const bal = ledger.balances.get(account)!;
  if (bal !== 0n) throw new Error("balance not zero");
  const balances = new Map(ledger.balances);
  balances.delete(account);
  return { ...ledger, balances };
}

/**
 * Issuer credits an open account and raises supply.
 * Does not create the account — open first.
 */
export function issueTo(
  ledger: Ledger,
  caller: string,
  to: string,
  amount: bigint,
): Ledger {
  assertName(caller);
  assertName(to);
  assertAmount(amount);
  if (amount === 0n) throw new Error("amount must be positive");
  if (caller !== ledger.spec.issuer) throw new Error("only issuer may issue");
  if (!ledger.balances.has(to)) throw new Error("recipient not open");
  const nextSupply = ledger.supply + amount;
  if (nextSupply > ledger.spec.maxSupply) throw new Error("exceeds maxSupply");
  if (nextSupply > MAX_AMOUNT) throw new Error("exceeds MAX_AMOUNT");
  const nextBal = ledger.balances.get(to)! + amount;
  if (nextBal > MAX_AMOUNT) throw new Error("exceeds MAX_AMOUNT");
  const balances = new Map(ledger.balances);
  balances.set(to, nextBal);
  return { ...ledger, supply: nextSupply, balances };
}

/**
 * Burn from an open account and lower supply.
 * Account must hold at least `amount`.
 */
export function retireFrom(
  ledger: Ledger,
  caller: string,
  from: string,
  amount: bigint,
): Ledger {
  assertName(caller);
  assertName(from);
  assertAmount(amount);
  if (amount === 0n) throw new Error("amount must be positive");
  if (caller !== ledger.spec.issuer && caller !== from) {
    throw new Error("only issuer or holder may retire");
  }
  if (!ledger.balances.has(from)) throw new Error("account not open");
  const bal = ledger.balances.get(from)!;
  if (amount > bal) throw new Error("exceeds balance");
  if (amount > ledger.supply) throw new Error("exceeds supply");
  const balances = new Map(ledger.balances);
  balances.set(from, bal - amount);
  return { ...ledger, supply: ledger.supply - amount, balances };
}

/**
 * Peer transfer. Both accounts must be open. Conservation: sum of balances unchanged.
 */
export function transfer(
  ledger: Ledger,
  from: string,
  to: string,
  amount: bigint,
): Ledger {
  assertName(from);
  assertName(to);
  assertAmount(amount);
  if (amount === 0n) throw new Error("amount must be positive");
  if (from === to) throw new Error("from and to must differ");
  if (!ledger.balances.has(from)) throw new Error("sender not open");
  if (!ledger.balances.has(to)) throw new Error("recipient not open");
  const fromBal = ledger.balances.get(from)!;
  if (amount > fromBal) throw new Error("exceeds balance");
  const toBal = ledger.balances.get(to)! + amount;
  if (toBal > MAX_AMOUNT) throw new Error("exceeds MAX_AMOUNT");
  const balances = new Map(ledger.balances);
  balances.set(from, fromBal - amount);
  balances.set(to, toBal);
  return { ...ledger, balances };
}

/** Sum of open balances — must equal supply after well-formed ops. */
export function sumBalances(ledger: Ledger): bigint {
  let s = 0n;
  for (const v of ledger.balances.values()) s += v;
  return s;
}
