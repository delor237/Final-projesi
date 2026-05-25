# ADR-001: Use Deno Fresh

## Status

Accepted

## Context

The project needs a modern TypeScript web framework with server-side rendering,
file-based routing, and a small client JavaScript footprint.

## Decision

Use Deno Fresh as the main web framework.

## Consequences

- Pages can be rendered on the server by default.
- Interactive UI is isolated into Preact islands.
- The project can run naturally on Deno Deploy.
- Some ecosystem packages are less common than Node/NPM alternatives.
