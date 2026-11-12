/**
 * Composition: a full PXJ lifecycle across three accounts.
 * After every successful step, sum(balances) === supply.
 * Precision 8 is locked on the PXJ spec; amounts are integer units.
 */
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
  type Ledger,
} from "./ledger.ts";

const issuer = "tokenissuer";

function pxj(): Ledger {
  return createLedger("PXJ", 8, 1_000_000_00000000n, issuer);
}

function conserved(L: Ledger): void {
  assert.equal(sumBalances(L), L.supply);
}

describe("composition: PXJ lifecycle", () => {
  it("locks PXJ precision at 8", () => {
    const L = pxj();
    assert.equal(L.spec.symbol, "PXJ");
    assert.equal(L.spec.precision, 8);
  });

  it("issue, hop, retire, close \u2014 conservation after each step", () => {
    let L = pxj();
    L = open(L, "alice");
    L = open(L, "bob");
    L = open(L, "treasury");
    conserved(L);

    // 1.00000000 PXJ = 100_000_000 units
    const one = 100_000_000n;
    L = issueTo(L, issuer, "alice", one * 10n);
    conserved(L);
    assert.equal(L.balances.get("alice"), one * 10n);
    assert.equal(L.supply, one * 10n);

    L = transfer(L, "alice", "bob", one * 3n);
    conserved(L);
    assert.equal(L.balances.get("alice"), one * 7n);
    assert.equal(L.balances.get("bob"), one * 3n);
    assert.equal(L.supply, one * 10n);

    L = transfer(L, "bob", "treasury", one);
    conserved(L);
    assert.equal(L.balances.get("bob"), one * 2n);
    assert.equal(L.balances.get("treasury"), one);

    L = retireFrom(L, "treasury", "treasury", one);
    conserved(L);
    assert.equal(L.balances.get("treasury"), 0n);
    assert.equal(L.supply, one * 9n);

    L = close(L, "treasury");
    conserved(L);
    assert.equal(L.balances.has("treasury"), false);

    L = retireFrom(L, issuer, "alice", one * 7n);
    L = retireFrom(L, "bob", "bob", one * 2n);
    conserved(L);
    assert.equal(L.supply, 0n);
    L = close(L, "alice");
    L = close(L, "bob");
    assert.equal(L.balances.size, 0);
    conserved(L);
  });

  it("a third party cannot retire someone else's balance", () => {
    let L = pxj();
    L = open(L, "alice");
    L = open(L, "carol");
    L = issueTo(L, issuer, "alice", 50n);
    assert.throws(() => retireFrom(L, "carol", "alice", 1n), /only issuer or holder/);
    conserved(L);
    assert.equal(L.balances.get("alice"), 50n);
  });

  it("transfer does not change supply; overdraft leaves the ledger untouched", () => {
    let L = pxj();
    L = open(L, "alice");
    L = open(L, "bob");
    L = issueTo(L, issuer, "alice", 40n);
    const before = L;
    assert.throws(() => transfer(L, "alice", "bob", 41n), /exceeds balance/);
    assert.equal(before.supply, 40n);
    assert.equal(before.balances.get("alice"), 40n);
    assert.equal(before.balances.get("bob"), 0n);
    L = transfer(L, "alice", "bob", 40n);
    conserved(L);
    assert.equal(L.supply, 40n);
  });
});
