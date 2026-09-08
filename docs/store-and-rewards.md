# The Store and Rewards Economy

How players spend and earn **Credits** — a simple in-world currency used to buy
optional add-ons and unlock features — and how one-off rewards are granted and
claimed.

- **🎮 End-User Documentation** — what the shop and rewards are and how to use
  them.
- **🧑‍💻 Developer Documentation** — how balances, purchases, and rewards are
  modelled and processed.

---

## 🎮 End-User Documentation

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

---

## 🧑‍💻 Developer Documentation

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
- **`TransactionHelper`** (`src/classes/helpers/`) — the single place balance
  changes are decided and applied:
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
- **`StoreModule`** (`src/classes/modules/`) — currently a thin
  `ApiSubscriber` stub reserved for exposing store actions (e.g. `vend`) over
  the HTTP API; not yet wired to real behaviour.

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

### Extension points

- **New product:** add a row to the `ane_products` table (name, label, detail,
  amount, category, inventory reference); it appears automatically in
  `ShopDialog`'s category browser.
- **New reward:** add a row to `ane_rewards`, then call
  `AccountRewardsHelper::tryReward('the-reward-name')` from wherever the reward
  should be triggered (an event handler, a command, a milestone check).
- **New payout type:** extend `RewardTypeEnum` and add a case to
  `AccountRewardsHelper::processReward(...)`.

See [System Design](system-design.md) for how the store fits into the overall
architecture, and [Accounts and Profiles](account-and-profiles.md) for how an
account (the thing that owns a Credit balance) relates to profiles/characters.
