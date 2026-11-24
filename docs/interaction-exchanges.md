# Shared interaction exchanges

NueKryL's `InteractionExchangeService` coordinates interactions across requests.
Its model/repository contracts, lifecycle, expiry, immutable selection, and
transactional claims can be reused by other applications. ANE's
`InteractionExchangeHelper` supplies character authorization and constructs
`InteractionExchangeModelImpl`, which owns all eleven column mappings for
`ane_interaction_exchanges` and its references to ANE profiles. Its constructor
validates the type, origin, and lifetime and initializes the expiry. Each ability supplies its own
validation, effects, and presentation.

`Application::doConfigure()` maps the framework's `InteractionExchangeModel`
interface to ANE's entity and `InteractionExchangeRepository` to the framework's
`DoctrineInteractionExchangeRepository`. The ANE helper implements the required
`InteractionExchangePolicy`; it delegates lifecycle operations to the framework
service instead of maintaining another copy of its SQL and transition logic.
See the [framework exchange guide](https://github.com/NueKryL/nuekryl-php/blob/main/docs/INTERACTION_EXCHANGES.md)
for the reusable contracts.

The actual game records remain in their existing tables. For example, Oviposit
changes the host/incubator of existing ova or pregnancies; an exchange does not
contain or duplicate those records.

## Lifecycle and ownership

An exchange has a server-selected `type`, initiating `actor`, receiving `target`,
and `origin` (such as `hud` or `web`). Its UUID identifies one interaction. Actor and
target are the selected profiles, not just account IDs: changing a character
must not silently retarget an outstanding interaction.

UUID is ANE's choice, not a framework requirement. NueKryL accepts integer or
string exchange and participant IDs, including UUID strings. The default
repository derives the identifier's binding type from Doctrine metadata rather
than assuming every application uses UUIDs. Another application can map integer
profiles and a generated integer exchange ID without modifying ANE or the
coordinator. ANE retains its UUID primary key, profile foreign keys, and existing
string `requestId` API.

| State | Meaning | Transition |
| --- | --- | --- |
| `pending` | Waiting for the recipient's initial response | Recipient processes it into `ready` |
| `ready` | Recipient result is available for the actor's selection | Actor submits immutable input into `submitted` |
| `submitted` | Selected input awaits recipient processing | Recipient processes it into `completed` |
| `processing` | Transaction has claimed the expected state | Internal to the processing transaction |
| `completed` | The database operation and its result committed | Terminal; retries reuse the result |
| `failed` | Processing was rejected or failed | Terminal |

An expiry timestamp is explicit on each row. Oviposit uses 120 seconds from
creation for the whole interaction; checking availability does not restart the
clock. Terminal results remain readable after expiry so a retry can determine
what already happened. Creating an exchange opportunistically removes rows
whose expiry is more than one day old. This is temporary coordination data,
not a permanent gameplay audit; an idle installation does not run cleanup until
another exchange is created.

A fresh Oviposit availability check replaces earlier `pending` and `ready` checks
of the same type from the same actor profile to the same target profile. HUD and
web checks share this rule. Creation and removal commit together. Each new
check has its own ID and deadline. A late HUD message for a removed ID is
ignored, and a web client polling that ID receives the unavailable-request
response. Submitted deposits can still finish, and terminal receipts follow
the usual retention period.

The framework checks exchange type as well as ID, preventing a handler for one
ability from operating on another ability's request. Actor ownership requires
the active profile and account. The recipient transport check verifies the
receiving account and authenticated sending account. Processing also rechecks
both active profiles inside the transaction through ANE's participant policy,
rejecting a changed character. Each domain handler still checks its
grant, range, blocks, quantities, anatomy, and other rules using current data.

## ANE adapter API

Use `InteractionExchangeHelper::getInstance()`. The adapter preserves the
existing call shape for ANE abilities while delegating to NueKryL:

| Method | Purpose |
| --- | --- |
| `create(type, actor, target, origin = 'web', ttlSeconds = 120, replaceUnsubmitted = false)` | Create a `pending` exchange, optionally replacing earlier open checks for the same type and directed pair |
| `find(id, type)` | Look up an exchange for this handler's type |
| `owned(id, type)` | Require the current actor account and active profile |
| `submit(exchange, payload)` | Atomically select input once, changing `ready` to `submitted` |
| `process(exchange, expected, next, callback)` | Claim the expected state and run database work plus result persistence in one transaction |
| `fail(id, type, expected, error)` | Conditionally record failure, including after EntityManager recovery |
| `isReceiver(exchange, senderOwnerUuid)` | Check that this is the selected recipient receiving a message from the actor |
| `isReply(exchange, senderOwnerUuid)` | Check that this is the selected actor receiving a reply from the recipient |

`submit()` returns true for a newly accepted selection and false for an
identical retry; a conflicting selection throws. Types and origins are short
lowercase identifiers, and the lifetime must be positive.

The processing callback receives `(EntityManager $em, InteractionExchangeModelImpl
$exchange)` and returns the result array. Supported processing steps are
`pending` to `ready` and `submitted` to `completed`. The framework's conditional
claim ensures repeated delivery does not run the same callback again. Exceptions
propagate after rollback; the domain handler can catch them and use `fail()` to
record its own error through the recovered EntityManager. It does not make
arbitrary external actions inside that callback transactional.

The model exposes `type`, `actor`, `target`, `origin`, `state`, `payload`,
`result`, and `error`, plus `getId()`, `getCreated()`, `getExpiresAt()`, and
`expired()`. Keep transitions through the helper so callers cannot bypass the
conditional claims. Payload/result shapes belong to the domain adapter.

## Native HUD and web adapters

Transport and presentation stay outside the shared helper. Both a native HUD
dialog and a web API action can create and submit the same kind of exchange.
`origin` lets the domain handler choose its presentation without changing
processing or inventing another storage path.

Oviposit uses `type: ability.oviposit`:

- `inspect` creates a pending exchange and sends its ID to the target through
  `InteractionService`. The target's HUD session knows its current clothing,
  plugins, and occupied orifices; it stores those choices in
  `result.orifices`.
- `deposit` submits `payload: { orifice, quantity, kind }`. The recipient checks
  the current rules again, transfers the selected records, and returns a
  completion result. The shared state `submitted` is presented as `depositing`
  by the existing Oviposit API, preserving the web and HUD contract.
- A native HUD reply opens the selection dialog or reports the result. The web
  adapter reads the same exchange using `requestId` and polls until completion
  or failure. Both routes use `AbilityOvipositHelper`; the generic helper has no
  dependency on HTTP endpoints or HUD dialog classes.

For a second feature, a hypothetical `ability.offer-item` adapter could create
an exchange for the giver and recipient, return allowed transfer options from
the recipient's initial check, then submit `{ itemId, quantity }`. Its recipient
handler would call `process($exchange, 'submitted', 'completed', ...)`, check
ownership and capacity, update item ownership in that callback's transaction,
and return `{ message, transferredItemId }`. The native dialog and web form
would call that adapter's same submit method. No new exchange entity, table,
or transport-specific storage is required. This is an extension example, not
an implemented ability.

## Transaction and delivery limits

The shared row makes status available independently of either player's
serialized session. Keeping the claim, domain database writes, and completion
in the same database transaction prevents duplicate transfers and partial
batches. The surrounding framework session transaction may commit later; a
helper transaction returning does not bypass that outer transaction.

This is not an outbox or a guaranteed-delivery queue. `InteractionService`
still dispatches messages separately; a queued message can fail to reach the
recipient. An exchange then expires and the caller must start again. Repeating
an HTTP submission reports the existing selection/result; it does not promise
to resend a lost transport message. Browser status reads can still observe a
committed result when the recipient's reply notification is lost.

Oviposit applies recipient stat reactions and narration after its transfer
callback returns. These effects and external output are not covered by the
shared helper's claim/transfer transaction. Do not describe the exchange as
exactly-once delivery of every side effect, or use Redis Pub/Sub delivery as
proof that a database change committed. Any future retry/outbox design must
address those effects separately.

## Deployment

Install the committed Composer lockfile pinned to NueKryL `26.11.17.1` before
deploying this adapter. Publish that framework commit and tag before a clean
remote install. An older dependency without
`InteractionExchangeService` cannot run it; the framework release and ANE's
dependency update must be delivered together.

Apply `ddl/InteractionExchanges.sql` and `ddl/ProfileReproductionIndexes.sql`
before deploying Oviposit with the shared exchange model. The first creates
the shared table and lookup indexes on new installations. On existing installations,
rerun it to rename the `x_` columns to `ie_` in place, preserving in-flight exchanges,
foreign keys, and indexes. Coordinate the rename with the backend rollout because
the old and new mappings require different column names. The second script corrects
reproductive record cardinality. Both scripts are transactional and rerunnable.

The migration reads the deployed `ane_profiles.p_id` type from PostgreSQL's
catalog and uses that same type for `ie_actor` and `ie_target`. This supports
existing `VARCHAR(36)` profile keys and fresh schemas using native `UUID`
without changing the profile table. The exchange's own `ie_id` is always `UUID`.

The reproductive index script replaces single-column uniqueness indexes on
ova/pregnancy host, parent, and species relationships with ordinary indexes,
matching the ManyToOne mappings and supporting multiple eggs. Preview the schema
diff for installations with customized index/constraint names. No ability
grants are seeded by these migrations.
