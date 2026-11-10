import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createLedger,
  open,
  close,
  issueTo,
  retireFrom,
  transfer,
  sumBalances,
  MAX_ACCOUNTS,
} from "./ledger.ts";

const issuer = "tokenissuer";

function base() {
  return createLedger("PXJ", 8, 1_000_000_00000000n, issuer);
}

describe("open / close", () => {
  it("opens at zero and closes only at zero", () => {
    let L = base();
    L = open(L, "alice");
    assert.equal(L.balances.get("alice"), 0n);
    L = close(L, "alice");
    assert.equal(L.balances.has("alice"), false);
  });

  it("refuses double open and close when funded", () => {
    let L = base();
    L = open(L, "alice");
    assert.throws(() => open(L, "alice"), /already open/);
    L = issueTo(L, issuer, "alice", 1n);
    assert.throws(() => close(L, "alice"), /balance not zero/);
  });

  it("refuses close when not open", () => {
    assert.throws(() => close(base(), "alice"), /not open/);
  });
});

describe("issue / retire / transfer", () => {
  it("issue credits balance and supply; transfer conserves", () => {
    let L = base();
    L = open(L, "alice");
    L = open(L, "bob");
    L = issueTo(L, issuer, "alice", 100n);
    assert.equal(L.supply, 100n);
    assert.equal(L.balances.get("alice"), 100n);
    L = transfer(L, "alice", "bob", 40n);
    assert.equal(L.balances.get("alice"), 60n);
    assert.equal(L.balances.get("bob"), 40n);
    assert.equal(L.supply, 100n);
    assert.equal(sumBalances(L), L.supply);
  });

  it("retire lowers balance and supply", () => {
    let L = base();
    L = open(L, "alice");
    L = issueTo(L, issuer, "alice", 50n);
    L = retireFrom(L, "alice", "alice", 20n);
    assert.equal(L.balances.get("alice"), 30n);
    assert.equal(L.supply, 30n);
    assert.equal(sumBalances(L), 30n);
  });

  it("refuses non-issuer issue and overdraft transfer", () => {
    let L = base();
    L = open(L, "alice");
    L = open(L, "bob");
    assert.throws(() => issueTo(L, "alice", "alice", 1n), /only issuer/);
    L = issueTo(L, issuer, "alice", 10n);
    assert.throws(() => transfer(L, "alice", "bob", 11n), /exceeds balance/);
  });

  it("refuses transfer to/from closed accounts and self", () => {
    let L = base();
    L = open(L, "alice");
    L = issueTo(L, issuer, "alice", 5n);
    assert.throws(() => transfer(L, "alice", "bob", 1n), /recipient not open/);
    assert.throws(() => transfer(L, "alice", "alice", 1n), /must differ/);
  });

  it("refuses issue past maxSupply and issue to closed", () => {
    let L = createLedger("AAA", 0, 10n, issuer);
    L = open(L, "alice");
    assert.throws(() => issueTo(L, issuer, "alice", 11n), /maxSupply/);
    assert.throws(() => issueTo(L, issuer, "bob", 1n), /not open/);
  });

  it("refuses zero amounts", () => {
    let L = base();
    L = open(L, "alice");
    L = open(L, "bob");
    assert.throws(() => issueTo(L, issuer, "alice", 0n), /positive/);
    L = issueTo(L, issuer, "alice", 1n);
    assert.throws(() => transfer(L, "alice", "bob", 0n), /positive/);
    assert.throws(() => retireFrom(L, issuer, "alice", 0n), /positive/);
  });
});

describe("table bound", () => {
  it("refuses opening past MAX_ACCOUNTS", () => {
    let L = base();
    // Valid Antelope names: [a-z1-5.]{1,12} — no digit 0,6-9
    const chars = "abcdefghijklmnopqrstuvwxy12345";
    for (let i = 0; i < MAX_ACCOUNTS; i++) {
      let name = "u";
      let n = i;
      for (let k = 0; k < 4; k++) {
        name += chars[n % chars.length];
        n = Math.floor(n / chars.length);
      }
      L = open(L, name);
    }
    assert.throws(() => open(L, "overflowacct"), /too many accounts/);
  });
});
