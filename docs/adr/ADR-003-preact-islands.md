# ADR-003: Use Preact Islands For Interactive UI

## Status

Accepted

## Context

The todo form, todo list, category manager, category filter, navbar menu, and
theme toggle need client-side interactivity. The rest of the page can stay
server-rendered.

## Decision

Use Fresh islands backed by Preact and Preact Signals.

## Consequences

- Only interactive components hydrate on the client.
- Shared state between islands is simple through signals.
- Client code remains smaller than a full SPA.
- Cross-island state must stay modest to avoid hidden coupling.
