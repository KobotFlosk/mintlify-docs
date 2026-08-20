# The Web Portal

How a browser-based hand-off page is used to securely link outside accounts
(such as a connected-toy pairing or a character-directory login) to your
in-world account, without ever typing credentials into the virtual world
itself.

- **🎮 End-User Documentation** — what the portal is and when you'll see it.
- **🧑‍💻 Developer Documentation** — how the hand-off and authorization flow
  works.

---

## 🎮 End-User Documentation

### What it is

Some optional connections — like pairing a connected toy or logging into a
linked character directory — need you to enter a code or a username/password.
Rather than doing that inside the virtual world (which isn't a safe place to
type a password), the companion opens a small **web page** for that one step,
then hands control back once you're done.

### How you use it

1. From the relevant settings menu (for example, connecting a toy or linking a
   character directory account), choose to link/connect.
2. A browser window opens showing a simple page branded for that connection —
   it explains what you're about to link and why.
3. Depending on what's being linked, you'll either scan/display a code or type
   a username and password directly into that page.
4. Once you submit, the page confirms success (or shows an error) and the
   connection is now active on your account. You can close the browser window
   and return to the virtual world.

Your credentials are only ever seen by that one page for that one exchange —
they are encrypted in your browser before being sent, and the in-world object
never sees them directly.

---

## 🧑‍💻 Developer Documentation

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

See [System Design](system-design.md) for how the portal fits into the overall
architecture, and
[Third-Party Integrations & Product Compatibility](third-party-integrations.md)
for the integrations that rely on it.
