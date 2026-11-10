---
audience: developer
summary: Replace a lower environment's PostgreSQL database with a snapshot from the environment above it.
---

# Clone an environment database

For the reported PostgreSQL **17.9** server, use **17.x** command-line clients.
On macOS with Homebrew, install them once and select them in each shell:

```bash
brew install libpq@17
export PG_BIN="$(brew --prefix libpq@17)/bin"
```

From the repository root, run either:

```bash
php bin/clone-database.php prod-to-test
php bin/clone-database.php test-to-local
```

Run these separately to move a snapshot through both environments. With no
argument, the script asks which direction to use. `--help` shows usage.

The script prompts for the source and destination host, port, database name,
PostgreSQL role, and password. Defaults are `127.0.0.1`, `5432`, `ane`, and
`postgres`. Use the forwarded ports if connecting through proxies or SSH tunnels.
Password input is hidden. Enter each endpoint's password, or press Enter to use
existing authentication such as `.pgpass`, `PGPASSFILE`, or `PGPASSWORD`.
The script does not load `.env`, application configuration, saved IDE passwords,
or Composer dependencies.

Entered passwords are used for the current run and passed through `PGPASSWORD`
only in the corresponding child process's environment. They are not added to
command arguments, shell history, `.env`, or `.pgpass`. The destination password
also covers its `postgres` maintenance connection. Source and destination
passwords can differ; leading/trailing spaces and punctuation are preserved.

## Requirements

- PHP CLI with `proc_open`, and an installation containing `psql`, `pg_dump`,
  and `pg_restore` (see client discovery below).
- PostgreSQL 15 or newer. Prefer clients matching both servers' major version.
  The dump client must be at least as new as the source; the restore client
  must be at least as new as the dump client; the destination must be at least
  as new as both clients. Downgrades are rejected.
- Existing connectivity and either a password entered at the prompt or existing
  libpq authentication. Existing TLS configuration can still be used.
- Source role can connect and read all objects/data being copied. Destination
  role can connect to the `postgres` maintenance database, create databases,
  own/drop the destination, disconnect its sessions, and install required
  extensions. Required extension packages must exist on the destination server.
- Enough temporary disk space on the machine running the script for a compressed
  source dump. The destination may already exist or be created by this script.

Stop the destination application and workers before starting, and keep them
stopped until the clone completes. Verify the displayed endpoints: environment
labels describe the direction you chose, and cannot identify which environment
an arbitrary host or forwarded port actually serves. Keep proxies/tunnels fixed
throughout the operation.

## Finding PostgreSQL client tools

The script checks local client tools before asking for connection details. It
uses one complete installation, searching `PATH` first and then common Homebrew,
Postgres.app, Linux, and Windows PostgreSQL installation directories. Homebrew's
`libpq` tools can be installed without being on `PATH`; the script finds them
under `/opt/homebrew/opt/libpq/bin` or `/usr/local/opt/libpq/bin` automatically.

Set `PG_BIN` to choose a specific installation. An invalid or incomplete override
fails immediately instead of falling back to a different version:

```bash
PG_BIN="$(brew --prefix libpq@17)/bin" php bin/clone-database.php prod-to-test
```

If clients are missing, install clients matching your database servers. For
the current PostgreSQL **17.9** server on macOS:

```bash
brew install libpq@17
PG_BIN="$(brew --prefix libpq@17)/bin" php bin/clone-database.php prod-to-test
```

This command uses the client binaries; starting a local PostgreSQL service is
not needed to clone remote databases. Homebrew documents the package and its
included tools in [libpq@17](https://formulae.brew.sh/formula/libpq@17). A newer
17.x patch release (for example, 17.11) is suitable for a 17.9 server; the script
compares major versions. The JDBC driver version shown by an IDE is separate
from the `pg_dump`, `pg_restore`, and `psql` tools used here.

Check the actual server versions when selecting a client version. The repository
declares PostgreSQL 15 in `cli-config.php`, but that does not verify a running
server's version. A newer Homebrew `libpq` installation can be too new for the
destination; preflight reports the detected source, destination, and client
versions before making changes. Use `PG_BIN` to select the compatible version;
installing `libpq@17` alone does not override an existing default `libpq` 18.x
installation. Verify each destination also supports PostgreSQL 17 before using
17.x clients; copying into an older major version is rejected.

## Password authentication and saved IDE connections

An IDE connection using **User & Password** succeeds because the IDE supplies
its saved password. PostgreSQL command-line tools do not automatically receive
that password. Enter that password at the script's hidden password prompt for
each connection. No password-file setup is needed when entering passwords.

The error `fe_sendauth: no password supplied` means the server was reached and
requested a password, but none was available. Rerun and enter the password, or
configure a password file as described below and leave the prompt blank.
The child tools still receive `--no-password` to prevent them from issuing
additional prompts; authentication uses the password supplied by the script or
existing libpq settings.

To save credentials for future runs, for the `ane-user` role with `ane-prod` and
`ane-test` on port 5432, create or edit `~/.pgpass` locally. First set its
permissions, then open it in your editor:

```bash
touch ~/.pgpass
chmod 600 ~/.pgpass
nano ~/.pgpass
```

Add these entries, replacing `YOUR_PASSWORD` with the database password saved
in the IDE. Keep any other entries you already use:

```text
127.0.0.1:5432:ane-prod:ane-user:YOUR_PASSWORD
127.0.0.1:5432:ane-test:ane-user:YOUR_PASSWORD
127.0.0.1:5432:postgres:ane-user:YOUR_PASSWORD
```

Use **127.0.0.1** at both host prompts with these entries. A literal `localhost`
prompt needs `localhost` entries instead. Using `127.0.0.1` also avoids an IPv6
`::1` refusal from a proxy listening only on IPv4; it does not change password
requirements. For other ports, roles, or local database names, add matching
entries. The destination's `postgres` entry is required for preflight and
drop/recreate, even though the application uses `ane-test`.

The format is `host:port:database:user:password`. Escape any `:` or `\` within a
field with `\`. On macOS/Linux, PostgreSQL ignores password files readable by
group or others, so keep mode `600`. A custom file can be selected with
`PGPASSFILE=/absolute/path/to/password-file`; Windows uses
`%APPDATA%\postgresql\pgpass.conf` by default. See
[PostgreSQL's password-file documentation](https://www.postgresql.org/docs/17/libpq-pgpass.html).

## Replacement behavior

The script checks connections, permissions, server/client versions, encoding,
and whether both endpoints identify the same database. It rejects the maintenance
and template databases as destinations. Database names accept up to 63 ASCII
letters, digits, underscores, or hyphens, without a leading hyphen.

After these checks, type the displayed destination `host:port/database` exactly
to confirm replacement. Anything else cancels. The script then completes a
custom-format source dump and reads its archive directory before issuing any
destructive command. The dump captures a consistent source snapshot; see
[PostgreSQL's pg_dump documentation](https://www.postgresql.org/docs/17/app-pgdump.html).

The destination database is dropped, disconnecting its existing sessions, then
recreated from `template0`. This removes destination-only tables, schemas, and
other database objects as well as existing rows. The restore copies schema,
data, and sequence values, with a single transaction and failure-on-error.
Objects are owned by the destination role; source ownership, grants, and
tablespace assignments are omitted. The source receives only read operations.

This copies one PostgreSQL database. It does not copy cluster roles, database
grants/settings, locales, Redis, uploaded files, or environment configuration.
The new database uses destination `template0` locale defaults. Its encoding must
match the source, or preflight rejects the copy. Data is copied unchanged,
including any stored tokens or external addresses; it is not anonymized.

## Failures and recovery

Connection, permission, version, dump, and archive-directory errors stop before
the destination is dropped. Once replacement begins, a failure can leave the
destination missing or empty. Drop/recreate is not rolled back; the restore's
transaction prevents a partially restored schema. See
[PostgreSQL's pg_restore documentation](https://www.postgresql.org/docs/17/app-pgrestore.html).

On success or a failure before replacement, temporary dump files are removed.
On failure during replacement, the script exits nonzero and prints the retained
source dump's path in a private temporary directory. Keep destination traffic
stopped, fix the reported issue, and rerun the script, or restore that archive
with `pg_restore` into a newly created empty database. Remove retained dumps
after recovery. The script does not back up the old destination contents.

Integration coverage is in `tests/integration/infrastructure/DatabaseClonerTest.php`.
Run it with the rest of the suite using `composer test:integration`.
