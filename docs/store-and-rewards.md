---
audience: mixed
summary: Credit balances, in-world and browser purchases, and one-off reward claims.
---

# The Store & Rewards Economy

## For end-users

### What it is

Your companion tracks a **Credit balance** for your account (shared across all
of your characters). Credits are spent in the **Shop** to buy products —
things like additional attachable add-ons or other unlockable extras — and can
also be earned through **Rewards**, which are one-off grants (a Credit top-up,
or a free product) given to you for things like events, promotions, or
milestones.

### How you use it

1. **Open the Shop** from the main menu. You'll see your current Credit
   balance at the top.
2. **Browse** through categories (folders marked with an asterisk `*` contain
   further choices) until you find a product, or use the listed categories to
   narrow things down.
3. **Review the item** — its description and its cost in Credits — then choose
   **Buy**. If you have enough Credits, the purchase completes immediately and
   the item is delivered to you; if you don't, the purchase is refused and
   nothing is charged.
4. **Check Rewards** from the Shop's front page to see anything waiting to be
   claimed. Selecting a reward claims it right away — crediting your balance
   or delivering a product, depending on the reward. You can also clear your
   list of unclaimed rewards.

Free items (priced at 0 Credits) can always be claimed, even if your balance
happens to be negative for any reason — only purchases that would take your
balance below zero are blocked.

### Using the browser Store

If your dashboard offers the **Store**, you can review your account balance,
available products, and unclaimed rewards there too. Choose a product and review
its current price before purchasing. Products are delivered in-world, not to the
browser. A changed price or insufficient Credits prevents the purchase; refresh
the Store before deciding whether to try again.

Claiming a reward adds its Credits or requests delivery of its product. Clearing
unclaimed rewards requires confirmation and **discards them without paying them
out**; already claimed rewards are not cleared.

After an error or interrupted purchase, refresh and check your balance and
inventory before starting another purchase. If the outcome is unclear, contact
support rather than repeatedly buying the same item. Browser availability and
layout depend on the dashboard version you are using.

---

## For developers

### Purpose

A lightweight ledger-based economy used to gate optional content (add-ons,
plugins, cosmetic items) behind a simple currency, plus a generic reward
mechanism other systems can use to grant Credits or products without coupling
to them directly.

### Pieces

- **`AccountTransactionModelImpl`** (`src/classes/models/`) — an immutable,
  append-only ledger row: `account`, a signed `amount` (positive = credit,
  negative = debit), a free-text `reason`, and a `timestamp`. A balance is
  never stored directly; it is derived.
- **`AccountTransactionRepositoryImpl`** (`src/classes/repos/`) —
  `fetchAccountBalance(AccountModel)` sums all of an account's transaction
  rows to produce the current balance.
- **`TransactionHelper`** (`src/classes/helpers/`) — the shared affordability
  rule and the in-world ledger workflow; the web Store also writes ledger rows
  directly within its own transaction:
  - `fetchBalance()` / `fetchBalanceOf(AccountModel)` — read the current
    balance.
  - `canApplyTransaction(int $balance, int $amount): bool` — the affordability
    rule. A non-negative `$amount` (credit or free/zero) is always allowed; a
    negative `$amount` (a debit/purchase) is only allowed if
    `$balance + $amount >= 0`. This intentionally lets free (`0`) items through
    even on a negative balance.
  - `doTransactionTo(...)` — persists a new `AccountTransactionModelImpl` row
    inside a Doctrine transaction (`Application::getEntityManager()->wrapInTransaction(...)`).
    Does **not** check affordability.
  - `attemptTransactionTo(...)` — checks `canApplyTransaction(...)` against the
    live balance and only then calls `doTransactionTo(...)`; otherwise throws
    `InsufficientFundsException`.
  - `createDebitAction(...)` / `productTransactionDialog(...)` — look up a
    `ProductModelImpl` by name and build a `TransactionDialog` pre-filled with
    its price and label, used by shop dialogs to confirm a purchase before
    charging.
- **`ProductModelImpl`** (`src/classes/models/`, table `ane_products`) —
  a purchasable catalog entry: `name` (internal key), `label`, `detail`
  (description), `amount` (price in Credits), `visible`, `inventory` (the
  deliverable item/inventory reference handed to the vendor on purchase), and
  `category` (a dot-delimited path used to build browse folders, e.g.
  `addons.toys`).
- **`ProductRepository`** / **`ProductHelper`** (`src/classes/repos`,
  `src/classes/helpers`) — `fetchProductByName(...)`,
  `fetchProductsBySpecifier(...string $specifiers)` (lists sub-category
  "folders" under a dot-path), and `fetchProductsByCategory(...)` (lists the
  leaf products in a category) back the shop's folder browsing.
- **`ShopDialog`** / **`PointStoreDialog`** (`src/classes/prefabs/dialogs/`) —
  the shop UI. `PointStoreDialog` is the shop's landing dialog (Rewards /
  Browse); `ShopDialog` walks the category tree built from `ProductHelper`,
  shows the selected product's price/detail, and on **Buy** hands off to
  `TransactionHelper::createDebitAction(...)` → a `TransactionDialog`
  confirmation → on confirm, debits the account and calls
  `VendorHelper::getInstance()->vendProduct($product->getInventory())` (from
  the shared framework) to deliver the item in-world.
- **`RewardModelImpl`** (`src/classes/models/`, table `ane_rewards`) — a
  reward *definition*: `name` (lookup key, may have multiple rows so a random
  one can be picked), `type` (`RewardTypeEnum`), `label`, and `value` (either a
  Credit amount or a product/inventory reference, depending on `type`).
- **`RewardTypeEnum`** — `TYPE_CREDIT` (adds Credits via `TransactionHelper`)
  or `TYPE_PRODUCT` (delivers via `VendorHelper::vendProduct(...)`, from the
  shared framework).
- **`AccountRewardModelImpl`** / **`AccountRewardRepositoryImpl`** — the
  *grant* of a reward definition to a specific account, with a `givenOn`
  timestamp and a nullable `claimedOn` (unclaimed until processed).
- **`AccountRewardsHelper`** (`src/classes/helpers/`) — the reward workflow:
  - `tryReward(string $reward, ?callable $evaluate, ?callable $filter, bool $random)`
    — looks up `RewardModelImpl` rows by name, optionally filters them,
    optionally evaluates a gating condition first, then hands off to
    `handleReward(...)`. If more than one candidate matches and `$random` is
    true, one is picked at random; otherwise all matches are granted (Credit
    rewards are auto-claimed immediately; others are left unclaimed for the
    player to claim manually).
  - `handleReward(RewardModelImpl, bool $handleNow)` — announces the reward
    (`CommOwnerSay`), persists an `AccountRewardModelImpl` row, and if
    `$handleNow`, immediately calls `processReward(...)` and stamps
    `claimedOn`.
  - `processReward(RewardModelImpl)` — the actual payout: routes on
    `RewardTypeEnum` to `TransactionHelper::attemptTransactionTo(...)` (credit)
    or `VendorHelper::vendProduct(...)` (product).
  - `fetchUnclaimedRewards()` — lists rewards granted but not yet claimed.
- **`ManageRewardsDialog`** (`src/classes/prefabs/dialogs/`) — lists unclaimed
  `AccountRewardModelImpl` rows as buttons; selecting one claims it via
  `processReward(...)` and stamps `claimedOn`; a "Purge All" action removes all
  unclaimed reward grants outright.
- **`StoreHelper`** (`src/classes/helpers/StoreHelper.php`) — account-scoped
  browser catalog, purchases, and reward management, described below.
- **`StoreModule`** (`src/classes/modules/StoreModule.php`) — an older
  `ApiSubscriber` stub whose `vend` branch still does nothing. It is not the
  browser Store implementation.

### Flow: making a purchase

```
ShopDialog (browse category tree via ProductHelper)
        │  select product
        ▼
ShopDialog shows price/detail  ──Buy──▶ TransactionHelper::createDebitAction(...)
                                              │
                                              ▼
                                     TransactionDialog (confirm)
                                              │ confirm
                                              ▼
                          TransactionHelper::attemptTransactionTo(-price, label)
                                  │ canApplyTransaction() checks balance
                    insufficient  │  sufficient
                    ─────────────►│◄───────────────────────
                InsufficientFundsException     doTransactionTo() persists debit row
                                              │
                                              ▼
                       VendorHelper::vendProduct($product->getInventory())
                                  delivers the item in-world
```

### Flow: granting and claiming a reward

```
some subsystem ──▶ AccountRewardsHelper::tryReward('event.name', ...)
                        │
                        ▼
              look up RewardModelImpl rows by name (+ filter/evaluate)
                        │
                        ▼
                handleReward(rewardModel, handleNow)
                        │
          handleNow=true (Credit rewards)      handleNow=false (Product rewards)
                        │                                  │
                        ▼                                  ▼
             processReward() pays out            AccountRewardModelImpl saved,
             immediately, claimedOn set           claimedOn left null
                                                            │
                                                            ▼
                                        player claims later via ManageRewardsDialog
                                                → processReward() → claimedOn set
```

### Browser Store requests

`StoreHelper::on_api()` handles `/api?class=StoreHelper`. It resolves the account
from the current session, not from a client-supplied account or character id.
`AbstractAneState::on_initialized()` subscribes it in all states, and
`__unserialize()` adds it to restored sessions. An active character and tester
role are not checked by this helper; tester gating controls the dashboard
opening route, not this API's authorization.

| Request | Inputs and behavior |
|---|---|
| GET | Returns `ok`, ledger `balance`, visible `products`, and this account's unclaimed `rewards`. A `do` parameter is rejected on GET. |
| POST `do=purchase` | Body: `productId` (product name), `expectedPrice` (integer), and `requestId` (UUID). Rechecks visibility, nonnegative price, nonblank inventory, and affordability before debiting and delivering. |
| POST `do=claim` | Body: `rewardId` (UUID). Finds the grant within this account and refreshes it; an already claimed grant is a successful no-op. Credit values must be nonnegative integers, and product values must be nonblank. |
| POST `do=purge` | Body: `confirmed` must be boolean `true`. Removes only this account's unclaimed grants, without delivering or crediting them. |

Successful actions return a fresh snapshot. Products include `id`, `label`,
`detail`, `category`, `price`, and `available`; `available` checks price and
inventory, **not** whether the account can afford the product. Rewards include
`id`, `label`, `type` (`credit` or `product`), `value`, and `givenOn`. Product
reward values are inventory references and must not be copied into published
end-user help.

`ProductRepository::getVisibleProducts()` sorts by category then label;
`getVisibleProductByName()` applies the same visibility rule at checkout. Both
use the numeric `p.visible = 1` predicate because the deployed column is
smallint despite its legacy boolean entity mapping. Do not substitute boolean
criteria without reconciling the schema and mapping.

Validation errors return `ok: false` with a specific `error`; unexpected errors
are logged and return a generic refresh instruction. Other verbs and unknown
actions are rejected.

### Browser transaction and retry boundaries

1. Store writes take a pessimistic account lock outside SQLite, serializing
   writes through this helper across tabs/workers. This is not a guarantee that
   unrelated ledger writers or the older HUD flow take the same lock.
2. Inside an existing request transaction, earlier managed changes are flushed
   before creating the `ane_store_request` savepoint. Store failure rolls back
   only to that savepoint, preserving earlier HUD work and avoiding a
   rollback-only enclosing request. Without an enclosing transaction, the
   helper begins and commits or rolls back its own transaction.
3. Purchases persist and flush a debit whose id is `requestId`, then call
   `VendorHelper::vendProduct()` for the current account. A caught delivery
   failure rolls back the debit and detaches that debit entity, not the entire
   managed session. Reward claims pay out before setting `claimedOn`; successful
   writes are flushed before the savepoint is released or transaction committed.
4. A purchase retry should reuse its UUID. Once a matching account ledger row
   exists, the same product/reason returns without another debit or delivery.
   Reusing it for a different reason is rejected. Product availability is still
   checked first, and the reason includes the product label: hiding or renaming
   a product can therefore make a retry fail rather than return success. For a
   new purchase, `expectedPrice` must strictly equal the current integer price.

> **Delivery boundary:** the vendor protocol has no delivery receipt or
> idempotency key. A database rollback cannot undo an item already delivered
> externally. A delivery followed by transaction failure, or a lost response,
> therefore does not establish exactly-once delivery. Reusing a committed
> purchase UUID prevents repeat vending, but a new UUID is a new purchase.
> Maintainers should confirm the intended reconciliation policy before offering
> stronger delivery guarantees.

`tests/e2e/cases/StoreApiPurchasesAndRewardsProtectAccountBalanceTest.php` covers
account scope, stale prices, retries, reward claims/purge, delivery failures,
request-state preservation, and restored-session registration using a delivery
fixture. `tests/integration/helpers/StoreVisibilityQueryTest.php` checks both
numeric visibility predicates; neither test proves live vendor delivery.

### Extension points

- **New product:** add a row to the `ane_products` table (name, label, detail,
  amount, category, inventory reference); it appears automatically in
  `ShopDialog`'s category browser.
- **New reward:** add a row to `ane_rewards`, then call
  `AccountRewardsHelper::tryReward('the-reward-name')` from wherever the reward
  should be triggered (an event handler, a command, a milestone check).
- **New payout type:** extend `RewardTypeEnum` and add a case to
  `AccountRewardsHelper::processReward(...)`.

See [Architecture](architecture.md) for how the store fits into the overall
architecture, and [Accounts & Profiles](account-and-profiles.md) for how an
account (the thing that owns a Credit balance) relates to profiles/characters.
