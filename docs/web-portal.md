---
audience: mixed
summary: One-off browser hand-offs for linking optional outside services.
---

# The Web Portal

## For end-users

### What it is

Some optional connections, such as a connected toy or a character directory,
open a small **web page** to complete linking. Follow the instructions there,
then return to the virtual world. Unlike the companion web dashboard, this is
a one-off step rather than a live view of your character.

### How you use it

1. From the relevant settings menu (for example, connecting a toy or linking a
   character directory account), choose to link/connect.
2. A browser window opens showing a simple page branded for that connection —
   it explains what you're about to link and why.
3. Follow that service's linking instructions on the page.
4. Once you submit, the page confirms success (or shows an error) and the
   connection is now active on your account. You can close the browser window
   and return to the virtual world.

If linking fails, read the page's message and start again from the same settings
menu rather than sharing your personal sign-in information in chat.

---

## For developers

### Purpose

The portal is a small, generic browser hand-off used whenever a third-party
integration needs a step that can't happen through in-world dialogs — chiefly
credential entry (F-List login) or displaying a scannable pairing code
(Lovense toy pairing). See
[Third-Party Integrations & Product Compatibility](third-party-integrations.md)
for the integrations that use it.

### Pieces

- **`PortalHandle`** (`src/classes/actions/portal/PortalHandle.php`) — a
  builder for one portal "session": page branding (`setPageTitle()`,
  `setPageImage()`, `setBackgroundColor()`/`setForegroundColor()`/
  `setTextColor()`), the portal flavour (`setPortalType(PortalTypeEnum::LOGIN`
  or `::IMAGE)`), and a callback (`CallableReference`) invoked with the result
  via `process(bool $success)`. `showPortal(...)` stamps in the caller's
  `agentKey`/`agentName` and hands off to `PortalService`.
- **`PortalService`** (`src/classes/services/PortalService.php`) — opens the
  portal URL in the in-world media browser
  (`MediaModule::openMediaBrowserWithQuery(...)`) pointed at `ui/portal.php`,
  remembers the active `PortalHandle` (`saveHandle()`), and handles the
  page's callback POST (`on_api(...)`): it matches the returned `handle`
  against the saved one, decrypts the submitted username/password (see below),
  and invokes the handle's registered `PortalSubscriber::on_authorize(...)`.
  On success it closes the media browser; on failure it throws so the page can
  show an error.
- **`ui/portal.php`** — the actual web page. It renders branding from query
  parameters (colors, logo, title, and either a QR/pairing image for
  `type=image` or a login form for `type=login`), and for the login form,
  encrypts the submitted username/password client-side with AES (via
  `crypto-js`) using a key derived from the account's `uuid` before POSTing —
  the server-side `PortalService::cryptoJsAesDecrypt(...)` reverses this with
  the same key (`md5(ownerKey)`), matching the client-side `cryptojs-aes-php`
  format.
- **`PortalTypeEnum`** — `LOGIN` (username/password form) or `IMAGE` (a
  pairing/QR code display, e.g. `LovenseDialog`'s pairing step).
- **`PortalSubscriber`** (`src/interfaces/services/PortalSubscriber.php`) —
  implemented by whatever needs the result, e.g. `FlistModule::on_authorize(...)`
  (submits the decrypted credentials to `FlistApi`) or `LovenseApi::on_authorize(...)`
  (completes the pairing).

### Flow

```
in-world dialog ──▶ PortalHandle::newInstance($caller, 'portal_access')
                        ->setPortalType(...)->setSubscriber($caller)
                        ->showPortal($previousDialog)
                            │
                            ▼
             PortalService opens ui/portal.php in the in-world
             media browser, passing branding + a one-time handle
                            │
                     user interacts with the page
                            │
                            ▼
        ui/portal.php POSTs back to the portal-service API action
       (username/password AES-encrypted client-side, or a bare handle
        confirmation for the image/QR flow)
                            │
                            ▼
   PortalService::on_api() matches the handle, decrypts credentials,
       calls PortalHandle::process($subscriber->on_authorize($this))
                            │
                            ▼
       on success: closes the media browser and returns to the caller
                   via the original CallableReference
```

### Security notes

- The AES key is derived from the account's in-world owner key
  (`md5($ownerKey)`), not a fixed secret, so it is unique per account/session.
- The handle is a one-time, per-request identifier (`uniqid(...)`); a mismatch
  or replay against a stale handle fails authorization.
- No credentials are logged; only the decoded content structure is logged for
  debugging (see `PortalService::on_api()`).

### Extension points

- **New portal-based linking flow:** build a `PortalHandle`, choose or extend
  `PortalTypeEnum` if a new page layout is needed, implement
  `PortalSubscriber::on_authorize(...)` on the integration that consumes the
  result, and trigger it from a dialog the same way `LovenseDialog` /
  `FlistDialog` do.

See [Architecture](architecture.md) for how the portal fits into the overall
architecture, and
[Third-Party Integrations & Product Compatibility](third-party-integrations.md)
for the integrations that rely on it.
