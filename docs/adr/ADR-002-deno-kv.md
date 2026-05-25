# ADR-002: Use Deno KV For Persistence

## Status

Accepted

## Context

The app needs persistent storage for users, sessions, todos, and categories. The
project should stay simple and avoid external database setup.

## Decision

Use Deno KV as the primary database.

## Consequences

- Local development can use a file-backed KV database.
- Deno Deploy can use hosted Deno KV.
- Key design must be explicit because there is no relational schema.
- Complex analytical queries are out of scope for this project.
